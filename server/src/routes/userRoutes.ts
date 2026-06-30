import { Router } from "express";
import {
  getUserController,
  listUsersController,
  updateUserController,
} from "../controllers/userController";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";
import type { UserRole } from "../types/domain";

const router = Router();

router.use(requireAuth);

type UserParams = {
  id: string;
};

type UpdateUserBody = Partial<{
  firstName: string;
  lastName: string;
  role: UserRole;
}>;

router.get("/", asyncHandler(listUsersController));
router.get("/:id", asyncHandler<UserParams>(getUserController));
router.patch(
  "/:id",
  asyncHandler<UserParams, unknown, UpdateUserBody>(updateUserController),
);

export default router;
