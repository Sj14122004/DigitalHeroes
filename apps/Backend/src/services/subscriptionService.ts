import Stripe from "stripe";
import prisma from "../lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const getPriceId = (plan: "MONTHLY" | "YEARLY") => {
  const priceId =
    plan === "MONTHLY"
      ? process.env.STRIPE_MONTHLY_PRICE_ID
      : process.env.STRIPE_YEARLY_PRICE_ID;

  if (!priceId) {
    throw Object.assign(
      new Error(`Stripe price ID is not configured for ${plan}`),
      { statusCode: 500 }
    );
  }

  return priceId;
};

const createCheckoutSession = async (
  userId: string,
  email: string,
  plan: "MONTHLY" | "YEARLY"
) => {
  const existingSubscription = await prisma.subscription.findFirst({
    where: {
      userId,
      status: "ACTIVE"
    }
  });

  if (existingSubscription) {
    throw Object.assign(
      new Error("You already have an active subscription"),
      { statusCode: 409 }
    );
  }

  const priceId = getPriceId(plan);

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [
      {
        price: priceId,
        quantity: 1
      }
    ],
    customer_email: email,
    client_reference_id: userId,
    metadata: {
      userId,
      plan
    },
    subscription_data: {
      metadata: {
        userId,
        plan
      }
    },
    success_url: `${process.env.FRONTEND_URL}/subscription/success`,
    cancel_url: `${process.env.FRONTEND_URL}/subscription/cancel`
  });

  return {
    url: session.url
  };
};

const handleWebhook = async (payload: Buffer, signature: string) => {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw Object.assign(
      new Error("STRIPE_WEBHOOK_SECRET is not configured"),
      { statusCode: 500 }
    );
  }

  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    webhookSecret
  );

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;

      if (session.mode !== "subscription") {
        break;
      }

      const userId =
        session.metadata?.userId || session.client_reference_id;

      const plan = session.metadata?.plan as
        | "MONTHLY"
        | "YEARLY"
        | undefined;

      const stripeSubscriptionId =
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription?.id;

      if (!userId || !plan || !stripeSubscriptionId) {
        break;
      }

      const stripeSubscription =
        await stripe.subscriptions.retrieve(stripeSubscriptionId);

      const amount = (session.amount_total || 0) / 100;

      const charityPercent = Number(
        process.env.CHARITY_PERCENT || 10
      );

      const prizePoolPercent = Number(
        process.env.PRIZE_POOL_PERCENT || 80
      );

      const charityAmount =
        amount * (charityPercent / 100);

      const prizePoolAmount =
        amount * (prizePoolPercent / 100);

      const startDate = new Date(
        stripeSubscription.start_date * 1000
      );

      const currentPeriodEnd =
        stripeSubscription.items.data[0]?.current_period_end;

      const endDate = currentPeriodEnd
        ? new Date(currentPeriodEnd * 1000)
        : null;

      await prisma.subscription.upsert({
        where: {
          stripeSubscriptionId
        },
        update: {
          status: "ACTIVE",
          amount,
          plan,
          startDate,
          endDate,
          stripeCustomerId:
            typeof stripeSubscription.customer === "string"
              ? stripeSubscription.customer
              : stripeSubscription.customer.id,
          charityAmount,
          prizePoolAmount
        },
        create: {
          userId,
          plan,
          status: "ACTIVE",
          amount,
          charityPercentage: charityPercent,
          charityAmount,
          prizePoolAmount,
          startDate,
          endDate,
          stripeCustomerId:
            typeof stripeSubscription.customer === "string"
              ? stripeSubscription.customer
              : stripeSubscription.customer.id,
          stripeSubscriptionId
        }
      });

      break;
    }

    case "invoice.paid": {
      const invoice = event.data.object;

      const stripeSubscriptionId =
        typeof invoice.parent?.subscription_details?.subscription === "string"
          ? invoice.parent.subscription_details.subscription
          : null;

      if (!stripeSubscriptionId) {
        break;
      }

      const existingSubscription =
        await prisma.subscription.findUnique({
          where: {
            stripeSubscriptionId
          }
        });

      if (existingSubscription) {
        await prisma.subscription.update({
          where: {
            stripeSubscriptionId
          },
          data: {
            status: "ACTIVE"
          }
        });
      }

      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object;

      const stripeSubscriptionId =
        typeof invoice.parent?.subscription_details?.subscription === "string"
          ? invoice.parent.subscription_details.subscription
          : null;

      if (!stripeSubscriptionId) {
        break;
      }

      await prisma.subscription.updateMany({
        where: {
          stripeSubscriptionId
        },
        data: {
          status: "PAST_DUE"
        }
      });

      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object;

      const status =
        subscription.status === "active" ||
        subscription.status === "trialing"
          ? "ACTIVE"
          : subscription.status === "past_due"
            ? "PAST_DUE"
            : subscription.status === "canceled"
              ? "CANCELLED"
              : "EXPIRED";

      const currentPeriodEnd =
        subscription.items.data[0]?.current_period_end;

      await prisma.subscription.updateMany({
        where: {
          stripeSubscriptionId: subscription.id
        },
        data: {
          status,
          endDate: currentPeriodEnd
            ? new Date(currentPeriodEnd * 1000)
            : undefined
        }
      });

      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object;

      await prisma.subscription.updateMany({
        where: {
          stripeSubscriptionId: subscription.id
        },
        data: {
          status: "CANCELLED",
          endDate: new Date()
        }
      });

      break;
    }
  }
};

const getMySubscription = async (userId: string) => {
  return prisma.subscription.findFirst({
    where: {
      userId
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};

const cancelSubscription = async (userId: string) => {
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId,
      status: "ACTIVE"
    }
  });

  if (!subscription?.stripeSubscriptionId) {
    throw Object.assign(
      new Error("Active subscription not found"),
      { statusCode: 404 }
    );
  }

  await stripe.subscriptions.update(
    subscription.stripeSubscriptionId,
    {
      cancel_at_period_end: true
    }
  );

  return {
    message:
      "Subscription will be cancelled at the end of the current period"
  };
};

export {
  createCheckoutSession,
  handleWebhook,
  getMySubscription,
  cancelSubscription
};