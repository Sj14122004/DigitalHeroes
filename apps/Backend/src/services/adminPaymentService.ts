import prisma from "../lib/prisma";

const getAllPayments = async () => {
  return prisma.payment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      winner: {
        select: {
          id: true,
          matchType: true,
          prizeAmount: true,
          status: true,
          draw: {
            select: {
              month: true,
              year: true
            }
          }
        }
      },
      subscription: {
        select: {
          plan: true,
          amount: true
        }
      }
    }
  });
};

const markPaymentPaid = async (paymentId: string) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId }
  });

  if (!payment) {
    throw Object.assign(new Error("Payment not found"), { statusCode: 404 });
  }

  if (payment.status === "PAID") {
    throw Object.assign(new Error("Payment is already marked as paid"), {
      statusCode: 400
    });
  }

  return prisma.$transaction(async (tx) => {
    const updatedPayment = await tx.payment.update({
      where: { id: paymentId },
      data: {
        status: "PAID",
        paidAt: new Date()
      }
    });

    if (payment.winnerId) {
      await tx.winner.update({
        where: { id: payment.winnerId },
        data: {
          status: "PAID",
          paidAt: new Date()
        }
      });
    }

    return updatedPayment;
  });
};

export { getAllPayments, markPaymentPaid };