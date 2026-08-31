# Zora

Zora is an AI-powered learning platform that generates complete courses and quizzes from a single topic prompt. It combines structured course authoring, adaptive quizzing, a chapter-aware AI tutor, and a full admin back office in one Next.js application.

## Features

### Learning

- **AI course generation** — turns a topic, category, level, and audience into a multi-chapter course with explanations, code samples, and an AI-generated banner image.
- **Chapter-level customization** — learners can supply custom instructions per chapter and regenerate content on demand, before or after the course is built.
- **Embedded chapter quizzes** — every chapter ends with a short auto-graded multiple-choice check.
- **Chapter Tutor** — a chat assistant scoped to the current chapter's content, for grounded Q&A while studying.
- **Publish & discover** — courses are private by default; owners can publish/unpublish to list them in Explore, where the community can rate them.

### Quizzing

- **MCQ, open-ended, and mixed quiz types** with configurable difficulty and free-text personalization ("focus on dates", "I'm a beginner", etc.).
- **Answer-matching safeguards** so AI-generated correct answers always align exactly with the presented options.
- **Replay** any past quiz, and review full statistics (accuracy, time taken, per-question breakdown) after finishing.

### Accounts & Administration

- **Email/password and Google sign-in** for learners, powered by Auth.js (NextAuth v5).
- **Separate admin portal** (`/admin/login`) — admin accounts cannot sign in through the regular learner flow.
- **Admin dashboard** for full user management: promote/demote roles, ban/unban, delete accounts.
- **User settings** — edit profile, upload a profile picture, and change/set a password (including for Google-only accounts).

### Platform

- **Generic AI assistant** available anywhere in the app, in addition to the chapter-scoped tutor.
- **Cloudinary-backed uploads** for profile pictures and custom course banners.
- **Server-authorized data access** — all course, quiz, and user data is served through session-checked API routes; no client-side database access.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 15](https://nextjs.org/) (App Router, Turbopack) |
| UI | React 18, Tailwind CSS, [shadcn/ui](https://ui.shadcn.com/) (Radix primitives), lucide-react |
| Auth | [Auth.js / NextAuth v5](https://authjs.dev/) — Credentials + Google OAuth |
| Database | [Neon](https://neon.tech/) (serverless Postgres) via [Drizzle ORM](https://orm.drizzle.team/) |
| AI | [Groq](https://groq.com/) (Llama 3.3) for course, quiz, and chat generation |
| Media | [Cloudinary](https://cloudinary.com/) for image uploads; server-side AI banner generation |
| Video | YouTube Data API for chapter video lookup |

## Getting Started

### Prerequisites

- Node.js 18+
- A [Neon](https://neon.tech/) Postgres database
- API keys for the services listed below

### Installation

```bash
git clone <repository-url>
cd Zora
npm install
```

### Configuration

Copy the example environment file and fill in your credentials:

```bash
cp .env.example .env
```

| Variable | Required | Purpose |
|---|:---:|---|
| `AUTH_SECRET` | ✅ | Session/JWT signing secret. Generate with `openssl rand -base64 32`. |
| `DB_CONNECTION_STRING` | ✅ | Neon Postgres connection string (server-only). |
| `GROQ_API_KEY` | ✅ | Powers course, quiz, and chat generation. [console.groq.com/keys](https://console.groq.com/keys) |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | ✅ | Google sign-in. [console.cloud.google.com](https://console.cloud.google.com/apis/credentials) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` | ✅ | Seeds the initial admin account. |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Recommended | Profile picture and custom banner uploads. [console.cloudinary.com](https://console.cloudinary.com/) |
| `YOUTUBE_API_KEY` | Optional | Enables chapter video lookup. |

For Google sign-in, add these to your OAuth client:
- **Authorized JavaScript origin:** `http://localhost:3000`
- **Authorized redirect URI:** `http://localhost:3000/api/auth/callback/google`

### Database Setup

Push the schema to your database, then seed the first admin account:

```bash
npm run db:push
npm run seed:admin
```

### Run the App

```bash
npm run dev
```

The app is available at [http://localhost:3000](http://localhost:3000). Learners sign in at `/sign-in`; the admin portal is at `/admin/login`.

### Key Routes

- `/dashboard` — personal course library
- `/dashboard/explore` — published community courses
- `/dashboard/quiz` — quiz creation and activity
- `/create-course` — guided AI course builder
- `/admin` — administrator dashboard

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server (Turbopack). |
| `npm run build` | Build for production. |
| `npm run start` | Run the production build. |
| `npm run lint` | Run ESLint. |
| `npm run db:push` | Push the Drizzle schema to the database. |
| `npm run db:studio` | Open Drizzle Studio to inspect the database. |
| `npm run seed:admin` | Create or update the admin account from `.env`. |

## Troubleshooting

- Confirm `.env` contains `DB_CONNECTION_STRING`, `AUTH_SECRET`, and `GROQ_API_KEY` before starting the app.
- Run `npm run db:push` after changing the Drizzle schema.
- If Google sign-in fails locally, verify that the OAuth redirect URI uses port `3000`.

## Project Structure

```
app/
├── (auth)/            # Learner sign-in / sign-up
├── admin/             # Admin portal (login + protected dashboard)
├── api/               # Server routes: auth, courses, quizzes, chat, admin, uploads
├── course/            # Course viewer and chapter learning experience
├── create-course/     # AI course creation flow
├── dashboard/         # Learner dashboard, quiz hub, settings
├── history/           # Quiz history
└── saved-quizzes/     # Saved quiz replay

components/            # Shared UI components (ui/, landing/, auth/, common/)
configs/                # Database, schema, and AI client configuration
lib/                    # Server-side helpers (auth, users, quiz generation, banners)
scripts/                # Operational scripts (admin seeding)
```

## Security Notes

- All database access is mediated through authenticated, ownership-checked API routes — there is no direct client-side database access.
- Secrets (database credentials, API keys) are server-only environment variables and are never bundled into client code.
- Admin authentication is fully separated from learner authentication at both the UI and middleware level.

## License

Proprietary — all rights reserved.
