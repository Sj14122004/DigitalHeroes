import express from "express";
import authenticate from "../middleware/authMiddleware";
import wrapAsync from "../utils/wrapAsync";
import validate from "../middleware/validateMiddleware";
import { charitySelectionSchema } from "../validations/charityValidation";
import {
  getAll,
  getOne,
  getSelected,
  select
} from "../controllers/charityController";

const router = express.Router();

router.get("/", wrapAsync(getAll));

router.get(
  "/user/selected",
  authenticate,
  wrapAsync(getSelected)
);

router.put(
  "/user/select",
  authenticate,
  validate(charitySelectionSchema),
  wrapAsync(select)
);

router.get("/:id", wrapAsync(getOne));

export default router;