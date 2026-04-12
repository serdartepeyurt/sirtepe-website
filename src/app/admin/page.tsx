"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import styles from "@/app/admin/admin.module.css";
import type { BlogPost } from "@/interfaces/IContentRepository";

type Filter = "all" | "published" | "draft";
type SortField = "createdAt" | "title" | "published";

export default function AdminDashboard() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [toggling, setToggling] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch("/api/posts");
      if (res.ok) setPosts(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const togglePublish = async (post: BlogPost) => {
    setToggling(post.id);
    try {
      const res = await fetch("/api/posts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: post.id, published: !post.published }),
      });
      if (res.ok) {
        const updated = await res.json();
        setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, published: updated.published } : p)));
      }
    } finally {
      setToggling(null);
    }
  };

  const deletePost = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/posts?id=${id}`, { method: "DELETE" });
    if (res.ok) setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("asc"); }
  };

  const filtered = posts
    .filter((p) => {
      if (filter === "published" && !p.published) return false;
      if (filter === "draft" && p.published) return false;
      if (search) {
        const q = search.toLowerCase();
        return p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q);
      }
      return true;
    })
    .sort((a, b) => {
      let va: string | boolean = a[sortField] as string | boolean;
      let vb: string | boolean = b[sortField] as string | boolean;
      if (typeof va === "boolean") {
        va = va ? "1" : "0";
        vb = (vb as boolean) ? "1" : "0";
      }
      const cmp = va < vb ? -1 : va > vb ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });

  const publishedCount = posts.filter((p) => p.published).length;
  const draftCount = posts.filter((p) => !p.published).length;

  return (
    <>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>All Posts</h1>
          <p className={styles.pageSubtitle}>{posts.length} total — {publishedCount} published, {draftCount} draft</p>
        </div>
        <Link href="/admin/new" className={styles.saveBtn}>+ New Post</Link>
      </div>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total</div>
          <div className={styles.statValue}>{posts.length}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Published</div>
          <div className={styles.statValue}>{publishedCount}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Drafts</div>
          <div className={styles.statValue}>{draftCount}</div>
        </div>
      </div>

      <div className={styles.tableToolbar}>
        <div className={styles.searchWrapper}>
          <svg className={styles.searchIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.filterTabs}>
          {(["all", "published", "draft"] as Filter[]).map((f) => (
            <button key={f} className={`${styles.filterTab} ${filter === f ? styles.active : ""}`} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.tableWrapper}>
        {loading ? (
          <div className={styles.loadingRow}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div className={styles.emptyTable}>
            {posts.length === 0 ? "No posts yet — create your first post." : "No posts match your filter."}
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.colTitle} onClick={() => handleSort("title")} style={{ cursor: "pointer" }}>
                  Title {sortField === "title" ? (sortDir === "asc" ? " ↑" : " ↓") : ""}
                </th>
                <th className={styles.colStatus}>Status</th>
                <th className={styles.colDate} onClick={() => handleSort("createdAt")} style={{ cursor: "pointer" }}>
                  Date {sortField === "createdAt" ? (sortDir === "asc" ? " ↑" : " ↓") : ""}
                </th>
                <th className={styles.colActions}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((post) => (
                <tr key={post.id}>
                  <td>
                    <span className={styles.postTitleCell}>{post.title}</span>
                    <span className={styles.postSlugCell}>/{post.slug}</span>
                  </td>
                  <td>
                    <span className={`${styles.statusBadge} ${post.published ? styles.statusPublished : styles.statusDraft}`}>
                      <span className={styles.dot} />
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className={styles.colDate}>
                    {new Date(post.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td>
                    <div className={styles.actionsCell}>
                      <button
                        className={`${styles.toggleBtn} ${post.published ? styles.toggleDraft : styles.togglePublish}`}
                        onClick={() => togglePublish(post)}
                        disabled={toggling === post.id}
                        title={post.published ? "Unpublish (save as draft)" : "Publish"}
                      >
                        {post.published ? (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H10" />
                          </svg>
                        ) : (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12l5 5L20 7" />
                          </svg>
                        )}
                      </button>
                      <Link href={`/admin/edit/${post.id}`} className={styles.iconBtn} title="Edit post">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Link>
                      <Link href={`/blog/${post.slug}`} target="_blank" className={styles.iconBtn} title="View on site">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </Link>
                      <button className={`${styles.iconBtn} ${styles.danger}`} onClick={() => deletePost(post.id, post.title)} title="Delete post">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}