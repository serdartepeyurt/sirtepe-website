export interface GiscusConfig {
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

function getEnv(key: string, fallback: string): string {
  return process.env[key] || fallback;
}

export const giscusConfig: GiscusConfig = {
  repo: getEnv("GISCUS_REPO", ""),
  repoId: getEnv("GISCUS_REPO_ID", ""),
  category: getEnv("GISCUS_CATEGORY", "Comments"),
  categoryId: getEnv("GISCUS_CATEGORY_ID", ""),
  mapping: "pathname",
  reactions: "1",
  emitMetadata: "0",
  inputPosition: "bottom",
  lang: "en",
};
