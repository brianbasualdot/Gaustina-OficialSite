
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkProducts() {
    try {
        const count = await prisma.product.count();
        console.log(`Total Products in DB: ${count}`);

        const products = await prisma.product.findMany({ take: 5 });
        console.log('Sample Products:', products);
    } catch (e) {
        console.error('Error connecting to DB:', e);
    } finally {
        await prisma.$disconnect();
    }
}

checkProducts();
