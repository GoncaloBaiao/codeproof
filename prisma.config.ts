import path from "node:path";
import { defineConfig } from "prisma/config";
import * as dotenv from "dotenv";

// Carregar .env.local primeiro, depois .env como fallback
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL is not set in .env.local or .env");
}

export default defineConfig({
  schema: path.join(__dirname, "prisma", "schema.prisma"),
  datasource: {
    url,
  },
});
