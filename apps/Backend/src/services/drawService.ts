import prisma from "../lib/prisma";

const getMonthRange = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return { month: now.getMonth() + 1, year: now.getFullYear(), start, end };
};

const getCurrentDraw = async () => {
  const { month, year } = getMonthRange();

  return prisma.draw.findUnique({
    where: { month_year: { month, year } },
    include: {
      prizes: true,
      winners: {
        include: {
          user: { select: { id: true, name: true } }
        }
      }
    }
  });
};

const getMyEntry = async (userId: string) => {
  const { month, year } = getMonthRange();

  const draw = await prisma.draw.findUnique({
    where: { month_year: { month, year } }
  });

  if (!draw) return null;

  return prisma.drawEntry.findUnique({
    where: {
      drawId_userId: {
        drawId: draw.id,
        userId
      }
    }
  });
};

const enterDraw = async (userId: string, numbers: number[]) => {
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId,
      status: "ACTIVE"
    },
    orderBy: { createdAt: "desc" }
  });

  if (!subscription) {
    throw Object.assign(new Error("Active subscription required"), {
      statusCode: 403
    });
  }

  const { month, year } = getMonthRange();

  let draw = await prisma.draw.findUnique({
    where: { month_year: { month, year } }
  });

  if (!draw) {
    draw = await prisma.draw.create({
      data: {
        month,
        year,
        status: "DRAFT",
        winningNumbers: [],
        prizePool: 0,
        jackpot: 0
      }
    });
  }

  if (draw.status !== "DRAFT") {
    throw Object.assign(new Error("Draw entry is closed"), {
      statusCode: 400
    });
  }

  return prisma.drawEntry.upsert({
    where: {
      drawId_userId: {
        drawId: draw.id,
        userId
      }
    },
    update: { numbers },
    create: {
      drawId: draw.id,
      userId,
      numbers
    }
  });
};

const generateWinningNumbers = () => {
  const numbers = new Set<number>();

  while (numbers.size < 5) {
    numbers.add(Math.floor(Math.random() * 45) + 1);
  }

  return [...numbers].sort((a, b) => a - b);
};

const getMatchCount = (numbers: number[], winningNumbers: number[]) =>
  numbers.filter((number) => winningNumbers.includes(number)).length;

const simulateDraw = async () => {
  const { month, year } = getMonthRange();

  let draw = await prisma.draw.findUnique({
    where: { month_year: { month, year } }
  });

  if (!draw) {
    draw = await prisma.draw.create({
      data: {
        month,
        year,
        status: "DRAFT",
        winningNumbers: [],
        prizePool: 0,
        jackpot: 0
      }
    });
  }

  if (draw.status !== "DRAFT" && draw.status !== "SIMULATED") {
    throw Object.assign(new Error("Draw cannot be simulated"), {
      statusCode: 400
    });
  }

  const activeSubscriptions = await prisma.subscription.findMany({
    where: { status: "ACTIVE" },
    select: { prizePoolAmount: true }
  });

  const prizePool = activeSubscriptions.reduce(
    (total, subscription) => total + Number(subscription.prizePoolAmount),
    0
  );

  const winningNumbers = generateWinningNumbers();

  const entries = await prisma.drawEntry.findMany({
    where: { drawId: draw.id }
  });

  const matches = entries.map((entry) => ({
    entry,
    matchedNumbers: getMatchCount(entry.numbers, winningNumbers)
  }));

  const winners3 = matches.filter((item) => item.matchedNumbers === 3);
  const winners4 = matches.filter((item) => item.matchedNumbers === 4);
  const winners5 = matches.filter((item) => item.matchedNumbers === 5);

  const previousJackpot = Number(draw.jackpot);
  const fivePrize = prizePool * 0.25 + previousJackpot;
  const fourPrize = prizePool * 0.35;
  const threePrize = prizePool * 0.4;

  const jackpot = winners5.length === 0 ? fivePrize : 0;

  await prisma.$transaction(async (tx) => {
    await tx.winner.deleteMany({
      where: { drawId: draw!.id }
    });

    await tx.drawPrize.deleteMany({
      where: { drawId: draw!.id }
    });

    await tx.draw.update({
      where: { id: draw!.id },
      data: {
        winningNumbers,
        prizePool,
        jackpot,
        status: "SIMULATED",
        simulatedAt: new Date()
      }
    });

    await tx.drawPrize.createMany({
      data: [
        {
          drawId: draw!.id,
          matchType: "THREE",
          percentage: 40,
          amount: threePrize
        },
        {
          drawId: draw!.id,
          matchType: "FOUR",
          percentage: 35,
          amount: fourPrize
        },
        {
          drawId: draw!.id,
          matchType: "FIVE",
          percentage: 25,
          amount: fivePrize
        }
      ]
    });

    if (winners3.length > 0) {
      const amount = threePrize / winners3.length;

      await tx.winner.createMany({
        data: winners3.map(({ entry }) => ({
          drawId: draw!.id,
          userId: entry.userId,
          matchType: "THREE" as const,
          matchedNumbers: 3,
          prizeAmount: amount
        }))
      });
    }

    if (winners4.length > 0) {
      const amount = fourPrize / winners4.length;

      await tx.winner.createMany({
        data: winners4.map(({ entry }) => ({
          drawId: draw!.id,
          userId: entry.userId,
          matchType: "FOUR" as const,
          matchedNumbers: 4,
          prizeAmount: amount
        }))
      });
    }

    if (winners5.length > 0) {
      const amount = fivePrize / winners5.length;

      await tx.winner.createMany({
        data: winners5.map(({ entry }) => ({
          drawId: draw!.id,
          userId: entry.userId,
          matchType: "FIVE" as const,
          matchedNumbers: 5,
          prizeAmount: amount
        }))
      });
    }
  });

  return getCurrentDraw();
};

const publishDraw = async () => {
  const { month, year } = getMonthRange();

  const draw = await prisma.draw.findUnique({
    where: { month_year: { month, year } }
  });

  if (!draw || draw.status !== "SIMULATED") {
    throw Object.assign(new Error("Simulate the draw before publishing"), {
      statusCode: 400
    });
  }

  return prisma.draw.update({
    where: { id: draw.id },
    data: {
      status: "PUBLISHED",
      publishedAt: new Date()
    },
    include: {
      prizes: true,
      winners: true
    }
  });
};

export {
  getCurrentDraw,
  getMyEntry,
  enterDraw,
  simulateDraw,
  publishDraw
};