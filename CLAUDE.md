# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Website Owner

Serdar Tepeyurt — Senior Full Stack Software Engineer, Leamington Spa, UK
- Email: st@serdartepeyurt.com
- LinkedIn: linkedin.com/in/serdar-tepeyurt
- Phone: +44 7367 668 078

## Project Overview

Personal website — professional portfolio with blog system. Built from scratch in this repo.

## Tech Stack

Next.js 16 (App Router) + TypeScript + CSS Modules (no Tailwind unless requested).

## Site Structure

```
src/
├── app/
│   ├── page.tsx              # Home/Hero with welcome.jpeg
│   ├── experience/page.tsx   # Timeline of roles
│   ├── skills/page.tsx       # Skills grid by category
│   ├── education/page.tsx    # BSc/MSc education
│   ├── hobbies/page.tsx      # Personal interests
│   ├── contact/page.tsx      # Email, phone, LinkedIn
│   ├── blog/
│   │   ├── page.tsx          # Post listing
│   │   └── [slug]/page.tsx   # Individual post
│   ├── admin/
│   │   ├── page.tsx          # Dashboard
│   │   └── new/page.tsx      # MDX editor (write/preview tabs)
│   └── api/
│       ├── auth/login/route.ts
│       ├── auth/callback/route.ts
│       ├── auth/logout/route.ts
│       └── posts/route.ts
├── components/
│   ├── layout/               # Header, Footer
│   └── ui/                   # MdxEditor
├── interfaces/               # IAuthProvider, IContentRepository, IDatabase, IStorageProvider
└── lib/
    ├── auth/                 # GoogleAuthProvider
    ├── content/              # PrismaContentRepository
    ├── database/             # PrismaDatabase
    └── storage/              # FileSystemStorageProvider
```

## Key Commands

```bash
npm run dev      # Start dev server localhost:5000
npm run build    # Production build
npm run lint     # ESLint
```

## Design Direction

Dark theme. Night blue background (#0a1628). NOT black. Professional, striking — as if visual communication designer crafted it. Gradient text accents (cyan #38bdf8 to indigo #818cf8). Geometric-style timeline and hover effects.

## CV Reference (source of truth for content)

CV provided directly by user (April 2026).

Key facts:
- 12+ years full stack experience
- BSc Software Engineering (İstanbul Maltepe University, 2013), MSc Mechatronics Engineering (İstanbul Gedik University, 2017)
- Current: Software Engineer at Soul Assembly (2022 — ), Just Dance VR development
- Past roles: OnlineYedekParca.Com Backend Engineer (2021-2022), Arsuite Software Architect (2019-2022), Aurea Software Architect (2016-2017), Cmos Teknoloji Senior/Software Engineer (2012-2019)
- Languages: C#, JavaScript, Objective-C, Rust, Swift, Java, C++, Solidity
- Web: ASP.NET Core, Vue.js, React, Node.js, WebGL, WebSockets, WebRTC, Redis
- Mobile/Gaming: iOS, Android, Unity3D, Xamarin, Kinect, Oculus VR, Leap Motion
- Databases: PostgreSQL, MSSQL, MongoDB, SQLite
- Infrastructure: Kubernetes, Docker, GCP, Windows Server, Linux, macOS
- Creative: Photoshop, Flash, Premiere, Final Cut Pro, Blender, After Effects, Illustrator
- Freelance highlights: Find the Driver (MQTT/ASP.NET/Xamarin, 2019), Fireboy and Watergirl Online (Unity, 2015), Bowman 2 (Unity, 2015)
- Languages: English (Fluent), Turkish (Native)

## Architecture

### Database
SQLite via Prisma 7 ORM + better-sqlite3 adapter. Schema at `prisma/schema.prisma`. Database file: `dev.db` (project root).

### Content Storage
`IContentRepository` interface abstracts blog post storage. `PrismaContentRepository` uses Prisma + SQLite.

### Authentication
Google OAuth for admin panel only. `IAuthProvider` interface abstracts OAuth. Requires env vars:
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REDIRECT_URI`

### Adapter Interfaces
All external dependencies behind interfaces:
- `IDatabase` — query execution, transactions
- `IContentRepository` — CRUD for blog posts
- `IAuthProvider` — authentication flow
- `IStorageProvider` — file/blob storage

### Blog System
MDX editor with tabbed write/preview. Admin panel gated by Google OAuth session cookie.

## Workflow

User is product owner. Consult every architectural decision before implementation. Do not proceed without alignment.
