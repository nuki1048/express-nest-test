"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
exports.default = {
    schema: 'prisma/schema.prisma',
    migrations: {
        path: 'prisma/migrations',
        seed: 'ts-node prisma/seed.ts',
    },
    datasource: {
        url: process.env.DATABASE_URL ?? '',
    },
};
//# sourceMappingURL=prisma.config.js.map