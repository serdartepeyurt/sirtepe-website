"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MdxEditor from "@/components/ui/MdxEditor";
import styles from "./page.module.css";

export default function NewPost() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    setSlug(value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
  };

  const handleSave = async () => {
    if (!title || !slug || !content) return;
    setSaving(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, slug, excerpt, content, published }),
      });
      if (res.ok) {
        router.push("/admin");
      }
    } catch (error) {
      console.error("Failed to save post:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1 className={styles.title}>New Post</h1>
        <div className={styles.actions}>
          <button
            type="button"
            onClick={() => setPublished(!published)}
            className={`${styles.publishBtn} ${published ? styles.published : ""}`}
            title={published ? "Currently published — click to save as draft instead" : "Currently draft — click to publish instead"}
          >
            {published ? "Published \u2713" : "Save as Draft"}
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !title || !content}
            className={styles.saveBtn}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
      <div className={styles.form}>
        <div className={styles.fields}>
          <input
            type="text"
            placeholder="Post title"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className={styles.titleInput}
          />
          <input
            type="text"
            placeholder="slug"
            value={slug}
            readOnly
            className={styles.slugInput}
          />
          <input
            type="text"
            placeholder="Excerpt (optional)"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className={styles.excerptInput}
          />
        </div>
        <div className={styles.editor}>
          <MdxEditor onChange={setContent} />
        </div>
      </div>
    </main>
  );
}
