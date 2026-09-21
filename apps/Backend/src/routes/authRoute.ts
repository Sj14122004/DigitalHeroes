import express from "express";
import passport from "../config/passport";
import { register, login, me } from "../controllers/authController";
import wrapAsync from "../utils/wrapAsync";
import validate from "../middleware/validateMiddleware";
import { registerSchema, loginSchema } from "../validations/authValidation";
import authenticate from "../middleware/authMiddleware";

const router = express.Router();

router.post(
  "/register",
  validate(registerSchema),
  wrapAsync(register)
);

router.post(
  "/login",
  validate(loginSchema),
  passport.authenticate("local", { session: false }),
  wrapAsync(login)
);

router.get(
  "/me",
  authenticate,
  wrapAsync(me)
);

router.post("/logout", logout);

export default router;