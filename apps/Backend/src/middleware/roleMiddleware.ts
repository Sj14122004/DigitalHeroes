import { Request, Response, NextFunction } from "express";
import { Role } from "../generated/prisma/client";

const authorize = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).send("Authentication required");
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).send("Access denied");
    }

    next();
  };
};

export default authorize;