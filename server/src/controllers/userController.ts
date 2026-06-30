import type { Request, Response } from "express";
import { getUserById, listUsers, updateUser } from "../services/userService";
import type { UserRole } from "../types/domain";
import { sendSuccess } from "../utils/apiResponse";

type UserParams = {
  id: string;
};

type UpdateUserBody = Partial<{
  firstName: string;
  lastName: string;
  role: UserRole;
}>;

export const listUsersController = async (req: Request, res: Response) => {
  const users = await listUsers(req.auth!.organizationId);
  return sendSuccess(res, users);
};

export const getUserController = async (
  req: Request<UserParams>,
  res: Response,
) => {
  const user = await getUserById(req.auth!.organizationId, req.params.id);
  return sendSuccess(res, user);
};

export const updateUserController = async (
  req: Request<UserParams, unknown, UpdateUserBody>,
  res: Response,
) => {
  const user = await updateUser(req.auth!, req.params.id, req.body);
  return sendSuccess(res, user);
};
