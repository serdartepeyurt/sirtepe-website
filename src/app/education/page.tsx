import styles from "./page.module.css";

const education = [
  {
    degree: "MSc Mechatronics Engineering",
    school: "İstanbul Gedik University",
    period: "2014",
    description: "Advanced robotics, control systems, and integrated engineering design."
  },
  {
    degree: "BSc Software Engineering",
    school: "İstanbul Maltepe University",
    period: "2010",
    description: "Foundation in software architecture, algorithms, and system design."
  }
];

export default function Education() {
  return (
    <main className={styles.main}>
      <section className={styles.section}>
        <h1 className={styles.title}>Education</h1>
        <div className={styles.cards}>
          {education.map((edu, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.header}>
                <span className={styles.period}>{edu.period}</span>
                <h2 className={styles.degree}>{edu.degree}</h2>
                <p className={styles.school}>{edu.school}</p>
              </div>
              <p className={styles.description}>{edu.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
