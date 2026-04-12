"use client";

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import type { BlogPost } from "@/interfaces/IContentRepository";

export default function Admin() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/posts");
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    const res = await fetch(`/api/posts?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1 className={styles.title}>Admin Dashboard</h1>
        <Link href="/admin/new" className={styles.newBtn}>New Post</Link>
      </div>
      {loading ? (
        <div className={styles.empty}><p>Loading...</p></div>
      ) : posts.length === 0 ? (
        <div className={styles.empty}>
          <p>No posts yet. Create your first post to get started.</p>
        </div>
      ) : (
        <div className={styles.list}>
          {posts.map((post) => (
            <div key={post.id} className={styles.post}>
              <div className={styles.postInfo}>
                <span className={`${styles.status} ${post.published ? styles.published : styles.draft}`}>
                  {post.published ? "Published" : "Draft"}
                </span>
                <span className={styles.postTitle}>{post.title}</span>
                <span className={styles.postSlug}>/{post.slug}</span>
              </div>
              <div className={styles.postActions}>
                <Link href={`/blog/${post.slug}`} className={styles.viewBtn} target="_blank">View</Link>
                <button type="button" onClick={() => handleDelete(post.id)} className={styles.deleteBtn}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
