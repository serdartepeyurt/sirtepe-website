"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import styles from "@/app/admin/admin.module.css";
import type { BlogPost } from "@/interfaces/IContentRepository";

type Filter = "all" | "published" | "draft";

export default function AdminDashboard() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [activeTag, setActiveTag] = useState<string | null>(null);
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

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach((p) => p.tags.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, [posts]);

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

  const filtered = posts
    .filter((p) => {
      if (filter === "published" && !p.published) return false;
      if (filter === "draft" && p.published) return false;
      if (activeTag && !p.tags.includes(activeTag)) return false;
      if (search) {
        const q = search.toLowerCase();
        return p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q);
      }
      return true;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const publishedCount = posts.filter((p) => p.published).length;
  const draftCount = posts.filter((p) => !p.published).length;
  const totalViews = posts.reduce((sum, p) => sum + p.viewCount, 0);
  const topPost = posts.reduce<BlogPost | null>((top, p) =>
    (!top || p.viewCount > top.viewCount) ? p : top, null);

  return (
    <>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Dashboard</h1>
          <p className={styles.pageSubtitle}>Overview of your content</p>
        </div>
        <Link href="/admin/new" className={styles.saveBtn}>+ New Post</Link>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Posts</div>
          <div className={styles.statValue}>{posts.length}</div>
          <div className={styles.statSub}>{publishedCount} published, {draftCount} draft</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Views</div>
          <div className={styles.statValue}>{totalViews.toLocaleString()}</div>
          <div className={styles.statSub}>across {publishedCount} published posts</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Top Post</div>
          <div className={styles.statValueSmall}>{topPost?.title ?? "—"}</div>
          <div className={styles.statSub}>{topPost ? `${topPost.viewCount.toLocaleString()} views` : "no posts yet"}</div>
        </div>
      </div>

      {allTags.length > 0 && (
        <div className={styles.tagFilterBar}>
          <button
            className={`${styles.tagFilterChip} ${activeTag === null ? styles.active : ""}`}
            onClick={() => setActiveTag(null)}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              className={`${styles.tagFilterChip} ${activeTag === tag ? styles.active : ""}`}
              onClick={() => setActiveTag((t) => (t === tag ? null : tag))}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

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
                <th className={styles.colTitle}>Title</th>
                <th className={styles.colStatus}>Status</th>
                <th className={styles.colTags}>Tags</th>
                <th className={styles.colViews}>Views</th>
                <th className={styles.colDate}>Date</th>
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
                  <td className={styles.colTags}>
                    <div className={styles.tagCell}>
                      {post.tags.map((tag) => (
                        <button
                          key={tag}
                          className={styles.tagFilterChip}
                          onClick={() => setActiveTag((t) => (t === tag ? null : tag))}
                          style={{ cursor: "pointer" }}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </td>
                  <td className={styles.colViews}>
                    <span className={styles.viewCount}>
                      {post.viewCount > 0 ? post.viewCount.toLocaleString() : "—"}
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
                        title={post.published ? "Move to draft" : "Publish"}
                      >
                        {post.published ? (
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H10" />
                          </svg>
                        ) : (
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
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