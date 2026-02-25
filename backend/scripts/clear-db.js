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
    const contactResult = await prisma.contact.deleteMany({});
    console.log(`Deleted ${contactResult.count} contact(s).`);
    console.log('Database content cleared.');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=clear-db.js.map