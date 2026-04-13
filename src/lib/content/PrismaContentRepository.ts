import { PrismaClient } from '@/generated/prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { BlogPost, IContentRepository } from '@/interfaces/IContentRepository';

const adapter = new PrismaBetterSqlite3({ url: './data/dev.db' });

export class PrismaContentRepository implements IContentRepository {
  private client: PrismaClient;

  constructor() {
    this.client = new PrismaClient({ adapter });
  }

  private parsePost(post: unknown): BlogPost {
    const p = post as Record<string, unknown>;
    return {
      ...(p as Omit<BlogPost, 'tags'>),
      tags: (() => { try { return JSON.parse(p.tags as unknown as string ?? '[]'); } catch { return []; } })(),
    };
  }

  async getAllPosts(): Promise<BlogPost[]> {
    const posts = await this.client.post.findMany({ orderBy: { createdAt: 'desc' } });
    return posts.map((p) => this.parsePost(p));
  }

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    const post = await this.client.post.findUnique({ where: { slug } });
    return post ? this.parsePost(post) : null;
  }

  async createPost(post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<BlogPost> {
    const data = { ...post, tags: JSON.stringify(post.tags ?? []) };
    const created = await this.client.post.create({ data });
    return this.parsePost(created);
  }

  async updatePost(id: string, post: Partial<BlogPost>): Promise<BlogPost> {
    const data: Record<string, unknown> = { ...post };
    if (post.tags !== undefined) data.tags = JSON.stringify(post.tags);
    const updated = await this.client.post.update({ where: { id }, data });
    return this.parsePost(updated);
  }

  async deletePost(id: string): Promise<void> {
    await this.client.post.delete({ where: { id } });
  }

  async incrementViewCount(slug: string): Promise<void> {
    await this.client.post.update({ where: { slug }, data: { viewCount: { increment: 1 } } });
  }
}
