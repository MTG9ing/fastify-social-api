import "dotenv/config";  // Loads .env for CLI
import { defineConfig, env } from "prisma/config";
import type { PrismaConfig } from "prisma";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),  // Reads from .env
  },
}) satisfies PrismaConfig;