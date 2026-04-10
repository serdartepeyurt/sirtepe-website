import Link from "next/link";
import { PrismaContentRepository } from "@/lib/content/PrismaContentRepository";
import styles from "./page.module.css";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Blog — Serdar Tepeyurt",
    description: "Thoughts on software, technology, and engineering",
  };
}

const repository = new PrismaContentRepository();

export default async function Blog() {
  const posts = await repository.getAllPosts();
  const publishedPosts = posts.filter(post => post.published);

  return (
    <main className={styles.main}>
      <section className={styles.section}>
        <h1 className={styles.title}>Blog</h1>
        <p className={styles.subtitle}>Thoughts on software, technology, and engineering</p>
        {publishedPosts.length === 0 ? (
          <div className={styles.empty}>
            <p>No posts published yet.</p>
          </div>
        ) : (
          <div className={styles.posts}>
            {publishedPosts.map((post) => (
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
                {post.excerpt && (
                  <p className={styles.excerpt}>{post.excerpt}</p>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
