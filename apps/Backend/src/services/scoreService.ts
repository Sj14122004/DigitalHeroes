import prisma from "../lib/prisma";

const createScore = async (
  userId: string,
  score: number,
  playedAt: string
) => {
  const date = new Date(playedAt);

  const existingScore = await prisma.golfScore.findUnique({
    where: {
      userId_playedAt: {
        userId,
        playedAt: date
      }
    }
  });

  if (existingScore) {
    throw Object.assign(
      new Error("A score already exists for this date"),
      { statusCode: 409 }
    );
  }

  const scores = await prisma.golfScore.findMany({
    where: {
      userId
    },
    orderBy: {
      playedAt: "desc"
    }
  });

  if (scores.length >= 5) {
    await prisma.golfScore.delete({
      where: {
        id: scores[scores.length - 1].id
      }
    });
  }

  return prisma.golfScore.create({
    data: {
      userId,
      score,
      playedAt: date
    }
  });
};

const getScores = async (userId: string) => {
  return prisma.golfScore.findMany({
    where: {
      userId
    },
    orderBy: {
      playedAt: "desc"
    }
  });
};

const getScoreById = async (userId: string, scoreId: string) => {
  const score = await prisma.golfScore.findFirst({
    where: {
      id: scoreId,
      userId
    }
  });

  if (!score) {
    throw Object.assign(
      new Error("Score not found"),
      { statusCode: 404 }
    );
  }

  return score;
};

const updateScore = async (
  userId: string,
  scoreId: string,
  score: number,
  playedAt: string
) => {
  const existingScore = await getScoreById(userId, scoreId);
  const date = new Date(playedAt);

  const duplicateScore = await prisma.golfScore.findFirst({
    where: {
      userId,
      playedAt: date,
      id: {
        not: scoreId
      }
    }
  });

  if (duplicateScore) {
    throw Object.assign(
      new Error("A score already exists for this date"),
      { statusCode: 409 }
    );
  }

  return prisma.golfScore.update({
    where: {
      id: existingScore.id
    },
    data: {
      score,
      playedAt: date
    }
  });
};

const deleteScore = async (userId: string, scoreId: string) => {
  await getScoreById(userId, scoreId);

  return prisma.golfScore.delete({
    where: {
      id: scoreId
    }
  });
};

export {
  createScore,
  getScores,
  getScoreById,
  updateScore,
  deleteScore
};