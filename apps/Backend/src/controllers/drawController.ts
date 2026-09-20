import { Request, Response } from "express";
import {
  getCurrentDraw,
  getMyEntry,
  enterDraw,
  simulateDraw,
  publishDraw
} from "../services/drawService";

const current = async (req: Request, res: Response) => {
  const draw = await getCurrentDraw();
  res.status(200).json(draw);
};

const myEntry = async (req: Request, res: Response) => {
  const entry = await getMyEntry(req.user!.id);
  res.status(200).json(entry);
};

const enter = async (req: Request, res: Response) => {
  const entry = await enterDraw(req.user!.id, req.body.numbers);
  res.status(200).json(entry);
};

const simulate = async (req: Request, res: Response) => {
  const draw = await simulateDraw();
  res.status(200).json(draw);
};

const publish = async (req: Request, res: Response) => {
  const draw = await publishDraw();
  res.status(200).json(draw);
};

export { current, myEntry, enter, simulate, publish };