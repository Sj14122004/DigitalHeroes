import { Request, Response } from "express";
import {
  getAllPayments,
  markPaymentPaid
} from "../services/adminPaymentService";

const getPayments = async (req: Request, res: Response) => {
  const payments = await getAllPayments();
  res.status(200).json(payments);
};

const markPaid = async (req: Request, res: Response) => {
  const payment = await markPaymentPaid(String(req.params.id));

  res.status(200).json({
    message: "Payment marked as paid",
    payment
  });
};

export { getPayments, markPaid };