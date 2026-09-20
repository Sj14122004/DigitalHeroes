import { Request, Response } from "express";
import {
  createScore,
  getScores,
  getScoreById,
  updateScore,
  deleteScore
} from "../services/scoreService";

const create = async (req: Request, res: Response) => {
  const { score, playedAt } = req.body;

  const result = await createScore(
    req.user!.id,
    score,
    playedAt
  );

  res.status(201).send(result);
};

const getAll = async (req: Request, res: Response) => {
  const scores = await getScores(req.user!.id);

  res.status(200).send(scores);
};

const getOne = async (req: Request, res: Response) => {
  const scoreId = String(req.params.id);

  const score = await getScoreById(
    req.user!.id,
    scoreId
  );

  res.status(200).send(score);
};

const update = async (req: Request, res: Response) => {
  const { score, playedAt } = req.body;
  const scoreId = String(req.params.id);

  const result = await updateScore(
    req.user!.id,
    scoreId,
    score,
    playedAt
  );

  res.status(200).send(result);
};

const remove = async (req: Request, res: Response) => {
  const scoreId = String(req.params.id);

  await deleteScore(
    req.user!.id,
    scoreId
  );

  res.status(200).send("Score deleted successfully");
};

export {
  create,
  getAll,
  getOne,
  update,
  remove
};