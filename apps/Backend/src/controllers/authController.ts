import { Request, Response } from "express";

import { registerUser, generateToken } from "../services/authService";

const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const user = await registerUser(name, email, password);

  res.status(201).send(user);
};

const login = async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.status(401).send("Invalid email or password");
  }

  const token = generateToken(user);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000
  });

  res.status(200).send({
    message: "Login successful",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
};

const me = async (req: Request, res: Response) => {
  res.status(200).send(req.user);
};

const logout = (req: Request, res: Response) => {
  res.clearCookie("token");
  res.status(200).send("Logout successful");
};

export { register, login, me, logout };