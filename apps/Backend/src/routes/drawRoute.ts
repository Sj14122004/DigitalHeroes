import express from "express";
import authenticate from "../middleware/authMiddleware";
import authorize from "../middleware/roleMiddleware";
import wrapAsync from "../utils/wrapAsync";
import validate from "../middleware/validateMiddleware";
import { drawEntrySchema } from "../validations/drawValidation";
import {
  current,
  myEntry,
  enter,
  simulate,
  publish
} from "../controllers/drawController";

const router = express.Router();

router.get("/current", authenticate, wrapAsync(current));
router.get("/my-entry", authenticate, wrapAsync(myEntry));
router.post("/entry", authenticate, validate(drawEntrySchema), wrapAsync(enter));

router.post("/simulate", authenticate, authorize("ADMIN"), wrapAsync(simulate));
router.post("/publish", authenticate, authorize("ADMIN"), wrapAsync(publish));

export default router;