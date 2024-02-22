import { MetricsType as MetricsTypePrisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const seedPromises = [];

  for (const metric of Object.values(MetricsTypePrisma)) {
    if (metric === MetricsTypePrisma.last_sent_rate) {
      seedPromises.push(
        prisma.metrics.create({
          data: {
            value: 2_000_000,
            type: metric as MetricsTypePrisma,
          },
        }),
      );
      continue;
    }

    seedPromises.push(
      prisma.metrics.create({
        data: {
          type: metric as MetricsTypePrisma,
        },
      }),
    );
  }

  await Promise.all(seedPromises);
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
