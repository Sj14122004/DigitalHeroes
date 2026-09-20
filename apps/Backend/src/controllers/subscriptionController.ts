import { Request, Response } from "express";
import {
  createCheckoutSession,
  handleWebhook,
  getMySubscription,
  cancelSubscription
} from "../services/subscriptionService";

const checkout = async (req: Request, res: Response) => {
  const { plan } = req.body;

  const result = await createCheckoutSession(
    req.user!.id,
    req.user!.email,
    plan
  );

  res.status(200).send(result);
};

const getSubscription = async (req: Request, res: Response) => {
  const subscription = await getMySubscription(req.user!.id);
  res.status(200).json(subscription);
};

const cancel = async (req: Request, res: Response) => {
  const result = await cancelSubscription(req.user!.id);

  res.status(200).send(result);
};

const webhook = async (req: Request, res: Response) => {
  const signature = req.headers["stripe-signature"];

  if (!signature || typeof signature !== "string") {
    return res.status(400).send("Missing Stripe signature");
  }

  await handleWebhook(req.body, signature);

  res.status(200).send("Webhook received");
};

export {
  checkout,
  getSubscription,
  cancel,
  webhook
};