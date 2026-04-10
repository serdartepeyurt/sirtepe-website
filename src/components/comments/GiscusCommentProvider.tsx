"use client";

import { useEffect, useRef } from "react";
import styles from "./CommentSection.module.css";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "giscus-widget": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

interface GiscusCommentProviderProps {
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
  mapping: string;
  reactions: string;
  emitMetadata: string;
  inputPosition: string;
  lang: string;
}

export function GiscusCommentProvider({
  repo,
  repoId,
  category,
  categoryId,
  mapping,
  reactions,
  emitMetadata,
  inputPosition,
  lang,
}: GiscusCommentProviderProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", repo);
    script.setAttribute("data-repo-id", repoId);
    script.setAttribute("data-category", category);
    script.setAttribute("data-category-id", categoryId);
    script.setAttribute("data-mapping", mapping);
    script.setAttribute("data-reactions", reactions);
    script.setAttribute("data-emit-metadata", emitMetadata);
    script.setAttribute("data-input-position", inputPosition);
    script.setAttribute("data-theme", "dark");
    script.setAttribute("data-lang", lang);
    script.crossOrigin = "anonymous";
    script.async = true;
    ref.current.appendChild(script);
  }, [repo, repoId, category, categoryId, mapping, reactions, emitMetadata, inputPosition, lang]);

  return <div ref={ref} className={styles.container} />;
}
