import styles from "./page.module.css";

const skillGroups = [
  {
    category: "Languages",
    skills: ["C#", "JavaScript", "Objective-C", "Rust", "Swift", "Java", "C++", "Solidity"]
  },
  {
    category: "Web & Backend",
    skills: ["ASP.NET Core", "Node.js", "Vue.js", "React", "Nuxt", "HTML5", "CSS3", "PHP", "Classic ASP", "Redis", "WebSockets", "WebRTC", "WebGL", "jQuery"]
  },
  {
    category: "Mobile & Gaming",
    skills: ["iOS", "Android", "Unity3D", "Xamarin", "React Native", "Kinect", "Oculus VR", "Leap Motion"]
  },
  {
    category: "Databases",
    skills: ["PostgreSQL", "MSSQL", "MongoDB", "SQLite", "NoSQL"]
  },
  {
    category: "Infrastructure",
    skills: ["Kubernetes", "Docker", "Google Cloud", "Windows Server", "Linux", "macOS", "Git", "TeamCity", "Jenkins", "CI/CD"]
  },
  {
    category: "Creative Tools",
    skills: ["Photoshop", "Flash", "Premiere", "Final Cut Pro", "Blender", "After Effects", "Illustrator"]
  }
];

export default function Skills() {
  return (
    <main className={styles.main}>
      <section className={styles.section}>
        <h1 className={styles.title}>Skills</h1>
        <p className={styles.subtitle}>12+ years building across the full stack</p>
        <div className={styles.grid}>
          {skillGroups.map((group) => (
            <div key={group.category} className={styles.group}>
              <h2 className={styles.category}>{group.category}</h2>
              <ul className={styles.skills}>
                {group.skills.map((skill) => (
                  <li key={skill} className={styles.skill}>{skill}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
