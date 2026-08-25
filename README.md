# ResumeAI

AI-powered resume analysis SaaS. Upload a resume, paste a job description, and get a structured match score with strengths, gaps, and improvement suggestions.

**Live:** [resumeai-rouge.vercel.app](https://resumeai-rouge.vercel.app)

## What it does

Job seekers have no fast way to see how well their resume actually matches a specific job description before applying. ResumeAI extracts text from an uploaded PDF resume, sends it alongside the job description to an LLM for analysis, and returns a structured result the user can save and revisit later.

## Features

- PDF resume upload with server-side text extraction
- AI-powered match analysis against a pasted job description
- Email/password and Google OAuth authentication
- Dashboard with account stats
- Analysis history with detail and delete views
- User profile and account settings

## Tech Stack

**Frontend:** Next.js 16, TypeScript, Tailwind CSS v4, shadcn/ui
**Backend:** Next.js Server Actions
**Database:** PostgreSQL (Neon), Prisma
**Auth:** NextAuth v5 — email/password credentials and Google OAuth
**AI:** Groq, running Llama 3.3 70B
**File processing:** PDF upload, server-side text extraction via `unpdf`

## Architecture Notes

The app has no separate REST API layer — all mutations and data fetching go through Next.js Server Actions, which keeps credentials (database URL, Groq API key, OAuth secret) server-side by construction rather than by convention.

Authorization is enforced at the query level: every database read/write is scoped to the authenticated user's session ID, so one user's analyses, history, and profile data aren't reachable by another. Cascading deletes are configured in the Prisma schema, so removing an account or an analysis cleans up its related records rather than leaving orphaned rows.

## Deployment

Deployed on Vercel, auto-deploying from this repository's `main` branch.
