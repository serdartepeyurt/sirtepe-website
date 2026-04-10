import styles from "./page.module.css";

export default function Contact() {
  return (
    <main className={styles.main}>
      <section className={styles.section}>
        <h1 className={styles.title}>Get in Touch</h1>
        <p className={styles.subtitle}>
          Open to discussing new opportunities, consulting projects, or just connecting.
        </p>
        <div className={styles.links}>
          <a href="mailto:st@serdartepeyurt.com" className={styles.link}>
            <span className={styles.label}>Email</span>
            <span className={styles.value}>st@serdartepeyurt.com</span>
          </a>
          <a href="tel:+447367668078" className={styles.link}>
            <span className={styles.label}>Phone</span>
            <span className={styles.value}>+44 7367 668 078</span>
          </a>
          <a href="https://linkedin.com/in/serdar-tepeyurt" target="_blank" rel="noopener noreferrer" className={styles.link}>
            <span className={styles.label}>LinkedIn</span>
            <span className={styles.value}>linkedin.com/in/serdar-tepeyurt</span>
          </a>
        </div>
      </section>
    </main>
  );
}
