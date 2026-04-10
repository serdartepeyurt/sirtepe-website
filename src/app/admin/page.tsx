import Link from "next/link";
import styles from "./page.module.css";

export default function Admin() {
  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1 className={styles.title}>Admin Dashboard</h1>
        <Link href="/admin/new" className={styles.newBtn}>New Post</Link>
      </div>
      <div className={styles.empty}>
        <p>No posts yet. Create your first post to get started.</p>
      </div>
    </main>
  );
}
