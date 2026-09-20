# Junior Developer Onboarding Guide: VoteSphere, AntiGravity & Spec-Driven Development

> **Confluence Live Version:** [View on Confluence](https://the-three-devsketeers.atlassian.net/wiki/spaces/SD/pages/98465/Junior+Developer+Onboarding+Guide+VoteSphere+AntiGravity+Spec-Driven+Development)  
> **Welcome to the VoteSphere Engineering Team!**  
> This handbook is designed specifically for junior engineers joining our team. Whether you are new to Git, Jira, Confluence, React, Next.js, or cloud infrastructure, this guide will walk you through our tools, our engineering philosophy, and how we work day-to-day.

---

## 1. Welcome & Engineering Philosophy

At VoteSphere, we write production-grade software with clarity, confidence, and precision. You may have experienced coding environments where developers jump straight into source files and guess requirements as they go. **We do not do that here.**

Our engineering practice is founded on two core pillars:

1. **Spec-Driven Development (SDD):**  
   We specify _what_ we are building and _how_ it should work before writing code. Specifications eliminate ambiguity, align product and technical expectations, and prevent wasted effort.
2. **AI-Assisted Engineering with AntiGravity:**  
   You have an intelligent AI pair programmer directly in your development environment. AntiGravity is context-aware—it understands our codebase architecture, reads our specifications, helps formulate implementation plans, suggests type-safe code, and helps you run automated tests.

---

## 2. Tooling Cheat Sheet for Beginners

Here is the quick mental model for the core tools you will encounter:

| Tool                | What It Is                        | How We Use It in VoteSphere                                                                                                                                                           |
| :------------------ | :-------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **GitHub**          | Code repository & version control | Stores all project source code. You will clone the repository, work in feature branches, and submit **Pull Requests (PRs)** for peer review before code is merged.                    |
| **Jira**            | Project & sprint tracking         | Our team to-do board. You will find tasks, read user stories and acceptance criteria, and move tickets through stages: `To Do` &rarr; `In Progress` &rarr; `In Review` &rarr; `Done`. |
| **Confluence**      | Team documentation & wiki         | The single source of truth for technical architecture, onboarding guides, decisions, and meeting notes.                                                                               |
| **AntiGravity**     | AI-native IDE & Agentic assistant | Your primary development environment. AntiGravity assists with planning, coding, reviewing, and debugging while strictly following our project conventions.                           |
| **React & Next.js** | Modern web application framework  | **React** lets us build modular UI components (buttons, cards, dialogs). **Next.js 16** is the framework that provides server-side rendering, routing, and fast API endpoints.        |
| **Terraform**       | Infrastructure as Code (IaC)      | Automates cloud infrastructure provisioning (AWS Cognito, databases, VPCs). _Note: Junior developers will NOT need to modify Terraform in their first month._                         |

---

## 3. Spec-Driven Development (SDD) Explained

### The Golden Rule

> **Specification &rarr; Plan &rarr; Tasks &rarr; Code &rarr; Verification**  
> Never write implementation code without an approved specification and plan.

In VoteSphere, every feature resides in the `specs/` directory (for example: `specs/001-event-operational-window/`):

### The 3 Stages of SDD

1. **The Specification (`spec.md`)**:
   - Describes **what** the feature is from the user's perspective.
   - Defines user stories, business rules, acceptance criteria, and edge cases.
   - Contains no implementation details (no React code or SQL queries yet).

2. **The Implementation Plan (`plan.md`)**:
   - Describes **how** we will build it technically.
   - Identifies which Next.js pages, Server Components, Client Components, or Prisma schemas need to be touched.
   - Verifies compliance with the **VoteSphere Constitution** (located at `.specify/memory/constitution.md`).

3. **The Task Checklist (`tasks.md`)**:
   - Breaks the implementation plan into discrete, bite-sized tasks.
   - Each task is clear and actionable (e.g., `Add Zod validation schema for poll duration`, `Create CountdownTimer component`).
   - You check off tasks as you finish them.

### How You Pair-Program with AntiGravity

- **Context Awareness:** AntiGravity automatically reads `AGENTS.md` and `constitution.md`. It already knows our naming rules, TypeScript standards, and library choices.
- **Planning Mode:** When you pick up a task, AntiGravity helps you research the codebase and outline your proposed changes before modifying any code.
- **Step-by-Step Execution:** AntiGravity writes code with you, explains architectural choices, and ensures you follow clean coding patterns.
- **Automated Verification:** AntiGravity runs type checks and unit tests to ensure zero regressions before you submit your pull request.

---

## 4. Day 1: Local Environment Setup Checklist

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

  Open [http://localhost:3000](http://localhost:3000) in your browser. You should see the VoteSphere home screen!

- [ ] **Step 6: Run Quality Checks**
      Confirm that your local environment passes all checks:
  ```bash
  npm run typecheck    # TypeScript strict check
  npm run lint         # ESLint check
  npm run test:unit    # Vitest unit test suite
  ```

---

## 5. Day-to-Day Workflow: From Jira Ticket to Merged PR

Whenever you work on a task, follow this standard lifecycle:

```
[1. Jira Ticket] ──> [2. Git Branch] ──> [3. Review Spec with AntiGravity]
         │
         └──> [4. Implement Code] ──> [5. Automated Tests] ──> [6. Pull Request]
```

1. **Select a Ticket in Jira:**
   - Look for issues labeled `good-first-issue`.
   - Read the user story and acceptance criteria carefully.
   - Assign the ticket to yourself and change its status to **In Progress**.

2. **Create a Git Branch:**
   - Keep branch names descriptive and link your Jira issue key:
     ```bash
     git checkout main
     git pull origin main
     git checkout -b feature/VS-101-poll-card-badge
     ```

3. **Consult the Feature Spec with AntiGravity:**
   - Review `specs/<feature>/spec.md` and `tasks.md`.
   - Ask AntiGravity to explain the task requirements or relevant components.

4. **Implement the Code:**
   - Write clean, modular code following our feature colocation rules (`src/features/<feature-name>/`).
   - Use Shadcn UI primitives (`src/components/ui/`) whenever possible.

5. **Test and Format:**
   - Run unit tests: `npm run test:unit`.
   - Pre-commit hooks (Husky) will automatically check formatting and linting.

6. **Submit a Pull Request (PR) on GitHub:**
   - Push your branch: `git push origin feature/VS-101-poll-card-badge`.
   - Open a PR against `main`.
   - Include the Jira ticket link in the PR description and explain what was changed.
   - Request review from your assigned buddy or lead.

7. **Update Jira:**
   - Move the Jira ticket to **Code Review**.
   - Once your PR is approved and merged, move the ticket to **Done**.

---

## 6. Non-Negotiable Rules (VoteSphere Constitution)

All code merged into `main` must adhere to our team Constitution (`.specify/memory/constitution.md`):

1. **Strict Type Safety:**
   - TypeScript strict mode is mandatory.
   - The use of `any` and non-null assertions (`!`) is strictly forbidden.
   - Validate API inputs, URL parameters, and forms with **Zod**.
2. **Server Components by Default:**
   - In Next.js 16 App Router, every component is a React Server Component (RSC) unless marked with `'use client'`.
   - Only add `'use client'` when you need user events (`onClick`, `onChange`) or React state hooks (`useState`, `useEffect`).
3. **Single Source of Truth for Data:**
   - Database operations must go through Prisma (`src/lib/db.ts`).
   - Server data is fetched and cached using TanStack Query. Never mirror server data into global state stores.
   - User authentication state lives in Zustand (`src/stores/auth-store.ts`).
4. **Colocation of Features:**
   - Put feature-specific components, hooks, and types inside `src/features/<feature>/` rather than spreading them across generic folders.

---

## 7. 30-Day Milestone Roadmap for New Juniors

| Week       | Core Focus                          | Objectives & Success Metrics                                                                                                                                                                 |
| :--------- | :---------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Week 1** | **Onboarding & Workflow**           | • Complete local environment setup.<br>• Master basic Git commands (branch, commit, push, PR).<br>• Navigate Jira and Confluence.<br>• Ship first minor ticket (UI tweak or copy update).    |
| **Week 2** | **React & Spec-Driven Development** | • Learn React components, props, and state.<br>• Learn how to read `spec.md` and complete tasks from `tasks.md`.<br>• Pair-program with AntiGravity to build a new UI component.             |
| **Week 3** | **Next.js & Data Flow**             | • Understand Server Components vs. Client Components.<br>• Learn data querying with TanStack Query.<br>• Write unit tests using Vitest.                                                      |
| **Week 4** | **Independence & Code Reviews**     | • Deliver a feature task from specification to merged PR.<br>• Review peer PRs and participate in sprint planning.<br>• Learn high-level overview of our cloud and Terraform infrastructure. |

---

## 8. Communication & How to Get Help

> **The 20-Minute Rule:**  
> If you are stuck on an issue for more than 20 minutes after attempting to research it and consulting AntiGravity, reach out for help! Asking questions is expected and welcomed.

- **Team Chat / Slack:** `#team-votesphere` (team announcements and daily work).
- **Technical Q&A:** `#dev-help` (ask any coding or setup questions here).
- **Daily Standup:** Monday–Friday at 11:00 PM (share progress, today's plan, and blockers).
- **Mentorship:** Your assigned buddy is available for daily 1-on-1 pairing sessions.
