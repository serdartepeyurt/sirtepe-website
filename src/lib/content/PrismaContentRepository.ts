import { PrismaClient } from '@/generated/prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { BlogPost, IContentRepository } from '@/interfaces/IContentRepository';

const adapter = new PrismaBetterSqlite3({ url: 'dev.db' });

export class PrismaContentRepository implements IContentRepository {
  private client: PrismaClient;

  constructor() {
    this.client = new PrismaClient({ adapter });
  }

  async getAllPosts(): Promise<BlogPost[]> {
    const posts = await this.client.post.findMany({ orderBy: { createdAt: 'desc' } });
    return posts;
  }

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    const post = await this.client.post.findUnique({ where: { slug } });
    return post;
  }

  async createPost(post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<BlogPost> {
    const created = await this.client.post.create({ data: post });
    return created;
  }

  async updatePost(id: string, post: Partial<BlogPost>): Promise<BlogPost> {
    const updated = await this.client.post.update({ where: { id }, data: post });
    return updated;
  }

  async deletePost(id: string): Promise<void> {
    await this.client.post.delete({ where: { id } });
  }
}
