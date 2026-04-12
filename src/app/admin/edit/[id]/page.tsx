"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MdxEditor from "@/components/ui/MdxEditor";
import styles from "./admin.module.css";
import type { BlogPost } from "@/interfaces/IContentRepository";

export default function EditPost({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: "", slug: "", excerpt: "", content: "" });
  const [published, setPublished] = useState(false);

  const loadPost = useCallback(async () => {
    const res = await fetch("/api/posts");
    if (!res.ok) { router.push("/admin"); return; }
    const posts: BlogPost[] = await res.json();
    const found = posts.find((p) => p.id === params.id);
    if (!found) { router.push("/admin"); return; }
    setPost(found);
    setForm({ title: found.title, slug: found.slug, excerpt: found.excerpt || "", content: found.content });
    setPublished(found.published);
    setLoading(false);
  }, [params.id, router]);

  useEffect(() => { loadPost(); }, [loadPost]);

  const handleTitleChange = (value: string) => {
    setForm((f) => ({
      ...f,
      title: value,
      slug: value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    }));
  };

  const handleSave = async () => {
    if (!form.title || !form.slug || !form.content || !post) return;
    setSaving(true);
    try {
      const res = await fetch("/api/posts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: post.id, ...form, published }),
      });
      if (res.ok) {
        const updated = await res.json();
        setPost(updated);
        router.push("/admin");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.main}>
        <div className={styles.loadingRow}>Loading...</div>
      </div>
    );
  }

  return (
    <div className={styles.main}>
      <Link href="/admin" className={styles.backBtn}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to posts
      </Link>

      <div className={styles.formHeader}>
        <h1 className={styles.formTitle}>Edit Post</h1>
        <div className={styles.formActions}>
          <button
            type="button"
            className={`${styles.publishToggle} ${published ? styles.on : ""}`}
            onClick={() => setPublished((p) => !p)}
          >
            {published ? (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12l5 5L20 7" />
                </svg>
                Published
              </>
            ) : (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H10" />
                </svg>
                Save as Draft
              </>
            )}
          </button>
          <button type="button" className={styles.saveBtn} onClick={handleSave} disabled={saving || !form.title || !form.content}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className={styles.formCard}>
        <div className={styles.formRow}>
          <div className={styles.formField}>
            <label className={styles.formLabel}>Title</label>
            <input className={styles.formInput} type="text" value={form.title} onChange={(e) => handleTitleChange(e.target.value)} />
          </div>
          <div className={styles.formField}>
            <label className={styles.formLabel}>Slug</label>
            <input className={`${styles.formInput} ${styles.readonly}`} type="text" value={form.slug} readOnly />
          </div>
        </div>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Excerpt</label>
          <textarea className={styles.formTextarea} value={form.excerpt} onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))} placeholder="Short description shown in post listings..." />
        </div>
        <div className={styles.editorField}>
          <label className={styles.formLabel}>Content (MDX)</label>
          <div className={styles.editor}>
            <MdxEditor onChange={(v) => setForm((f) => ({ ...f, content: v || "" }))} />
          </div>
        </div>
      </div>
    </div>
  );
}
