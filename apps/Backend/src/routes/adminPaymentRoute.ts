import express from "express";
import authenticate from "../middleware/authMiddleware";
import authorize from "../middleware/roleMiddleware";
import wrapAsync from "../utils/wrapAsync";
import {
  getPayments,
  markPaid
} from "../controllers/adminPaymentController";

const router = express.Router();

router.use(authenticate, authorize("ADMIN"));

router.get("/", wrapAsync(getPayments));
router.post("/:id/paid", wrapAsync(markPaid));

export default router;