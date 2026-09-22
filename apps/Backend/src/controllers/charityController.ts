import { Request, Response } from "express";

import {
  getCharities,
  getCharityById,
  getSelectedCharity,
  selectCharity
} from "../services/charityService";

const getAll = async (req: Request, res: Response) => {
  const search =
    typeof req.query.search === "string"
      ? req.query.search.trim()
      : undefined;

  const charities = await getCharities(search);
  res.status(200).json(charities);
};

const getOne = async (req: Request, res: Response) => {
  const charityId = String(req.params.id);
  const charity = await getCharityById(charityId);
  res.status(200).json(charity);
};

const getSelected = async (req: Request, res: Response) => {
  const selection = await getSelectedCharity(req.user!.id);
  res.status(200).json(selection);
};

const select = async (req: Request, res: Response) => {
  const { charityId, contributionPercent } = req.body;

  const selection = await selectCharity(
    req.user!.id,
    charityId,
    contributionPercent
  );

  res.status(200).json(selection);
};

export {
  getAll,
  getOne,
  getSelected,
  select
};