import express from "express";
import authenticate from "../middleware/authMiddleware";
import wrapAsync from "../utils/wrapAsync";
import validate from "../middleware/validateMiddleware";
import { subscriptionSchema } from "../validations/subscriptionValidation";
import {
  checkout,
  getSubscription,
  cancel
} from "../controllers/subscriptionController";

const router = express.Router();

router.post(
  "/checkout",
  authenticate,
  validate(subscriptionSchema),
  wrapAsync(checkout)
);

router.get(
  "/",
  authenticate,
  wrapAsync(getSubscription)
);

router.post(
  "/cancel",
  authenticate,
  wrapAsync(cancel)
);

export default router;