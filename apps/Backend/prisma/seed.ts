import bcrypt from "bcryptjs";
import prisma from "../src/lib/prisma";

const clearDatabase = async () => {
  await prisma.winner.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.drawPrize.deleteMany();
  await prisma.drawEntry.deleteMany();
  await prisma.draw.deleteMany();
  await prisma.charitySelection.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.golfScore.deleteMany();
  await prisma.user.deleteMany();
  await prisma.charity.deleteMany();

  console.log("Previous database data cleared");
};

const main = async () => {
  await clearDatabase();

  const password = await bcrypt.hash("12345678", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Digital Heroes Admin",
      email: "admin@digitalheroes.com",
      password,
      role: "ADMIN"
    }
  });

  const user = await prisma.user.create({
    data: {
      name: "Shivam",
      email: "shivam@gmail.com",
      password,
      role: "USER"
    }
  });

  const charities = [
    {
      name: "GiveIndia",
      description: "A platform supporting trusted causes across India.",
      logoUrl: "https://www.giveindia.org/favicon.ico",
      websiteUrl: "https://www.giveindia.org",
      isActive: true,
      isFeatured: true
    },
    {
      name: "Akshaya Patra Foundation",
      description: "Providing nutritious meals to children across India.",
      logoUrl: "https://www.akshayapatra.org/favicon.ico",
      websiteUrl: "https://www.akshayapatra.org",
      isActive: true,
      isFeatured: false
    },
    {
      name: "CRY",
      description: "Working to ensure children's rights and opportunities.",
      logoUrl: "https://www.cry.org/favicon.ico",
      websiteUrl: "https://www.cry.org",
      isActive: true,
      isFeatured: false
    },
    {
      name: "Smile Foundation",
      description: "Supporting education, healthcare and livelihood programs.",
      logoUrl: "https://www.smilefoundationindia.org/favicon.ico",
      websiteUrl: "https://www.smilefoundationindia.org",
      isActive: true,
      isFeatured: false
    },
    {
      name: "Goonj",
      description: "Creating sustainable solutions for communities across India.",
      logoUrl: "https://goonj.org/favicon.ico",
      websiteUrl: "https://goonj.org",
      isActive: true,
      isFeatured: false
    }
  ];

  const createdCharities = [];

  for (const charity of charities) {
    const createdCharity = await prisma.charity.create({
      data: charity
    });

    createdCharities.push(createdCharity);
  }

  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 1);

  const subscription = await prisma.subscription.create({
    data: {
      userId: user.id,
      plan: "MONTHLY",
      status: "ACTIVE",
      amount: 499,
      charityPercentage: 10,
      charityAmount: 49.9,
      prizePoolAmount: 399.2,
      startDate,
      endDate
    }
  });

  await prisma.charitySelection.create({
    data: {
      userId: user.id,
      charityId: createdCharities[0].id,
      subscriptionId: subscription.id,
      contributionPercent: 10,
      contributionAmount: 49.9
    }
  });

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  await prisma.draw.create({
    data: {
      month,
      year,
      status: "DRAFT",
      winningNumbers: [],
      prizePool: 0,
      jackpot: 0
    }
  });

  console.log("");
  console.log("======================================");
  console.log("Digital Heroes seed completed");
  console.log("======================================");
  console.log(`Admin:      ${admin.email} / 12345678`);
  console.log(`Subscriber: ${user.email} / 12345678`);
  console.log("Subscription: ACTIVE - MONTHLY - ₹499");
  console.log("Charity: 10% - ₹49.90");
  console.log("Prize Pool: ₹399.20");
  console.log("Golf Scores: None");
  console.log("Draw Entry: None");
  console.log("Draw Status: DRAFT");
  console.log("======================================");
};

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });