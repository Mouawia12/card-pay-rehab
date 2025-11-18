import { PrismaClient, CardStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@rehab.sa" },
    update: {},
    create: {
      email: "admin@rehab.sa",
      fullName: "Admin User",
      passwordHash,
      role: "admin",
    },
  });

  const customers = await prisma.$transaction(
    [
      {
        fullName: "Rehab Holding",
        email: "contact@rehab.sa",
        phone: "+966500000001",
      },
      {
        fullName: "Gulf Payments",
        email: "ops@gulfpay.sa",
        phone: "+966500000002",
      },
      {
        fullName: "Secure Cart",
        email: "info@securecart.sa",
        phone: "+966500000003",
      },
    ].map((customer) => prisma.customer.upsert({
      where: { email: customer.email },
      update: customer,
      create: customer,
    }))
  );

  const cardsData = [
    {
      cardNumber: "4111111111111111",
      holderName: "Rehab Holding",
      provider: "Visa",
      status: CardStatus.ACTIVE,
      balance: 120_000,
      creditLimit: 200_000,
      currency: "SAR",
      last4: "1111",
      expiresOn: new Date(new Date().getFullYear() + 2, 10, 1),
      customerId: customers[0].id,
    },
    {
      cardNumber: "5500005555555559",
      holderName: "Gulf Payments",
      provider: "Mastercard",
      status: CardStatus.SUSPENDED,
      balance: 15_500,
      creditLimit: 100_000,
      currency: "SAR",
      last4: "5559",
      expiresOn: new Date(new Date().getFullYear() + 1, 5, 1),
      customerId: customers[1].id,
    },
    {
      cardNumber: "6011000990139424",
      holderName: "Secure Cart",
      provider: "Discover",
      status: CardStatus.ACTIVE,
      balance: 2_340,
      creditLimit: 25_000,
      currency: "SAR",
      last4: "9424",
      expiresOn: new Date(new Date().getFullYear() + 3, 0, 1),
      customerId: customers[2].id,
    },
  ];

  await Promise.all(
    cardsData.map((card) =>
      prisma.card.upsert({
        where: { cardNumber: card.cardNumber },
        update: card,
        create: card,
      })
    )
  );

  console.log(`Seeded admin user ${admin.email} and ${cardsData.length} cards.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
