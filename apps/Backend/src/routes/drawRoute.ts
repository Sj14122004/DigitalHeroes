import express from "express";
import authenticate from "../middleware/authMiddleware";
import authorize from "../middleware/roleMiddleware";
import validate from "../middleware/validateMiddleware";
import wrapAsync from "../utils/wrapAsync";
import { drawEntrySchema } from "../validations/drawValidation";
import {
  current,
  myEntry,
  enter,
  simulate,
  publish
} from "../controllers/drawController";

const router = express.Router();

router.get("/current", wrapAsync(current));

router.use(authenticate);

router.get("/my-entry", wrapAsync(myEntry));
router.post("/entry", validate(drawEntrySchema), wrapAsync(enter));

router.post("/simulate", authorize("ADMIN"), wrapAsync(simulate));
router.post("/publish", authorize("ADMIN"), wrapAsync(publish));

export default router;