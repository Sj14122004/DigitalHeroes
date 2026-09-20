import { Request, Response } from "express";
import {
  getAllUsers,
  updateUserRole,
  deleteUser
} from "../services/adminUserService";

const getUsers = async (req: Request, res: Response) => {
  const users = await getAllUsers();
  res.status(200).json(users);
};

const updateRole = async (req: Request, res: Response) => {
  const role = req.body.role;

  if (role !== "USER" && role !== "ADMIN") {
    return res.status(400).json({
      message: "Invalid role"
    });
  }

  const user = await updateUserRole(String(req.params.id), role);

  res.status(200).json({
    message: "User role updated successfully",
    user
  });
};

const removeUser = async (req: Request, res: Response) => {
  const result = await deleteUser(
    String(req.params.id),
    req.user!.id
  );

  res.status(200).json(result);
};

export { getUsers, updateRole, removeUser };