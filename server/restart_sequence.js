import prisma from './src/utils/prisma.js';

async function main() {
  try {
    await prisma.$executeRawUnsafe('ALTER SEQUENCE "Order_id_seq" RESTART WITH 100;');
    console.log('Sequence "Order_id_seq" restarted to 100');
  } catch (error) {
    console.error('Error restarting sequence:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
