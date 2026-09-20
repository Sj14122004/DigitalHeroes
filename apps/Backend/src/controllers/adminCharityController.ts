import { Request, Response } from "express";
import {
  createCharity,
  getAllCharities,
  updateCharity,
  deleteCharity,
  toggleCharityStatus,
  toggleFeatured
} from "../services/adminCharityService";

const create = async (req: Request, res: Response) => {
  const charity = await createCharity(req.body);

  res.status(201).send(charity);
};

const getAll = async (_req: Request, res: Response) => {
  const charities = await getAllCharities();

  res.status(200).send(charities);
};

const update = async (req: Request, res: Response) => {
  const charityId = String(req.params.id);

  const charity = await updateCharity(
    charityId,
    req.body
  );

  res.status(200).send(charity);
};

const remove = async (req: Request, res: Response) => {
  const charityId = String(req.params.id);

  await deleteCharity(charityId);

  res.status(200).send("Charity deleted successfully");
};

const toggleStatus = async (req: Request, res: Response) => {
  const charityId = String(req.params.id);

  const charity = await toggleCharityStatus(charityId);

  res.status(200).send(charity);
};

const toggleFeaturedCharity = async (
  req: Request,
  res: Response
) => {
  const charityId = String(req.params.id);

  const charity = await toggleFeatured(charityId);

  res.status(200).send(charity);
};

export {
  create,
  getAll,
  update,
  remove,
  toggleStatus,
  toggleFeaturedCharity
};