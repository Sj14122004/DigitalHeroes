import type { Role } from "../generated/prisma/client";

declare global {
  namespace Express {
    interface User {
      id: string;
      name: string;
      email: string;
      role: Role;
    }
  }
}

export {};