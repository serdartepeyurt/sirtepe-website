import styles from "./page.module.css";

const hobbies = [
  {
    title: "VR & Game Development",
    description: "Exploring emerging VR technologies, building experimental games, and contributing to open source game dev projects."
  },
  {
    title: "3D Graphics",
    description: "Experimenting with WebGL, Three.js, and real-time rendering techniques. Creating procedural 3D art and visualizations."
  },
  {
    title: "Systems Programming",
    description: "Learning Rust in my spare time. Building CLI tools and experimenting with low-level optimization."
  },
  {
    title: "Photography",
    description: "Capturing urban landscapes and architectural details. Post-processing with custom scripts."
  }
];

export default function Hobbies() {
  return (
    <main className={styles.main}>
      <section className={styles.section}>
        <h1 className={styles.title}>Hobbies</h1>
        <p className={styles.subtitle}>Beyond code</p>
        <div className={styles.grid}>
          {hobbies.map((hobby, index) => (
            <div key={index} className={styles.card}>
              <span className={styles.number}>0{index + 1}</span>
              <h2 className={styles.hobbyTitle}>{hobby.title}</h2>
              <p className={styles.hobbyDescription}>{hobby.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
