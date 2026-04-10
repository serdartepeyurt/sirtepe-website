"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import styles from "./MdxEditor.module.css";
import ReactMarkdown from "react-markdown";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface MdxEditorProps {
  initialValue?: string;
  onChange?: (value: string) => void;
}

export default function MdxEditor({ initialValue = "", onChange }: MdxEditorProps) {
  const [value, setValue] = useState(initialValue);
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");

  const handleChange = useCallback((val: string | undefined) => {
    const newValue = val || "";
    setValue(newValue);
    onChange?.(newValue);
  }, [onChange]);

  return (
    <div className={styles.container} data-color-mode="dark">
      <div className={styles.tabs}>
        <button
          type="button"
          className={`${styles.tab} ${activeTab === "write" ? styles.active : ""}`}
          onClick={() => setActiveTab("write")}
        >
          Write
        </button>
        <button
          type="button"
          className={`${styles.tab} ${activeTab === "preview" ? styles.active : ""}`}
          onClick={() => setActiveTab("preview")}
        >
          Preview
        </button>
      </div>
      <div className={styles.editorWrapper}>
        {activeTab === "write" ? (
          <div className={styles.editor}>
            <MDEditor
              value={value}
              onChange={handleChange}
              height="100%"
              preview="edit"
              hideToolbar
            />
          </div>
        ) : (
          <div className={styles.preview}>
            <ReactMarkdown>{value || "*Nothing to preview*"}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
