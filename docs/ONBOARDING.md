# Junior Developer Onboarding Guide: Electa, AntiGravity & Spec-Driven Development

> **Confluence Live Version:** [View on Confluence](https://the-three-devsketeers.atlassian.net/wiki/spaces/SD/pages/98465/Junior+Developer+Onboarding+Guide+Electa+AntiGravity+Spec-Driven+Development)  
> **Jira Epics:**
>
> - [VS-5: Junior Developer Onboarding & Engineering Enablement](https://the-three-devsketeers.atlassian.net/browse/VS-5)
> - [VS-10: Database Infrastructure & Supabase Integration](https://the-three-devsketeers.atlassian.net/browse/VS-10)
>
> **Welcome to the Electa Engineering Team!**  
> This handbook is designed specifically for junior engineers joining our team. Whether you are new to Git, Jira, Confluence, React, Next.js, or cloud infrastructure, this guide will walk you through our tools, our engineering philosophy, and how we work day-to-day.

---

## 1. Welcome & Engineering Philosophy

At Electa, we write production-grade software with clarity, confidence, and precision. You may have experienced coding environments where developers jump straight into source files and guess requirements as they go. **We do not do that here.**

Our engineering practice is founded on three core pillars:

1. **Spec-Driven Development (SDD):**  
   We specify _what_ we are building and _how_ it should work before writing code. Specifications eliminate ambiguity, align product and technical expectations, and prevent wasted effort.
2. **AI-Assisted Engineering with AntiGravity:**  
   You have an intelligent AI pair programmer directly in your development environment. AntiGravity is context-aware—it understands our codebase architecture, reads our specifications, helps formulate implementation plans, suggests type-safe code, and helps you run automated tests.
3. **Codebase Knowledge Graphing with Graphify:**  
   Instead of getting lost reading thousands of unfamiliar code files, we use **Graphify** to generate a queryable AST knowledge graph. This lets both you and AntiGravity map component hierarchies, track import dependencies, and trace database relationships visually and structurally.

---

## 2. Tooling Cheat Sheet for Beginners

Here is the quick mental model for the core tools you will encounter:

| Tool                      | What It Is                            | How We Use It in Electa                                                                                                                                                               |
| :------------------------ | :------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Git & GitHub**          | Code repository & version control     | Stores all project source code. You will clone the repository, work in feature branches, and submit **Pull Requests (PRs)** for peer review before code is merged.                    |
| **Jira**                  | Project & sprint tracking             | Our team to-do board. You will find tasks, read user stories and acceptance criteria, and move tickets through stages: `To Do` &rarr; `In Progress` &rarr; `In Review` &rarr; `Done`. |
| **Confluence**            | Team documentation & wiki (this site) | The single source of truth for technical architecture, onboarding guides, decisions, and meeting notes.                                                                               |
| **AntiGravity**           | AI-native IDE & Agentic assistant     | Your primary development environment. AntiGravity assists with planning, coding, reviewing, and debugging while strictly following our project conventions.                           |
| **Graphify**              | Codebase Knowledge Graph Generator    | Parses code using tree-sitter AST to build an architectural knowledge graph of files, components, and functions.                                                                      |
| **React & Next.js**       | Modern web application framework      | **React** lets us build modular UI components (buttons, cards, dialogs). **Next.js 16** is the framework that provides server-side rendering, routing, and fast API endpoints.        |
| **Supabase (PostgreSQL)** | Modern cloud database platform        | Powers our PostgreSQL database, connected through Prisma ORM.                                                                                                                         |
| **Terraform**             | Infrastructure as Code (IaC)          | Automates cloud infrastructure provisioning (AWS Cognito, databases, VPCs). _Note: Junior developers will NOT need to modify Terraform in their first month._                         |

---

## 3. Your Onboarding & Database Epics in Jira

We have created dedicated epics and tickets on the Jira board for you to practice each tool and build out our database step-by-step:

### 🎓 Epic 1: Team Onboarding & Engineering Enablement (VS-5)

- **[VS-5](https://the-three-devsketeers.atlassian.net/browse/VS-5):** `[EPIC] Junior Developer Onboarding & Engineering Enablement`
  - **[VS-16](https://the-three-devsketeers.atlassian.net/browse/VS-16):** `[ONBOARDING] Git & GitHub Essentials: Branching, Pull Requests & Code Reviews`
  - **[VS-6](https://the-three-devsketeers.atlassian.net/browse/VS-6):** `[ONBOARDING] Jira Fundamentals: Agile Board, Ticket Lifecycles & PR Linking`
  - **[VS-7](https://the-three-devsketeers.atlassian.net/browse/VS-7):** `[ONBOARDING] Confluence Documentation: Team Wiki Navigation & Architecture Reading`
  - **[VS-8](https://the-three-devsketeers.atlassian.net/browse/VS-8):** `[ONBOARDING] Spec-Driven Development (SDD): Lifecycle & AntiGravity Workflow`
  - **[VS-9](https://the-three-devsketeers.atlassian.net/browse/VS-9):** `[SPIKE] Codebase Exploration with Graphify: Generate & Navigate Electa Knowledge Graph`

### 🗄️ Epic 2: Database Infrastructure & Supabase Integration (VS-10)

- **[VS-10](https://the-three-devsketeers.atlassian.net/browse/VS-10):** `[EPIC] Database Infrastructure & Supabase Integration`
  - **[VS-11](https://the-three-devsketeers.atlassian.net/browse/VS-11):** `[SPIKE] Explore Supabase Setup Options (Local Docker CLI vs Cloud Project)`
  - **[VS-12](https://the-three-devsketeers.atlassian.net/browse/VS-12):** `Connect Prisma ORM to Supabase PostgreSQL & Run Initial Migrations`
  - **[VS-13](https://the-three-devsketeers.atlassian.net/browse/VS-13):** `Build Database Seed Script for Mock Polls & Votes`
  - **[VS-14](https://the-three-devsketeers.atlassian.net/browse/VS-14):** `Document Supabase Workflow in Confluence & Update AGENTS.md`

---

## 4. Spec-Driven Development (SDD) & Graphify

### The Golden Rule

> **Specification &rarr; Plan &rarr; Tasks &rarr; Code &rarr; Verification**  
> Never write implementation code without an approved specification and plan.

In Electa, every feature resides in the `specs/` directory (for example: `specs/001-event-operational-window/`):

### The 3 Stages of SDD

1. **The Specification (`spec.md`)**:
   - Describes **what** the feature is from the user's perspective.
   - Defines user stories, business rules, acceptance criteria, and edge cases.
   - Contains no implementation details (no React code or SQL queries yet).

2. **The Implementation Plan (`plan.md`)**:
   - Describes **how** we will build it technically.
   - Identifies which Next.js pages, Server Components, Client Components, or Prisma schemas need to be touched.
   - Verifies compliance with the **Electa Constitution** (located at `.specify/memory/constitution.md`).

3. **The Task Checklist (`tasks.md`)**:
   - Breaks the implementation plan into discrete, bite-sized tasks.
   - Each task is clear and actionable (e.g., `Add Zod validation schema for poll duration`, `Create CountdownTimer component`).
   - You check off tasks as you finish them.

### How Graphify & AntiGravity Supercharge SDD

- **Architectural Discovery:** When planning a feature in `plan.md`, use Graphify to identify which components import the models or state you are touching.
- **Context Awareness:** AntiGravity automatically reads `AGENTS.md`, `constitution.md`, and the Graphify map to ensure accurate code generation.
- **Automated Verification:** AntiGravity runs type checks and unit tests to ensure zero regressions before you submit your pull request.

---

## 5. Day 1: Local Environment Setup Checklist

Follow these steps on your first day to get the application running locally:

- [ ] **Step 1: Install Runtimes & Git**
  - Install **Node.js 20+ LTS** (check with `node -v`).
  - Install **Git** (check with `git -v`).
  - Ensure **AntiGravity IDE** is installed and opened.

- [ ] **Step 2: Clone the Repository**

  ```bash
  git clone <repository-url>
  cd vote-sphere-workspace/vote-sphere
  ```

- [ ] **Step 3: Install Dependencies**

  ```bash
  npm install
  ```

- [ ] **Step 4: Configure Local Environment Variables**
      Copy the example environment file:

  ```bash
  cp .env.example .env.local
  ```

  _(Reach out to your mentor for the local sandbox API credentials for Supabase and AWS Cognito)._

- [ ] **Step 5: Start the Development Server**

  ```bash
  npm run dev
  ```

  Open [http://localhost:3000](http://localhost:3000) in your browser. You should see the Electa home screen!

- [ ] **Step 6: Run Quality Checks**
      Confirm that your local environment passes all checks:
  ```bash
  npm run typecheck    # TypeScript strict check
  npm run lint         # ESLint check
  npm run test:unit    # Vitest unit test suite
  ```

---

## 6. Day-to-Day Workflow: From Jira Ticket to Merged PR

Whenever you work on a task, follow this standard lifecycle:

```
[1. Jira Ticket] ──> [2. Git Branch] ──> [3. Review Spec & Graphify]
         │
         └──> [4. Implement Code] ──> [5. Automated Tests] ──> [6. Pull Request]
```

1. **Select a Ticket in Jira:**
   - Pick your assigned onboarding or database ticket (`VS-6` through `VS-16`).
   - Move the ticket to **In Progress**.
2. **Create a Git Branch:**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/VS-16-git-github-practice
   ```
3. **Consult the Feature Spec with AntiGravity & Graphify:**
   - Review the relevant `spec.md` or feature requirements.
   - Ask AntiGravity to explain requirements or trace components using Graphify.
4. **Implement the Code:**
   - Follow feature colocation rules in `src/features/<feature-name>/`.
   - Use Shadcn UI primitives (`src/components/ui/`).
5. **Test and Format:**
   - Run unit tests: `npm run test:unit`.
   - Pre-commit hooks (Husky) automatically enforce formatting and linting.
6. **Submit a Pull Request (PR) on GitHub:**
   - Push your branch: `git push origin feature/VS-16-git-github-practice`.
   - Include the Jira ticket key (`VS-16`) in the PR title and description.
   - Request a review from your mentor.
7. **Update Jira:**
   - Move the Jira ticket to **In Review**, and upon merge, to **Done**.

---

## 7. Non-Negotiable Rules (Electa Constitution)

All code merged into `main` must adhere to our team Constitution (`.specify/memory/constitution.md`):

1. **Strict Type Safety:** TypeScript strict mode is mandatory. No `any` or `!`. Validate boundaries with **Zod**.
2. **Server Components by Default:** Default to React Server Components (RSC). Only use `'use client'` when state or browser event handlers are required.
3. **Single Source of Truth:** Database operations must go through Prisma (`src/lib/db.ts`). Server data is cached via TanStack Query.
4. **Colocation of Features:** Colocate components, hooks, and types inside `src/features/<feature>/`.

---

## 8. Communication & Getting Help

> **The 20-Minute Rule:**  
> If you are stuck on an issue for more than 20 minutes after attempting to research it and consulting AntiGravity, reach out for help! Asking questions is expected and welcomed.

- **Team Chat / Slack:** `#team-electa`
- **Technical Q&A:** `#dev-help`
- **Daily Standup:** Monday–Friday at 10:00 AM
- **Mentorship:** Your assigned buddy is available for daily 1-on-1 pairing sessions.
