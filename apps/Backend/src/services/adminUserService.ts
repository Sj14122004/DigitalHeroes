import prisma from "../lib/prisma";

const getAllUsers = async () => {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          subscriptions: true,
          scores: true,
          winners: true
        }
      }
    }
  });
};

const updateUserRole = async (userId: string, role: "USER" | "ADMIN") => {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    throw Object.assign(new Error("User not found"), { statusCode: 404 });
  }

  return prisma.user.update({
    where: { id: userId },
    data: { role },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true
    }
  });
};

const deleteUser = async (userId: string, adminId: string) => {
  if (userId === adminId) {
    throw Object.assign(new Error("You cannot delete your own account"), {
      statusCode: 400
    });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    throw Object.assign(new Error("User not found"), { statusCode: 404 });
  }

  await prisma.user.delete({
    where: { id: userId }
  });

  return { message: "User deleted successfully" };
};

export { getAllUsers, updateUserRole, deleteUser };