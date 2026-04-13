import Link from "next/link";
import { PrismaContentRepository } from "@/lib/content/PrismaContentRepository";
import styles from "./page.module.css";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

const repository = new PrismaContentRepository();

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Blog — Serdar Tepeyurt",
    description: "Thoughts on software, technology, and engineering",
  };
}

export default async function Blog({ searchParams }: { searchParams: Promise<{ tag?: string }> }) {
  const { tag } = await searchParams;
  let posts = await repository.getAllPosts();
  posts = posts.filter((p) => p.published);

  // Collect all tags
  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags))).sort();

  // Filter by tag if provided
  if (tag) {
    posts = posts.filter((p) => p.tags.includes(tag));
  }

  return (
    <main className={styles.main}>
      <section className={styles.section}>
        <h1 className={styles.title}>Blog</h1>
        <p className={styles.subtitle}>Thoughts on software, technology, and engineering</p>

        {allTags.length > 0 && (
          <div className={styles.tagBar}>
            <Link
              href="/blog"
              className={`${styles.tagChip} ${!tag ? styles.tagActive : ""}`}
            >
              All
            </Link>
            {allTags.map((t) => (
              <Link
                key={t}
                href={`/blog?tag=${encodeURIComponent(t)}`}
                className={`${styles.tagChip} ${tag === t ? styles.tagActive : ""}`}
              >
                {t}
              </Link>
            ))}
          </div>
        )}

        {posts.length === 0 ? (
          <div className={styles.empty}>
            <p>No posts published yet.</p>
          </div>
        ) : (
          <div className={styles.posts}>
            {posts.map((post) => (
              <article key={post.id} className={styles.post}>
                <span className={styles.date}>
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <Link href={`/blog/${post.slug}`} className={styles.postTitle}>
                  {post.title}
                </Link>
                {post.excerpt && <p className={styles.excerpt}>{post.excerpt}</p>}
                {post.tags.length > 0 && (
                  <div className={styles.tagList}>
                    {post.tags.map((t) => (
                      <Link key={t} href={`/blog?tag=${encodeURIComponent(t)}`} className={styles.tagChip}>
                        {t}
                      </Link>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
