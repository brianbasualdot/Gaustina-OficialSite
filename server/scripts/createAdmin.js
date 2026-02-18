import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const email = process.argv[2];

if (!email) {
    console.error("Error: Please provide an email address.");
    console.error("Usage: node scripts/createAdmin.js <email>");
    process.exit(1);
}

async function main() {
    console.log(`Promoting ${email} to ADMIN...`);

    const user = await prisma.user.upsert({
        where: { email: email },
        update: { role: 'ADMIN' },
        create: {
            email: email,
            role: 'ADMIN',
            name: 'Admin User'
        }
    });

    console.log(`✅ Success! User ${user.email} is now an ADMIN.`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
