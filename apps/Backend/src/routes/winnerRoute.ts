import express from "express";
import authenticate from "../middleware/authMiddleware";
import wrapAsync from "../utils/wrapAsync";
import upload from "../middleware/uploadMiddleware";
import {
  getMine,
  uploadProof
} from "../controllers/winnerController";

const router = express.Router();

router.use(authenticate);

router.get("/mine", wrapAsync(getMine));

router.post(
  "/:id/proof",
  upload.single("proof"),
  wrapAsync(uploadProof)
);

export default router;