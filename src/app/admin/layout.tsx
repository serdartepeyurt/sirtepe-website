import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import styles from "./admin.module.css";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  if (!sessionToken) {
    redirect("/api/auth/login");
  }

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          <span className={styles.sidebarLogoText}>Sirtepe CMS</span>
        </div>
        <nav className={styles.nav}>
          <span className={styles.navSection}>Content</span>
          <a href="/admin" className={`${styles.navLink} ${styles.active}`}>
            <svg className={styles.navIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            All Posts
          </a>
          <a href="/admin/new" className={styles.navLink}>
            <svg className={styles.navIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Post
          </a>
          <span className={styles.navSection}>Session</span>
          <form action="/api/auth/logout" method="POST">
            <button type="submit" className={styles.logoutBtn}>
              <svg className={styles.navIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </form>
        </nav>
      </aside>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
