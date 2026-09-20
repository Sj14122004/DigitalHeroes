import prisma from "../lib/prisma";

const getCharities = async (search?: string) => {
  return prisma.charity.findMany({
    where: {
      isActive: true,
      ...(search
        ? {
            name: {
              contains: search,
              mode: "insensitive"
            }
          }
        : {})
    },
    orderBy: [
      { isFeatured: "desc" },
      { name: "asc" }
    ]
  });
};

const getCharityById = async (charityId: string) => {
  const charity = await prisma.charity.findFirst({
    where: {
      id: charityId,
      isActive: true
    }
  });

  if (!charity) {
    throw Object.assign(new Error("Charity not found"), {
      statusCode: 404
    });
  }

  return charity;
};

const getSelectedCharity = async (userId: string) => {
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId,
      status: "ACTIVE"
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  if (!subscription) {
    throw Object.assign(new Error("Active subscription not found"), {
      statusCode: 404
    });
  }

  return prisma.charitySelection.findUnique({
    where: {
      subscriptionId: subscription.id
    },
    include: {
      charity: true
    }
  });
};

const selectCharity = async (
  userId: string,
  charityId: string,
  contributionPercent: number
) => {
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId,
      status: "ACTIVE"
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  if (!subscription) {
    throw Object.assign(new Error("Active subscription not found"), {
      statusCode: 404
    });
  }

  const charity = await getCharityById(charityId);

  const minimumCharityPercent = Number(
    process.env.CHARITY_PERCENT || 10
  );

  const prizePoolPercent = Number(
    process.env.PRIZE_POOL_PERCENT || 80
  );

  if (contributionPercent < minimumCharityPercent) {
    throw Object.assign(
      new Error(
        `Charity contribution must be at least ${minimumCharityPercent}%`
      ),
      { statusCode: 400 }
    );
  }

  const extraCharityPercent =
    contributionPercent - minimumCharityPercent;

  const remainingPrizePoolPercent =
    prizePoolPercent - extraCharityPercent;

  if (remainingPrizePoolPercent < 0) {
    throw Object.assign(
      new Error("Charity contribution is too high"),
      { statusCode: 400 }
    );
  }

  const contributionAmount =
    Number(subscription.amount) *
    (contributionPercent / 100);

  const prizePoolAmount =
    Number(subscription.amount) *
    (remainingPrizePoolPercent / 100);

  const selection = await prisma.$transaction(async (tx) => {
    const result = await tx.charitySelection.upsert({
      where: {
        subscriptionId: subscription.id
      },
      update: {
        charityId,
        contributionPercent,
        contributionAmount
      },
      create: {
        userId,
        charityId,
        subscriptionId: subscription.id,
        contributionPercent,
        contributionAmount
      },
      include: {
        charity: true
      }
    });

    await tx.subscription.update({
      where: {
        id: subscription.id
      },
      data: {
        charityPercentage: contributionPercent,
        charityAmount: contributionAmount,
        prizePoolAmount
      }
    });

    return result;
  });

  return selection;
};

export {
  getCharities,
  getCharityById,
  getSelectedCharity,
  selectCharity
};