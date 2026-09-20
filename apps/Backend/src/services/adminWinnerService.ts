import prisma from "../lib/prisma";

const getAllWinners = async () => {
  return prisma.winner.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      draw: {
        select: {
          month: true,
          year: true,
          winningNumbers: true,
          status: true
        }
      },
      payment: {
        select: {
          id: true,
          amount: true,
          status: true,
          paidAt: true
        }
      }
    }
  });
};

const approveWinner = async (winnerId: string) => {
  const winner = await prisma.winner.findUnique({
    where: { id: winnerId }
  });

  if (!winner) {
    throw Object.assign(new Error("Winner not found"), { statusCode: 404 });
  }

  if (!winner.proofUrl) {
    throw Object.assign(new Error("Winner proof has not been uploaded"), {
      statusCode: 400
    });
  }

  if (winner.status !== "PENDING") {
    throw Object.assign(new Error("Winner is not awaiting verification"), {
      statusCode: 400
    });
  }

  return prisma.$transaction(async (tx) => {
    const updatedWinner = await tx.winner.update({
      where: { id: winnerId },
      data: {
        status: "APPROVED",
        verifiedAt: new Date(),
        rejectionReason: null
      }
    });

    await tx.payment.upsert({
      where: { winnerId },
      update: {
        amount: winner.prizeAmount,
        status: "PENDING"
      },
      create: {
        userId: winner.userId,
        winnerId: winner.id,
        amount: winner.prizeAmount,
        status: "PENDING"
      }
    });

    return updatedWinner;
  });
};

const rejectWinner = async (
  winnerId: string,
  rejectionReason: string
) => {
  const winner = await prisma.winner.findUnique({
    where: { id: winnerId }
  });

  if (!winner) {
    throw Object.assign(new Error("Winner not found"), { statusCode: 404 });
  }

  if (winner.status !== "PENDING") {
    throw Object.assign(new Error("Winner is not awaiting verification"), {
      statusCode: 400
    });
  }

  return prisma.winner.update({
    where: { id: winnerId },
    data: {
      status: "REJECTED",
      rejectionReason,
      verifiedAt: new Date()
    }
  });
};

export { getAllWinners, approveWinner, rejectWinner };