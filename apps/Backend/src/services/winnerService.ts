import prisma from "../lib/prisma";
import cloudinary from "../config/cloudinary";
import { UploadApiResponse } from "cloudinary";

const getMyWinnings = async (userId: string) => {
  return prisma.winner.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      draw: {
        select: {
          month: true,
          year: true,
          winningNumbers: true,
          status: true
        }
      },
      payment: {
        select: {
          amount: true,
          status: true,
          paidAt: true
        }
      }
    }
  });
};

const uploadWinnerProof = async (
  userId: string,
  winnerId: string,
  file: Express.Multer.File
) => {
  const winner = await prisma.winner.findFirst({
    where: {
      id: winnerId,
      userId
    }
  });

  if (!winner) {
    throw Object.assign(new Error("Winning record not found"), {
      statusCode: 404
    });
  }

  if (winner.status !== "PENDING" && winner.status !== "REJECTED") {
    throw Object.assign(
      new Error("Proof cannot be uploaded for this winner"),
      { statusCode: 400 }
    );
  }

  const uploadResult = await new Promise<UploadApiResponse>(
    (resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "digital-heroes/winner-proofs",
          resource_type: "image"
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error("Image upload failed"));
          resolve(result);
        }
      );

      stream.end(file.buffer);
    }
  );

  return prisma.winner.update({
    where: { id: winner.id },
    data: {
      proofUrl: uploadResult.secure_url,
      status: "PENDING",
      rejectionReason: null
    },
    include: {
      draw: {
        select: {
          month: true,
          year: true,
          winningNumbers: true
        }
      }
    }
  });
};

export { getMyWinnings, uploadWinnerProof };