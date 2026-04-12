"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MdxEditor from "@/components/ui/MdxEditor";
import styles from "@/app/admin/admin.module.css";

export default function NewPost() {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", slug: "", excerpt: "" });
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleTitleChange = (value: string) => {
    setForm({
      title: value,
      slug: value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      excerpt: form.excerpt,
    });
  };

  const handleSave = async () => {
    if (!form.title || !form.slug || !content) return;
    setSaving(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, content, published }),
      });
      if (res.ok) router.push("/admin");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.main}>
      <Link href="/admin" className={styles.backBtn}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to posts
      </Link>

      <div className={styles.formHeader}>
        <h1 className={styles.formTitle}>New Post</h1>
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
          <button
            type="button"
            className={styles.saveBtn}
            onClick={handleSave}
            disabled={saving || !form.title || !content}
          >
            {saving ? "Saving..." : "Publish"}
          </button>
        </div>
      </div>

      <div className={styles.formCard}>
        <div className={styles.formRow}>
          <div className={styles.formField}>
            <label className={styles.formLabel}>Title</label>
            <input
              className={styles.formInput}
              type="text"
              placeholder="Post title"
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
            />
          </div>
          <div className={styles.formField}>
            <label className={styles.formLabel}>Slug</label>
            <input
              className={`${styles.formInput} ${styles.readonly}`}
              type="text"
              value={form.slug}
              readOnly
            />
          </div>
        </div>
        <div className={styles.formField}>
          <label className={styles.formLabel}>Excerpt</label>
          <textarea
            className={styles.formTextarea}
            value={form.excerpt}
            onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
            placeholder="Short description shown in post listings..."
          />
        </div>
        <div className={styles.editorField}>
          <label className={styles.formLabel}>Content (MDX)</label>
          <div className={styles.editor}>
            <MdxEditor onChange={(v) => setContent(v || "")} />
          </div>
        </div>
      </div>
    </div>
  );
}