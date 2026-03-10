"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
}
const adapter = new adapter_pg_1.PrismaPg({ connectionString });
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    await prisma.contact.upsert({
        where: { id: 'default' },
        create: {
            id: 'default',
            phoneNumbers: ['+380501234567', '+380671234567'],
            email: 'contact@example.com',
            address: {
                label: 'Kyiv, vul. Khreshchatyk 1',
                url: 'https://maps.example.com/kyiv-khreshchatyk-1',
            },
            links: {
                facebook: 'https://facebook.com/example',
                instagram: 'https://instagram.com/example',
                airbnb: 'https://airbnb.com/example',
                booking: 'https://booking.com/example',
                whatsapp: 'https://wa.me/example',
            },
        },
        update: {},
    });
    console.log('Seed completed: single contact created or updated.');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map