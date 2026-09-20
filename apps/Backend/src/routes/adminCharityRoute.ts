import express from "express";
import authenticate from "../middleware/authMiddleware";
import authorize from "../middleware/roleMiddleware";
import validate from "../middleware/validateMiddleware";
import wrapAsync from "../utils/wrapAsync";
import {
  createCharitySchema,
  updateCharitySchema
} from "../validations/adminCharityValidation";
import {
  create,
  getAll,
  update,
  remove,
  toggleStatus,
  toggleFeaturedCharity
} from "../controllers/adminCharityController";

const router = express.Router();

router.use(authenticate);
router.use(authorize("ADMIN"));

router.post(
  "/",
  validate(createCharitySchema),
  wrapAsync(create)
);

router.get(
  "/",
  wrapAsync(getAll)
);

router.put(
  "/:id",
  validate(updateCharitySchema),
  wrapAsync(update)
);

router.patch(
  "/:id/status",
  wrapAsync(toggleStatus)
);

router.patch(
  "/:id/featured",
  wrapAsync(toggleFeaturedCharity)
);

router.delete(
  "/:id",
  wrapAsync(remove)
);

export default router;