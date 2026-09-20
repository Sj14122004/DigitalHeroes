import { Request, Response } from "express";
import {
  getMyWinnings,
  uploadWinnerProof
} from "../services/winnerService";

const getMine = async (req: Request, res: Response) => {
  const winnings = await getMyWinnings(req.user!.id);
  res.status(200).json(winnings);
};

const uploadProof = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({
      message: "Proof screenshot is required"
    });
  }

  const winnerId = String(req.params.id);

  const winner = await uploadWinnerProof(
    req.user!.id,
    winnerId,
    req.file
  );

  res.status(200).json({
    message: "Proof uploaded successfully",
    winner
  });
};

export { getMine, uploadProof };