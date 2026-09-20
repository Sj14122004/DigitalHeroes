import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";

const registerUser = async (name: string, email: string, password: string) => {
  const normalizedEmail = email.toLowerCase();

  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail }
  });

  if (existingUser) {
    throw Object.assign(new Error("Email already registered"), { statusCode: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      name,
      email: normalizedEmail,
      password: hashedPassword
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true
    }
  });
};

const generateToken = (user: { id: string; role: string }) => {
  return jwt.sign(
    {
      id: user.id,
      role: user.role
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: "1d"
    }
  );
};

export { registerUser, generateToken };