import { PrismaClient } from '@/generated/prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { IDatabase } from '@/interfaces/IDatabase';

const adapter = new PrismaBetterSqlite3({ url: './data/dev.db' });

export class PrismaDatabase implements IDatabase {
  private client: PrismaClient;

  constructor() {
    this.client = new PrismaClient({ adapter });
  }

  async query<T>(sql: string, params?: unknown[]): Promise<T[]> {
    const result = await this.client.$queryRawUnsafe<T[]>(sql, ...(params || []));
    return result;
  }

  async execute(sql: string, params?: unknown[]): Promise<number> {
    const result = await this.client.$executeRawUnsafe(sql, ...(params || []));
    return result;
  }

  async transaction<T>(fn: () => Promise<T>): Promise<T> {
    return this.client.$transaction(fn);
  }
}
