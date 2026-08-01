# Haku - AI-Powered Resume & Job Application Assistant

Frontend for Haku, an AI-powered resume builder and job application assistant, built with Next.js 15 (App Router), React 19, and Tailwind CSS 4.

## Features

- **Authentication**: JWT-based login/register with refresh tokens, email verification, and password reset flows
- **Resume Builder**: Multi-theme resume builder/editor (Classic, Creative, Engineering, Minimal, Modern) with drag-and-drop section reordering (`@dnd-kit`)
- **AI Resume Grading**: Instant resume grading with a visual grade circle and recruiter-style feedback
- **PDF Import**: Transform an uploaded PDF resume into an editable Haku resume
- **Job Application Tracking**: Track applications, statuses, and generate cover letters
- **Credits System**: Usage-based credits for AI features, with a utility guide UI
- **Dashboard**: Overview of resumes, applications, and AI usage
- **Internationalization**: English and Spanish locales via `next-intl`
- **Print View**: Dedicated print-friendly resume rendering

## Tech Stack

- **Framework**: Next.js 15 (App Router, Turbopack)
- **UI**: React 19, Tailwind CSS 4, Radix UI, Headless UI, Heroicons, Lucide
- **Forms/Validation**: React Hook Form + Zod
- **State**: Zustand, React Context (auth)
- **HTTP**: Axios
- **i18n**: next-intl
- **Drag & Drop**: dnd-kit
- **Bot Protection**: Google reCAPTCHA v3
- **Testing**: Vitest + Testing Library (unit), Playwright (e2e/smoke)

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- Backend API (see `NEXT_PUBLIC_API_URL`)

### Installation

```bash
npm install
```

Create a `.env.local` (or `.env`) file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=<your-recaptcha-site-key>
```

Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

- `npm run dev` - Start dev server (Turbopack)
- `npm run build` - Production build
- `npm run start` - Start production server (binds `0.0.0.0:3000`)
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm test` - Run Vitest unit tests
- `npm run test:ui` - Playwright tests in UI mode
- `npm run test:spec` - Run Playwright test specs

## Project Structure

```
src/
├── app/
│   └── [locale]/           # Locale-scoped routes (en/es via next-intl)
│       ├── applications/   # Job application tracking + detail pages
│       ├── dashboard/      # Dashboard overview
│       ├── login/          # Login
│       ├── register/       # Registration
│       ├── forgot-password/ reset-password/ email-verification/ email-verified/
│       ├── print/          # Print-friendly resume view
│       ├── profile/        # User profile & settings
│       ├── resumes/        # Resume list, detail, and builder
│       ├── privacy/ terms/ # Static legal pages
├── components/
│   ├── resume/             # Resume builder, themes, cards, previews
│   ├── ui/                 # Shared UI primitives (Button, Modal, Input, etc.)
│   └── seo/                # SEO-related components
├── contexts/                # React contexts (e.g. auth)
├── i18n/                    # next-intl configuration
├── messages/                 # Translation files (en.json, es.json)
├── lib/
│   ├── store/               # Zustand stores (e.g. useResumeStore)
│   └── utils/                # Helper functions
├── providers/                # App-level providers
├── services/
│   └── credits/              # Credits API/service logic
└── types/                    # Shared TypeScript types

tests/                        # Playwright smoke tests
```

## Environment Variables

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Base URL of the backend API |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Google reCAPTCHA v3 site key |

## Docker

A multi-stage `Dockerfile` (Next.js standalone output) and `docker-compose.yml` are included:

```bash
docker compose up --build
```

The compose file expects an external `haku-network` Docker network and reads `NEXT_PUBLIC_API_URL` / `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` from a `.env` file.

## Testing

- Unit/component tests: `npm test` (Vitest + Testing Library, config in `vitest.config.ts`)
- E2E/smoke tests: `npm run test:spec` (Playwright, config in `playwright.config.ts`, specs in `tests/`)

## License

This project is licensed under the MIT License.
