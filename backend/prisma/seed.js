/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const complaintTypes = [
    {
      code: 'C_01',
      name: 'Employee Delay',
      severity: 'CRITICAL',
      maxResponseTime: 15,
      maxResolutionTime: 60,
    },
    {
      code: 'C_02',
      name: 'Misbehavior / Bad Conduct',
      severity: 'HIGH',
      maxResponseTime: 30,
      maxResolutionTime: 180,
    },
    {
      code: 'C_03',
      name: 'Technical Bugs',
      severity: 'HIGH',
      maxResponseTime: 30,
      maxResolutionTime: 180,
    },
    {
      code: 'C_04',
      name: 'Incorrect Property Info',
      severity: 'MEDIUM',
      maxResponseTime: 60,
      maxResolutionTime: 720,
    },
    {
      code: 'C_05',
      name: 'Poor Property Recommendations',
      severity: 'MEDIUM',
      maxResponseTime: 60,
      maxResolutionTime: 720,
    },
    {
      code: 'C_06',
      name: 'Notification & Alert Issues',
      severity: 'MEDIUM',
      maxResponseTime: 60,
      maxResolutionTime: 720,
    },
    {
      code: 'C_07',
      name: 'Suggestions & Inquiries',
      severity: 'LOW',
      maxResponseTime: 120,
      maxResolutionTime: 1440,
    },
    {
      code: 'C_08',
      name: 'Other',
      severity: 'LOW',
      maxResponseTime: 120,
      maxResolutionTime: 1440,
    },
  ];

  console.log('Starting seeding');

  for (const type of complaintTypes) {
    await prisma.complaintType.upsert({
      where: { code: type.code },
      update: {
        name: type.name,
        severity: type.severity,
        maxResponseTime: type.maxResponseTime,
        maxResolutionTime: type.maxResolutionTime,
      },
      create: type,
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
