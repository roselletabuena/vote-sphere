---
name: "code-review"
description: "Agent-driven pre-commit code review loop. Checks the staged diff against VoteSphere conventions, the Constitution, test coverage, security, and correctness. Always run before git commit."
metadata:
  author: "VoteSphere Engineering Team"
  version: "1.0.0"
---

# Pre-Commit Code Review

A rigorous, agent-driven code review that runs before every `git commit`. Reviews the staged diff through 5 lenses: correctness, constitution, conventions, test coverage, and security. Produces a structured verdict with exact fix guidance.

**This is the last gate before committing.** Run `/skill:constitution-check` first to fix violations, then run this for the full review.

## User Input

```text
$ARGUMENTS
```

Optional: `--staged` (default), `--head` (diff vs HEAD), or a specific file path.

---

## Execution Steps

### Step 1 — Capture the diff

1. Run `git diff --staged` to get the current staged changeset.
   - If output is empty: "No staged changes found. Stage your changes with `git add` first."
   - If `$ARGUMENTS` is `--head`: use `git diff HEAD` instead.
   - If `$ARGUMENTS` is a file path: use `git diff HEAD -- <path>`.

2. Parse the diff to extract:
   - **Changed files** — list of file paths modified
   - **Added lines** — new code introduced
   - **Removed lines** — code deleted
   - **File types** — `.ts`, `.tsx`, `.prisma`, `.md`, `.json`, `.mjs`

3. Load review context:
   - `AGENTS.md` — coding conventions (naming, exports, import order, state rules)
   - `.specify/memory/constitution.md` — principles §I–§VI
   - `.specify/feature.json` → load `<feature_directory>/plan.md` if it exists
   - `.specify/feature.json` → load `<feature_directory>/spec.md` if it exists

---

### Step 2 — Run the 5-lens review

Run all 5 lenses in parallel. Collect findings before printing.

---

#### Lens 1: Correctness

Look for logic errors and runtime hazards in the added lines:

| Pattern                                                                    | Issue                      | Severity |
| -------------------------------------------------------------------------- | -------------------------- | -------- |
| `array[0]` without length check                                            | Potential undefined access | ⚠️ WARN  |
| `parseInt()` without radix                                                 | Octal/decimal ambiguity    | ⚠️ WARN  |
| `== null` instead of `=== null`                                            | Loose equality             | ⚠️ WARN  |
| Async function not `await`-ed in call site                                 | Silent promise drop        | 🔴 BUG   |
| `catch` block is empty `{}`                                                | Swallowed error            | ⚠️ WARN  |
| `catch (e)` with `e` unused                                                | Error details lost         | ⚠️ WARN  |
| State mutation inside render (e.g., `useState` setter called at top level) | React infinite loop        | 🔴 BUG   |
| `useEffect` with missing dependency                                        | Stale closure              | ⚠️ WARN  |
| Off-by-one in array slice or comparison                                    | Logic error                | ⚠️ WARN  |
| Date arithmetic without timezone awareness                                 | Timezone bug               | ⚠️ WARN  |

Also check **against the spec** (if `spec.md` loaded):

- Do the changed files implement behavior described in the spec?
- Are there requirements in the spec that the code appears to contradict?

---

#### Lens 2: Constitution

Delegate to the same checks defined in `/skill:constitution-check`:

- §I: No `any`, no `!` assertions
- §II: RSC defaults, Suspense boundaries, no `"use client"` in API routes
- §III: No server data in Zustand, URL state via `nuqs`
- §IV: Auth guard before mutations, no raw `process.env`
- §V: Named exports only, feature colocation
- §VI: Tests exist for new hooks and utils

Report findings under the Lens 2 section — do NOT re-run the full constitution check as a separate command; perform the checks inline against the diff.

---

#### Lens 3: Conventions (AGENTS.md)

| Check              | Rule from AGENTS.md                                                                                                      |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| File naming        | Dirs: `kebab-case` • Components: `PascalCase.tsx` • Hooks: `use-kebab.ts` • Utils: `kebab.ts` • Stores: `kebab-store.ts` |
| Import order       | 1. Node builtins 2. External packages 3. Internal `@/` 4. Relative 5. `import type`                                      |
| No `console.log`   | Use `console.warn` or `console.error` only                                                                               |
| `import type`      | Type-only imports must use `import type { ... }`                                                                         |
| No default exports | Except `page.tsx` and `layout.tsx`                                                                                       |
| Route Handlers     | Must return `ApiResponse<T>` using `apiSuccess()` / `apiError()` from `src/lib/api/response.ts`                          |
| DB access          | Must use the Prisma singleton from `src/lib/db.ts` — never `new PrismaClient()`                                          |

---

#### Lens 4: Test Coverage

For every new file added in the diff:

| File location                         | Expected test                        |
| ------------------------------------- | ------------------------------------ |
| `src/features/*/hooks/use-*.ts`       | `tests/unit/<feature>/use-*.test.ts` |
| `src/features/*/utils/*.ts`           | `tests/unit/<feature>/*.test.ts`     |
| `src/lib/validations/*.ts`            | `tests/unit/validations/*.test.ts`   |
| `src/app/api/*/route.ts` (with logic) | `tests/unit/api/*.test.ts`           |

For existing files modified in the diff:

- Check if the changed logic paths have test coverage (look for test file in the corresponding `tests/unit/` path)
- If tests exist: `✅ Tests present`
- If no tests and the change is non-trivial logic: `⚠️ Tests recommended`

Also, if test files are part of the diff themselves:

- Verify tests use `describe`/`it` / `test` (Vitest conventions)
- Flag any `it.only()` or `test.only()` — these must not be committed

---

#### Lens 5: Security

| Check                                                                                                  | Severity |
| ------------------------------------------------------------------------------------------------------ | -------- |
| Hardcoded secrets (API keys, tokens, passwords — look for long alphanumeric strings assigned to const) | 🔴 BLOCK |
| `.env*` file in the diff                                                                               | 🔴 BLOCK |
| SQL string interpolation (template literal with user input into a query string)                        | 🔴 BLOCK |
| Missing auth guard before DB mutation in Route Handler or Server Action                                | 🔴 BLOCK |
| `dangerouslySetInnerHTML` without sanitization                                                         | 🔴 BLOCK |
| User-controlled input used directly in `href` or `src` (XSS / open redirect)                           | ⚠️ WARN  |
| Missing rate limiting on public POST endpoints                                                         | ⚠️ WARN  |
| Logging of sensitive data (password, token, session)                                                   | ⚠️ WARN  |

---

### Step 3 — Print the structured review report

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 CODE REVIEW — VoteSphere Pre-Commit Gate
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Files reviewed: 4 changed  |  +82 lines  -14 lines
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

 Lens 1 — Correctness        ✅ PASS
 Lens 2 — Constitution       ⚠️ 1 warning
 Lens 3 — Conventions        ✅ PASS
 Lens 4 — Test Coverage      ⚠️ 1 warning
 Lens 5 — Security           ✅ PASS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WARNINGS

⚠️ [Lens 2 / §VI-1] Missing unit tests
   src/features/events/utils/derive-event-state.ts is new with business logic.
   Add: tests/unit/events/derive-event-state.test.ts

⚠️ [Lens 4] Test file has `it.only()`
   tests/unit/events/event-countdown.test.ts:18
   Remove `.only()` before committing — it prevents other tests from running in CI.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VERDICT: ⚠️ WARNINGS ONLY — Commit is allowed.
         Review the warnings above before proceeding.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### Step 4 — Suggest the commit message

After a passing review (no `🔴 BLOCK`), generate a Conventional Commit message suggestion based on the diff:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 SUGGESTED COMMIT MESSAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  feat(events): add operational window state derivation

  - Adds `deriveEventState()` util based on server timestamp
  - Adds `useEventCountdown` hook with optimistic state flip
  - Adds `EventAuditLog` write on auto-close

  git commit -m "feat(events): add operational window state derivation"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Apply commit message rules from `/skill:atomic-commit`:

- Imperative mood, lowercase after colon, no trailing period, under 72 chars
- Scope derived from the primary feature directory touched (`events`, `auth`, `db`, `ui`, etc.)

---

### Step 5 — On blockers: halt

If any `🔴 BLOCK` finding exists:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VERDICT: 🔴 BLOCKED — Do NOT commit.

  Fix all 🔴 BLOCK issues above, then re-run:
  /skill:code-review

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Do not suggest a commit message when blocked.

---

## Done When

- [ ] Diff captured and parsed (staged or specified scope)
- [ ] Context loaded (AGENTS.md, constitution.md, plan.md, spec.md)
- [ ] All 5 lenses executed
- [ ] Structured report printed with findings per lens
- [ ] Overall verdict (`✅ PASS` / `⚠️ WARNINGS` / `🔴 BLOCKED`) delivered
- [ ] Commit message suggested (if not blocked)
- [ ] User directed to next step (fix and re-review, or commit)
