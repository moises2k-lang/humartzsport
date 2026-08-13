import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { Pool } from "pg";
import { parse } from "pg-connection-string";

const connectionString = process.env.DATABASE_URL ?? "";
const cleanConnectionString = (() => {
  if (!connectionString) return "";
  try {
    const url = new URL(connectionString);
    url.searchParams.delete("sslmode");
    url.searchParams.delete("ssl");
    url.searchParams.delete("uselibpqcompat");
    return url.toString();
  } catch {
    return connectionString;
  }
})();
const parsed = parse(cleanConnectionString);
const pool = new Pool({
  host: parsed.host ?? undefined,
  port: parsed.port ? Number(parsed.port) : undefined,
  user: parsed.user,
  password: parsed.password,
  database: parsed.database ?? undefined,
  ssl: { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
