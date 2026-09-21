import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";

const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;

    console.log("AUTH DEBUG:", {
      hasToken: !!token,
      cookies: Object.keys(req.cookies || {})
    });

    if (!token) {
      console.log("AUTH DEBUG: token missing");
      return res.status(401).send("Authentication required");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      role: "USER" | "ADMIN";
    };

    console.log("AUTH DEBUG: JWT verified:", decoded.id);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });

    if (!user) {
      console.log("AUTH DEBUG: user not found:", decoded.id);
      return res.status(401).send("User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("AUTH DEBUG ERROR:", error);
    next(error);
  }
};

export default authenticate;