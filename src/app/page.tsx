import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <div className={styles.imageWrapper}>
          <Image
            src="/welcome.jpeg"
            alt="Serdar Tepeyurt"
            fill
            priority
            className={styles.heroImage}
          />
          <div className={styles.overlay} />
        </div>
        <div className={styles.content}>
          <p className={styles.greeting}>Welcome</p>
          <h1 className={styles.name}>Serdar Tepeyurt</h1>
          <p className={styles.title}>Senior Full Stack Software Engineer</p>
          <p className={styles.tagline}>
            Building scalable systems, VR experiences, and distributed applications for over 12 years.
          </p>
          <div className={styles.cta}>
            <Link href="/experience" className={styles.primaryBtn}>View Experience</Link>
            <Link href="/contact" className={styles.secondaryBtn}>Get in Touch</Link>
          </div>
        </div>
        <div className={styles.scrollIndicator}>
          <span>Scroll</span>
          <div className={styles.scrollLine} />
        </div>
      </div>
    </main>
  );
}
