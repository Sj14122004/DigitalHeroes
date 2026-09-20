import express from "express";
import authenticate from "../middleware/authMiddleware";
import authorize from "../middleware/roleMiddleware";
import wrapAsync from "../utils/wrapAsync";
import {
  getUsers,
  updateRole,
  removeUser
} from "../controllers/adminUserController";

const router = express.Router();

router.use(authenticate, authorize("ADMIN"));

router.get("/", wrapAsync(getUsers));
router.patch("/:id/role", wrapAsync(updateRole));
router.delete("/:id", wrapAsync(removeUser));

export default router;