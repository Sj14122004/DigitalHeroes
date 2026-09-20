import express from "express";
import authenticate from "../middleware/authMiddleware";
import wrapAsync from "../utils/wrapAsync";
import validate from "../middleware/validateMiddleware";
import {
  scoreSchema,
  updateScoreSchema
} from "../validations/scoreValidation";
import {
  create,
  getAll,
  getOne,
  update,
  remove
} from "../controllers/scoreController";

const router = express.Router();

router.use(authenticate);

router.post(
  "/",
  validate(scoreSchema),
  wrapAsync(create)
);

router.get(
  "/",
  wrapAsync(getAll)
);

router.get(
  "/:id",
  wrapAsync(getOne)
);

router.put(
  "/:id",
  validate(updateScoreSchema),
  wrapAsync(update)
);

router.delete(
  "/:id",
  wrapAsync(remove)
);

export default router;