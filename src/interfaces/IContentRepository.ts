export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string | null;
  tags: string[];
  published: boolean;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IContentRepository {
  getAllPosts(): Promise<BlogPost[]>;
  getPostBySlug(slug: string): Promise<BlogPost | null>;
  createPost(post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<BlogPost>;
  updatePost(id: string, post: Partial<BlogPost>): Promise<BlogPost>;
  deletePost(id: string): Promise<void>;
  incrementViewCount(slug: string): Promise<void>;
}
