import Image from "next/image";
import styles from "./page.module.css";

interface Section {
  type: "paragraph" | "header" | "bullets" | "image";
  content?: string;
  items?: string[];
  src?: string;
  alt?: string;
}

interface Experience {
  company: string;
  role: string;
  period: string;
  sections: Section[];
}

function renderBulletContent(text: string) {
  const colonIndex = text.indexOf(':');
  if (colonIndex > 0 && colonIndex < 30) {
    return (
      <>
        <strong>{text.substring(0, colonIndex + 1)}</strong>
        {text.substring(colonIndex + 1)}
      </>
    );
  }
  return text;
}

const experiences: Experience[] = [
  {
    company: "Soul Assembly",
    role: "Senior Programmer",
    period: "2022 — Present",
    sections: [
      { type: "paragraph", content: "Owned the end-to-end development of multiple core game systems for Just Dance VR, collaborating within a large, multi-disciplinary team. Drove technical initiatives and mentored junior developers on best practices." },
      { type: "header", content: "Just Dance VR" },
      { type: "image", src: "/just-dance-vr.jpg", alt: "Just Dance VR" },
      { type: "bullets", items: [
        "Social System: Architected and implemented a P2P social system using Photon Chat, delivering foundational features including friends, player groups, and a voting system.",
        "Core Mechanics: Led the design and implementation of critical game mechanics, including the offline save system, toys, haptics scheduler, and complex interaction systems.",
        "Scoring System: Designed and implemented the scoring system, streamlining scoring logic, testing, and aligning title scoring across platforms.",
        "Dependency Injection: Proactively engineered features like build-time dependency injection cache, slashing game boot time by 2 seconds and significantly improving runtime performance."
      ]},
      { type: "header", content: "Project Panda" },
      { type: "bullets", items: [
        "CPU Optimizations: Engineered critical CPU optimizations as a specialist on a technical strike team, systematically profiling and enhancing performance while proactively identifying and resolving deep-rooted performance bottlenecks.",
        "Low-level Infrastructure: Worked on Bootstrapper system, a new scene loader designed from scratch, collection views, virtual scrolling, item recycling, roster/pool optimizations, critical cache implementations, deep profiling, CTA signal infrastructure, server selection screen, analytics events, package updates, and got the game ready for submission and technical soft launch."
      ]},
      { type: "header", content: "Noble VR Game Template" },
      { type: "bullets", items: [
        "Modular Framework: Pioneered the Noble VR game template by architecting a modular framework from reusable components, establishing a new foundation for the rapid development of future multiplayer titles and mini-games."
      ]}
    ]
  },
  {
    company: "OnlineYedekParca.Com - Backend",
    role: "Backend Engineer",
    period: "2021 — 2022",
    sections: [
      { type: "paragraph", content: "Built an e-commerce backend for a leading Turkish car parts dealer, from the ground up. Microservice architecture, each component in its own container, communicating over JSON. PostgreSQL for data, Redis for hybrid caching. ASP.NET Core on Kubernetes and Google Cloud. Handles over 500K requests daily with no downtime. Also built the management panel with Vue.js." },
      { type: "bullets", items: [
        "Architecture: Microservice architecture with containers, JSON communication, PostgreSQL, Redis hybrid caching.",
        "Backend: ASP.NET Core on Kubernetes and Google Cloud.",
        "Frontend: Management panel built with Vue.js."
      ]}
    ]
  },
  {
    company: "Arsuite",
    role: "Software Architect - Head of Research",
    period: "2019 — 2022",
    sections: [
      { type: "paragraph", content: "WebGL and 3D tech for a startup. Built a WebGL 3D engine from scratch, created a custom binary file format (ARSX), and shipped a cloud-native 3D world solution. The main challenge was pushing browser limits, they are very resource constrained." },
      { type: "header", content: "What I Built" },
      {
        type: "bullets",
        items: [
          "3D Rendering Engine: PBR engine supporting Metal-Rough and Specular-Glossiness workflows. Forward renderer with custom optimizations: frustum culling, batch rendering, instanced rendering, material grouping. Custom material/shader system for user-defined material types.",
          "Scene Designer: Browser-based scene editor on top of the same engine. Upload models, drag and drop, configure skybox, lighting, shadows, colliders, PBR materials, multiple material sets per object, viewer settings, background options, texture packing.",
          "Material Designer: Node-based material editor. Combines shader node outputs to generate materials.",
          "Game Engine: ECS architecture with hierarchical system. Deeply integrated with the 3D engine, supports JavaScript scripting over game objects.",
          "ARSX File Format: Custom binary format for 3D models. Fast, optimized loading plus a side benefit of obfuscating customer files.",
          "AR Generator: Converts scene descriptions to GLTF and USDZ for AR on iOS and Android.",
          "HDRI Converter: Converts HDRI skyboxes to PNG-based format for browsers. Generated files used for IBL at runtime, both diffuse irradiance and roughness/specular reflection maps, since the alpha channel holds the lighting data.",
          "Threedfy: NFT solution distributing 3D scenes and assets over cloud and blockchains."
        ]
      }
    ]
  },
  {
    company: "Aurea Software",
    role: "Software Architect",
    period: "May 2016 — Sep 2017",
    sections: [
      { type: "paragraph", content: "Built a fully featured, dynamically changing CRM app with a team. Made the architectural decisions. Windows 10 UWP with MVVM architecture. Also shipped an iOS version via Xamarin, from the same codebase. C# and .NET Standard throughout." }
    ]
  },
  {
    company: "Cmos Teknoloji",
    role: "Senior Software Engineer",
    period: "January 2015 — Aug 2019",
    sections: [
      { type: "paragraph", content: "Software house building websites, mobile apps (iOS and Android), augmented reality apps and games, 3D games with Unity3D, Kinect, and OculusVR, integrated management and automation systems with electronics, touch screen apps, and desktop apps." },
      { type: "header", content: "Projects" },
      {
        type: "bullets",
        items: [
          "Housing Management: Software with appliance controllers.",
          "Customer Tracking: Supermarket tracking with 2D mapping support.",
          "Rain Room: Kinect and Arduino integration.",
          "Perfume Machine: Arduino-based system.",
          "Shopping Habits: Customer tracking system with ASP.NET Core and Xamarin.",
          "Museum Automation: Galatasaray Museum lighting automation.",
          "Digital Signage: Application for digital displays."
        ]
      },
      { type: "header", content: "Internal Tools" },
      {
        type: "bullets",
        items: [
          "iOS Enterprise: Custom installation system.",
          "HTML Presentations: JavaScript library with animations and actions.",
          "App Manager: Windows service for touchscreen products.",
          "Game Center API: Node.js API with wrappers in multiple languages."
        ]
      }
    ]
  },
  {
    company: "Cmos Teknoloji",
    role: "Software Engineer",
    period: "January 2012 — January 2015",
    sections: [
      { type: "paragraph", content: "Software house building websites, mobile apps (iOS and Android), augmented reality apps and games, 3D games with Unity3D, Kinect, and OculusVR, integrated management and automation systems with electronics, touch screen apps, and desktop apps." }
    ]
  },
  {
    company: "Zenger Ltd.",
    role: "Web / Software Developer",
    period: "March 2008 — January 2012",
    sections: [
      { type: "paragraph", content: "Four years working directly with Yilmaz Zenger, an industrial designer. Learned problem solving, design, and reasoning through one-on-one collaboration. Gained solid experience in animation, cinema, and photography, which gave me a different perspective on software and design. Working with Yilmaz Zenger was a turning point in both my professional and personal life. Rest in peace Yilmaz!" },
      { type: "bullets", items: [
        "CNC Programs: Wrote a lot of CNC programs.",
        "Kiosks: Built interactive kiosks and developed their software.",
        "Websites: Designed and developed the company website and Yilmaz Zenger's personal website."
      ] }
    ]
  },
  {
    company: "Rayno Interactive",
    role: "Web Developer",
    period: "March 2008 — December 2009",
    sections: [
      { type: "paragraph", content: "Built websites for clients including Televole.com, Laparoskopik.com, and Aymimarlik.com.tr. Worked in Classic ASP." }
    ]
  },
  {
    company: "Freelance",
    role: "Software Architect / Developer",
    period: "2009 — 2020",
    sections: [
      { type: "paragraph", content: "Developed backends, websites, mobile apps, and games as a freelance worker. Mainly worked on Unity3D, iOS, and .NET. Also provided consulting services externally." },
      { type: "header", content: "Projects" },
      { type: "bullets", items: [
        "Find the Driver: Instant messaging app where drivers can find each other by license plate. MQTT server written in Erlang, backend in ASP.NET Core, mobile side in Xamarin. Runs on Kubernetes and Google Cloud.",
        "Fireboy and Watergirl Online: Platformer/puzzle multiplayer mobile game for iOS and Android. Level designer supports dynamic updates without app package updates. Unity and C#.",
        "Bowman 2: 2D archery mobile game. Unity and C#."
      ]}
    ]
  }
];

export default function Experience() {
  return (
    <main className={styles.main}>
      <section className={styles.section}>
        <h1 className={styles.title}>Generalist Software Engineer</h1>
        <div className={styles.timeline}>
          {experiences.map((exp, index) => (
            <div key={index} className={styles.item}>
              <div className={styles.marker} />
              <div className={styles.content}>
                <span className={styles.period}>{exp.period}</span>
                <h2 className={styles.role}>{exp.role}</h2>
                <p className={styles.company}>{exp.company}</p>
                <div className={styles.sections}>
                  {exp.sections.map((section, sIndex) => (
                    <div key={sIndex} className={styles.section}>
                      {section.type === "header" && (
                        <h3 className={styles.sectionHeader}>{section.content}</h3>
                      )}
                      {section.type === "paragraph" && (
                        <p className={styles.paragraph}>{section.content}</p>
                      )}
                      {section.type === "bullets" && section.items && (
                        <ul className={styles.bullets}>
                          {section.items.map((item, bIndex) => (
                            <li key={bIndex}>{renderBulletContent(item)}</li>
                          ))}
                        </ul>
                      )}
                      {section.type === "image" && section.src && (
                        <div className={styles.imageWrapper}>
                          <Image
                            src={section.src}
                            alt={section.alt || ""}
                            fill
                            className={styles.sectionImage}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
