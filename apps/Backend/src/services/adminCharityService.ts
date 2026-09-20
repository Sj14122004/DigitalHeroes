import prisma from "../lib/prisma";

const createCharity = async (data: {
  name: string;
  description: string;
  logoUrl?: string;
  websiteUrl?: string;
  isActive?: boolean;
  isFeatured?: boolean;
}) => {
  if (data.isFeatured) {
    await prisma.charity.updateMany({
      where: { isFeatured: true },
      data: { isFeatured: false }
    });
  }

  return prisma.charity.create({
    data
  });
};

const getAllCharities = async () => {
  return prisma.charity.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });
};

const updateCharity = async (
  charityId: string,
  data: {
    name?: string;
    description?: string;
    logoUrl?: string;
    websiteUrl?: string;
    isActive?: boolean;
    isFeatured?: boolean;
  }
) => {
  const charity = await prisma.charity.findUnique({
    where: { id: charityId }
  });

  if (!charity) {
    throw Object.assign(new Error("Charity not found"), {
      statusCode: 404
    });
  }

  if (data.isFeatured) {
    await prisma.charity.updateMany({
      where: {
        isFeatured: true,
        id: { not: charityId }
      },
      data: {
        isFeatured: false
      }
    });
  }

  return prisma.charity.update({
    where: {
      id: charityId
    },
    data
  });
};

const deleteCharity = async (charityId: string) => {
  const charity = await prisma.charity.findUnique({
    where: { id: charityId }
  });

  if (!charity) {
    throw Object.assign(new Error("Charity not found"), {
      statusCode: 404
    });
  }

  const selectionCount = await prisma.charitySelection.count({
    where: {
      charityId
    }
  });

  if (selectionCount > 0) {
    throw Object.assign(
      new Error("Cannot delete a charity that has subscriber selections"),
      { statusCode: 409 }
    );
  }

  await prisma.charity.delete({
    where: {
      id: charityId
    }
  });
};

const toggleCharityStatus = async (charityId: string) => {
  const charity = await prisma.charity.findUnique({
    where: { id: charityId }
  });

  if (!charity) {
    throw Object.assign(new Error("Charity not found"), {
      statusCode: 404
    });
  }

  return prisma.charity.update({
    where: {
      id: charityId
    },
    data: {
      isActive: !charity.isActive
    }
  });
};

const toggleFeatured = async (charityId: string) => {
  const charity = await prisma.charity.findUnique({
    where: { id: charityId }
  });

  if (!charity) {
    throw Object.assign(new Error("Charity not found"), {
      statusCode: 404
    });
  }

  if (!charity.isFeatured) {
    await prisma.charity.updateMany({
      where: {
        isFeatured: true,
        id: { not: charityId }
      },
      data: {
        isFeatured: false
      }
    });
  }

  return prisma.charity.update({
    where: {
      id: charityId
    },
    data: {
      isFeatured: !charity.isFeatured
    }
  });
};

export {
  createCharity,
  getAllCharities,
  updateCharity,
  deleteCharity,
  toggleCharityStatus,
  toggleFeatured
};