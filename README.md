# NimbusVault

NimbusVault is a private-cloud file storage and collaboration web app built on the Cloudflare stack (Pages, Workers, R2, D1, KV/Durable Objects). It’s designed to be globally fast, secure, and easy to deploy, with team sharing, resumable uploads, versioning, PWA support, and optional advanced privacy modes (BYOK / E2E).

---

## One-line summary
Private-cloud file storage and collaboration running on Cloudflare’s edge platform.

---

## Why this project
Teams and individuals need a fast, secure, globally-distributed file store that supports large files, sync across devices, strong access controls, and enterprise compliance — while minimizing operational overhead by leveraging Cloudflare.

---

## Primary goals
- Provide a reliable, secure file storage web app with team sharing and link sharing.  
- Optimize global performance via Cloudflare’s edge.  
- Support resumable uploads, versioning, and role-based access.  
- Provide an extensible architecture for advanced privacy (BYOK / E2E) and enterprise capabilities.

---

## Success metrics
- Core functionality: users can upload/download files end-to-end (MVP).  
- Reliability: 99.9% uptime for API & Pages.  
- Performance: cached downloads under target latency (example target < 500 ms).  
- Cost/performance: egress and Worker usage kept within target budget.  
- Adoption: DAU/MAU for team users and share-link usage.

---

## High-level architecture
- **Frontend:** Cloudflare Pages (React starter) + PWA.  
- **API & business logic:** Cloudflare Workers (auth, signed URLs, metadata APIs).  
- **Blob storage:** Cloudflare R2.  
- **Metadata:** D1 (SQL) for structured data; Workers KV or Durable Objects for small state or locks.  
- **Optional:** Cloudflare Images / Stream for media processing; Durable Objects for realtime sync/presence.  
- **CDN:** Cloudflare edge caching for downloads/previews.

---

## Project structure (logical)
- `frontend/` — React app scaffolded from Cloudflare + React starter (PWA-ready).  
- `workers/` — Workers endpoints for auth, metadata, signed URLs, share links.  
- `infra/` — scripts/definitions for provisioning R2, D1, KV/Durable Objects (placeholders/notes).  
- `docs/` — PRD, runbooks, playbooks, API docs, onboarding guides.  
- `ci/` — CI/CD configuration for Pages auto-deploy and tests.

---

## Phased implementation plan (short)

### Phase 0 — Planning & scaffolding (1 week)
- Repo from Cloudflare + React starter, CI/CD, env strategy (dev/staging/prod), secrets plan.  
- Provision R2/D1 placeholders.  
**Acceptance:** app deploys to Pages; CI triggered on push.

### Phase 1 — Core auth & teams (1–2 weeks)
- Signup/login, email/OAuth, JWT or secure cookie sessions, refresh tokens.  
- Team/org creation, invite flow, basic profiles.  
**Acceptance:** users can register, login, create a team and invite members.

### Phase 2 — Basic storage (2 weeks)
- Single-file upload to R2, metadata written into D1.  
- File listing (per-user / per-team), download links (public or proxied/private).  
**Acceptance:** uploaded file appears in R2 + D1 and is downloadable.

### Phase 3 — UX polish & sharing (1–2 weeks)
- Nested folders and navigation, previews for images/text/PDF.  
- Shareable links with expiry and optional password.  
- Basic permissions (owner vs invited user).  
**Acceptance:** previews load; share link respects expiry/password.

### Phase 4 — Resumable uploads & dedupe (2–4 weeks)
- Chunked/resumable uploads, upload sessions, content-hash storage for dedupe.  
- Option: Durable Objects to track upload sessions/locks.  
**Acceptance:** interrupted uploads resume; identical content deduped.

### Phase 5 — Security hardening (1–2 weeks)
- Worker-enforced ACLs on all endpoints, signed short-lived URLs for private content.  
- Rate-limiting, Turnstile for bot protection, audit logs, server-side encryption option.  
**Acceptance:** unauthorized access blocked; signed URLs expire; logs present.

### Phase 6 — Versioning & trash (1–2 weeks)
- Immutable file versions (versions stored as new immutable objects), soft-delete (trash), retention and GC job.  
**Acceptance:** version history visible; restore works; GC removes expired items.

### Phase 7 — Real-time sync (2–4 weeks)
- Durable Objects for presence, realtime notifications, sync across clients.  
**Acceptance:** near-real-time updates across connected clients.

### Phase 8 — PWA offline & background sync (2–3 weeks)
- Service Worker for offline caching, queued background uploads, conflict UI.  
**Acceptance:** app usable offline for cached items; queued uploads resume when online.

### Phase 9 — Search & metadata (2–3 weeks)
- Search by filename, tags, metadata; optional server-side indexing for non‑E2E files.  
**Acceptance:** responsive search across typical dataset sizes.

### Phase 10 — Advanced privacy (3–6+ weeks)
- BYOK: server-side envelope encryption with customer KMS.  
- Client-side E2E: zero-knowledge encryption option (client encrypts before upload).  
**Acceptance:** enterprise KMS integration works; E2E files stored ciphertext-only with recovery risk documented.

### Phase 11 — Billing, admin & enterprise (2–4 weeks)
- Quotas, usage reporting, subscription / billing integration (Stripe), admin console.  
**Acceptance:** billing enforces quotas; admin can manage orgs and policies.

### Phase 12 — Ops, backups & scaling (ongoing)
- Offsite backups of metadata and objects, orphan GC, cost monitoring, automated alerts.  
**Acceptance:** backups automated and tested; cost alerts in place.

---

## MVP (must-have)
- Auth & teams (signup, login, create team, invite users).  
- Single-file upload/download to R2 with metadata in D1.  
- Folder/file listing and simple navigation.  
- Shareable links (expiry/password optional).  
- React PWA frontend from Cloudflare starter.

---

## Security & compliance highlights
- Enforce HTTPS and HSTS.  
- Worker-enforced permission checks on every API call.  
- Short-lived signed URLs for private content.  
- Audit logs for admin/auditable actions.  
- Optional BYOK/E2E as opt-in with clear UI warnings and recovery guidance.

---

## Risks & mitigation
- Worker CPU/time limits: keep hashing and heavy compute client-side; stream where possible; offload long tasks.  
- R2 egress costs: cache aggressively at the edge; monitor egress and optimize.  
- BYOK/E2E complexity: phase rollout; begin with managed server-side encryption, then add BYOK, and offer E2E last.  
- Data loss risk for E2E: explicit UI warnings; recommend backup strategies.

---

## Milestones & timeline (suggested 2-week sprints)
- Sprint 0: scaffolding, CI/CD, infra placeholders.  
- Sprint 1–2: Phase 1 (auth & teams).  
- Sprint 3–4: Phase 2 (basic upload/download).  
- Sprint 5: Phase 3 (folders, previews, share links).  
- Sprint 6–8: Phase 4 (resumable uploads & dedupe).  
- Sprint 9: Phase 5 (security hardening).  
- Sprint 10–11: Phase 6 (versioning & trash).  
- Sprint 12–14: Phase 7 (real-time sync).  
- Subsequent sprints: offline, search, advanced privacy, billing, ops.

---

## Immediate next steps (first week)
1. Create repository from Cloudflare + React starter and deploy to Pages.  
2. Provision R2 and D1 test instances (names/placeholders) and add Worker route stubs.  
3. Implement auth endpoints (register/login) and user table in D1.  
4. Build minimal single-file upload flow to R2 and write metadata to D1.  
5. Deploy to staging and validate end-to-end upload and download.

---

## MVP acceptance checklist
- User can register and login.  
- User can create a team and invite at least one member.  
- User can upload a file, see it listed, and download it.  
- User can create a share link and recipient can access via that link.  
- App is deployed to Pages with CI and staging environment configured.

---

## Operational notes & best practices
- Keep heavy compute (hashing, chunking) on client to avoid Worker timeouts.  
- Use content-addressable storage (hash-based keys) from the start to make dedupe & integrity easy.  
- Cache metadata where possible using KV or edge cache to reduce Workers calls.  
- Use Durable Objects for small authoritative objects (locks, presence), not for large datasets.  
- Instrument Workers and R2 usage; export logs to an external log sink for long-term retention.  
- Implement background GC to remove orphaned R2 objects and reclaim space.  
- Plan for backup/restore: schedule periodic exports of metadata and R2 snapshot/exports offsite.

---

## Optional future features (post-MVP)
- Desktop sync client and mobile clients.  
- Collaborative editing with CRDTs for certain file types.  
- Advanced full-text search and content indexing (non-E2E files).  
- Data deduplication across orgs (if privacy allows).  
- Enterprise integrations (SAML/SCIM, on-prem connector, regional storage controls).  
- Advanced analytics and cost dashboards for admins.

---

## Appendix: Who should own what
- **Product:** overall roadmap, success metrics, feature prioritization.  
- **Engineering (Frontend):** React PWA, upload UX, previews, offline sync.  
- **Engineering (Backend/Workers):** auth, signed URLs, metadata APIs, R2 integration.  
- **Security/Infra:** encryption keys strategy, BYOK/KMS integration, audit logging, secrets management.  
- **DevOps:** CI/CD, staging/prod environments, backups, monitoring, cost alerts.  
- **QA:** automated tests for auth, uploads, resume flows, share links, security checks.

