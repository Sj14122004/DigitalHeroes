import express from "express";
import authenticate from "../middleware/authMiddleware";
import authorize from "../middleware/roleMiddleware";
import wrapAsync from "../utils/wrapAsync";
import {
  getWinners,
  approve,
  reject
} from "../controllers/adminWinnerController";

const router = express.Router();

router.use(authenticate, authorize("ADMIN"));

router.get("/", wrapAsync(getWinners));
router.post("/:id/approve", wrapAsync(approve));
router.post("/:id/reject", wrapAsync(reject));

export default router;