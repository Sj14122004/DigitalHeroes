import { Request, Response } from "express";
import {
  getAllWinners,
  approveWinner,
  rejectWinner
} from "../services/adminWinnerService";

const getWinners = async (req: Request, res: Response) => {
  const winners = await getAllWinners();
  res.status(200).json(winners);
};

const approve = async (req: Request, res: Response) => {
  const winner = await approveWinner(String(req.params.id));
  res.status(200).json({
    message: "Winner approved successfully",
    winner
  });
};

const reject = async (req: Request, res: Response) => {
  const reason = String(req.body.reason || "").trim();

  if (!reason) {
    return res.status(400).json({
      message: "Rejection reason is required"
    });
  }

  const winner = await rejectWinner(String(req.params.id), reason);

  res.status(200).json({
    message: "Winner rejected successfully",
    winner
  });
};

export { getWinners, approve, reject };