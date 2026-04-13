import { notFound } from "next/navigation";
import Link from "next/link";
import { PrismaContentRepository } from "@/lib/content/PrismaContentRepository";
import { GiscusCommentProvider } from "@/components/comments/GiscusCommentProvider";
import { giscusConfig } from "@/lib/comments/GiscusConfig";
import ReactMarkdown from "react-markdown";
import styles from "./page.module.css";
import type { Metadata } from "next";

const repository = new PrismaContentRepository();

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await repository.getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: `${post.title} — Serdar Tepeyurt`,
    description: post.excerpt || undefined,
    keywords: post.tags.length > 0 ? post.tags : undefined,
  };
}

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params;
  const post = await repository.getPostBySlug(slug);

  if (!post || !post.published) {
    notFound();
  }

  // Increment view count (fire and forget)
  repository.incrementViewCount(slug).catch(() => {});

  return (
    <main className={styles.main}>
      <article className={styles.article}>
        <header className={styles.header}>
          <time className={styles.date}>
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          <h1 className={styles.title}>{post.title}</h1>
          {post.excerpt && <p className={styles.excerpt}>{post.excerpt}</p>}
        </header>
        {post.tags.length > 0 && (
          <div className={styles.tagList}>
            {post.tags.map((t: string) => (
              <Link key={t} href={`/blog?tag=${encodeURIComponent(t)}`} className={styles.tagChip}>
                {t}
              </Link>
            ))}
          </div>
        )}
        <div className={styles.content}>
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
        {giscusConfig.repo && <GiscusCommentProvider {...giscusConfig} />}
      </article>
    </main>
  );
}
