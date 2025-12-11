import { PrismaClient} from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString, max: 20 });
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });


// Graceful shutdown
process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  await pool.end();
});