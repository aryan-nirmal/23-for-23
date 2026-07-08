# Lecture to Notes Converter

## MRD

### Executive Summary
Lecture to Notes Converter addresses a clear workflow gap in student productivity: turning long-form lecture recordings into study-ready notes and flashcards fast enough to matter. UNESCO reports around 264 million students are enrolled in higher education globally, and India's Ministry of Education reported nearly 4.33 crore students enrolled in higher education in 2021-22, creating a very large base of learners who routinely consume spoken academic content.[^unesco-he][^aishe] Existing tools such as Otter focus on transcription and meeting notes, while study tools such as Knowt and TurboLearn focus on revision after notes already exist. The opportunity is a student-priced product that starts from raw lecture media and ends with structured notes, summary, and flashcards in one pass.

### Target Market
Primary persona: university student in India
- Demographics: 18-24 years old, undergraduate or master's student, studies in English or bilingual environments, budget-sensitive.
- Behaviors: records classes on phone, uses WhatsApp and Google Drive to store files, revises close to exams, often studies from PDFs and slides rather than handwritten notes.
- Goals: reduce post-lecture review time, prepare for exams faster, and avoid missing concepts while listening in class.

Primary persona: international or English-speaking university student
- Demographics: 18-28 years old, studies in higher education in North America, Europe, Southeast Asia, or Australia.
- Behaviors: uses laptops in class, records lectures selectively, already pays for some digital study tools.
- Goals: search lecture content quickly, turn recordings into active-recall material, and improve retention.

Secondary persona: tutoring center or coaching operator
- Demographics: small education business owner, 25-40 years old.
- Behaviors: uploads repeated lecture content, shares notes with batches, wants a low-cost workflow for content repurposing.
- Goals: save educator time and provide premium student materials.

### Market Size
- TAM estimate: 26.4 million globally serviceable users.
Basis: UNESCO reports 264 million higher-education students worldwide.[^unesco-he] Assuming 10% are realistic near-term users of AI note-generation tools because they study in digital-first or English-medium environments, the serviceable product category base is about 26.4 million students. At $5/month, the implied annual TAM is about $1.58 billion. This is an estimate.
- SAM estimate: 4.8 million users.
Basis: combine India and English-language self-serve markets. India alone has about 43.3 million enrolled higher-ed students.[^aishe] Assuming 8% of Indian students and 2 million additional English-speaking users outside India creates a reachable SAM of about 4.8 million. At blended ARPU of $4/month, annualized SAM is about $230 million. This is an estimate.
- SOM estimate: 15,000 paid users in 3 years.
Basis: low-price student SaaS with campus and creator-led distribution can plausibly reach 15,000 paying users if it captures about 0.3% of SAM. At $4.50 blended ARPU, that is about $810,000 ARR. This is an estimate.

### Problem Statement
Students can record lectures, but recordings alone have low utility because they are hard to search, summarize, and revise from. Pure transcription products still leave the student with a wall of text, while flashcard products usually require pre-existing notes or manual input. The market gap is an affordable workflow that converts raw audio or video into structured academic notes, key points, definitions, and exportable flashcards without forcing users into a broad workspace subscription.

### Competitive Landscape
| Competitor | Published pricing | Strengths | Weaknesses |
| --- | --- | --- | --- |
| Otter.ai | Free; Pro $16.99 monthly or $8.49/user/month annual; Business $24/user/month[^otter-pricing] | Best-known transcription brand, strong meeting capture, exports | Meeting-first positioning, expensive for students, not optimized for academic note structure or flashcards |
| Knowt | Free; Ultra $24.99 monthly or $12.49/month annual[^knowt-pricing] | Strong flashcards and student brand, large study content library | Starts from text/notes more naturally than raw long-form lecture audio |
| TurboLearn | Basic $11.9/month yearly; Plus $23.9/month yearly; Pro $63.9/month yearly[^turbolearn-pricing] | Study-oriented workflow, progress tracking, AI study positioning | Higher pricing, broader workspace approach, less focused on low-cost lecture conversion |
| Notion | Free; Plus $10/member/month; Business $20/member/month[^notion-pricing] | Powerful note workspace, known brand, AI capabilities | Not purpose-built for lecture ingestion; requires more manual setup and editing |

### Differentiation Strategy
- Purpose-built academic structure: outputs headings, definitions, examples, and revision bullets instead of generic summaries.
- One-pass workflow: upload lecture file once and receive notes plus flashcards together.
- Student pricing: product must sit materially below meeting-note SaaS pricing.
- Exam utility: outputs should be revision-ready, not just transcription-ready.
- Language roadmap: English first, then Hindi and other regional support where transcription quality is acceptable.

### Business Model
Pricing tiers
- Free: 3 uploads/month, max 30 minutes each, watermark on PDF export.
- Student Pro: $4.99/month, 20 uploads/month, up to 2 hours/file, PDF and Anki CSV export.
- Unlimited: $8.99/month, fair-use unlimited uploads, priority processing, multilingual support as released.
- Educator Pack: $29/month for 5 collaborator seats and shared lecture folders.

Monetization mechanics
- B2C recurring subscription with annual discount.
- Campus ambassadors and referral credits to reduce CAC.
- Optional B2B educator and coaching-center plan for higher-usage cohorts.

Revenue projection
- Month 6: 2,500 MAU, 75 Student Pro, 20 Unlimited, 3 Educator Pack. Projected MRR about $616.
- Month 12: 12,000 MAU, 500 Student Pro, 120 Unlimited, 15 Educator Pack. Projected MRR about $3,173.
These are estimates based on 4-5% paid conversion for an exam-driven student tool.

### Go-to-Market Strategy
Acquisition channels
- Campus ambassador program in India.
- Instagram Reels, YouTube Shorts, and student creator demos showing a lecture turned into notes in real time.
- SEO pages for terms such as "lecture recording to notes" and "AI notes from audio."
- Partnerships with coaching institutes and study communities.

Launch plan
1. Launch no-login upload flow capped at 30 minutes.
2. Test with 20-30 students across engineering, commerce, and medical-prep cohorts.
3. Add PDF and Anki exports after validating note quality.
4. Push exam-season promotion bundles and referral incentives.

First 100 users strategy
- Recruit from engineering and MBA student communities.
- Offer free Pro access to campus ambassadors in exchange for feedback and demo videos.
- Target students already recording lectures but not paying for Otter or Notion AI.

## PRD

### Purpose and Vision
Vision statement: Turn lecture recordings into study-ready notes and flashcards fast enough to use the same day.

The product is designed to reduce the time between attending a lecture and having usable revision material. Students do not want another workspace to organize; they want a simple conversion pipeline that makes lecture content searchable, digestible, and actionable for exam preparation.

### Target Audience
Persona 1: Nisha Patel, second-year engineering student
- Goals: keep up with dense technical lectures, revise faster before exams, avoid rewatching full recordings.
- Frustrations: classes move too fast for complete note-taking, transcripts are too messy, paid apps are expensive.
- Day in the life: Nisha records selected lectures on her phone, uploads slides to Drive, and spends late evenings trying to assemble notes from audio and screenshots before quizzes.

Persona 2: Ben Carter, master's student in business analytics
- Goals: summarize lectures, turn concepts into active recall, search for definitions later.
- Frustrations: meeting-note tools capture text but not study structure; flashcard creation is repetitive.
- Day in the life: Ben attends hybrid classes, downloads lecture recordings from the LMS, and manually turns summaries into flashcards each week.

### Feature List
- Must-have: audio and video upload for MP3, MP4, WAV, and M4A.
- Must-have: transcript generation.
- Must-have: note structuring into headings, key points, definitions, and summary.
- Must-have: automatic flashcard extraction.
- Must-have: PDF notes export.
- Must-have: Anki-compatible CSV export.
- Must-have: processing status and retry handling for long uploads.
- Must-have: file-size and duration limits on free tier.
- Should-have: lecture title and subject tagging.
- Should-have: session history for the current user.
- Should-have: basic language detection.
- Could-have: slide screenshot extraction from video.
- Could-have: collaborative class folders.
- Won't-have for v1: LMS integrations.
- Won't-have for v1: live lecture recording inside the app.
- Won't-have for v1: plagiarism or academic-integrity scoring.

### User Stories
1. As a student, I want to upload a lecture recording so that I can avoid manual transcription.
2. As a student, I want the transcript turned into structured notes so that I can revise quickly.
3. As a student, I want definitions and key concepts highlighted so that I can identify exam-relevant content.
4. As a student, I want flashcards generated automatically so that I can practice active recall.
5. As a student, I want a PDF export so that I can store or print my notes.
6. As a student, I want an Anki CSV export so that I can continue using my preferred revision app.
7. As a user, I want to see processing progress so that I know long uploads are still working.
8. As a platform owner, I want file and usage limits so that transcription costs remain controlled.
9. As a repeat user, I want my uploads labeled by subject so that I can find them later.

### Acceptance Criteria
Upload flow
- Pass if users can upload supported file types up to the plan limit and receive validation errors immediately for unsupported files.
- Fail if unsupported files enter the processing queue.

Transcript generation
- Pass if a transcript is produced for supported files with speaker-agnostic text output and stored against the lecture record.
- Fail if processing completes without transcript availability or explicit error state.

Structured notes
- Pass if output always includes section headings, key points, and summary blocks.
- Fail if the output is returned as an unstructured transcript dump.

Flashcards
- Pass if at least 5 flashcards are generated for files over 10 minutes and exported in question-answer format.
- Fail if flashcards are empty or not exportable.

PDF export
- Pass if notes export as a readable PDF with title, headings, and page breaks.
- Fail if export omits key sections or formatting collapses.

Anki CSV export
- Pass if exported CSV imports into Anki with front and back fields intact.
- Fail if delimiters or field order break import.

Progress status
- Pass if users see `queued`, `processing`, `completed`, or `failed` states.
- Fail if long-running jobs appear frozen with no status.

Usage limits
- Pass if free-tier caps are enforced before expensive processing begins.
- Fail if users can bypass duration and upload count limits.

### User Flow
1. User lands on the homepage and sees a short value proposition and upload CTA.
2. User uploads lecture audio or video.
3. App validates duration, type, and size.
4. Backend starts transcription job and displays progress.
5. Transcript is structured into academic notes.
6. Flashcards are generated from key concepts.
7. User reviews notes in the browser.
8. User exports PDF notes and/or Anki CSV.
9. User returns later to process another lecture or upgrade for higher limits.

### Non-Functional Requirements
- Performance: upload validation under 2 seconds; note display under 1 second after processing completes.
- Processing target: 30-minute file completed in under 5 minutes p50 and under 9 minutes p95.
- Availability: 99.5% monthly uptime for web app and job queue.
- Security: TLS in transit, encrypted object storage for uploaded files, signed download URLs.
- Accessibility: WCAG 2.1 AA on core upload, review, and export flows.
- Privacy: uploaded media auto-deleted after configurable retention window on free tier.

### Constraints and Dependencies
- Technology constraints: transcription costs scale with file length; free usage must be capped tightly.
- Third-party dependencies: speech-to-text provider, LLM provider, PDF generation library, object storage.
- Regulatory constraints: copyright-sensitive course recordings require clear user terms and takedown process.
- Team assumptions: one full-stack engineer, one ML-integrations engineer, one designer, one QA or support generalist.

## TRD

### System Architecture
Use a modular monolith with background processing. The web frontend handles upload, job status, note review, and exports. The backend receives uploads, stores raw files in object storage, creates jobs, and orchestrates transcription and note-generation stages. A worker pulls queued jobs, sends media to the speech-to-text provider, then passes the cleaned transcript and lecture metadata to the LLM summarization layer. PostgreSQL stores users, lectures, transcripts, notes, flashcards, and billing data. Object storage stores raw uploads and generated PDFs. Redis manages job queues and status caching. A monolith is appropriate because MVP complexity is in media processing, not service boundaries; one deployable app plus workers keeps the sprint manageable.

### Technology Stack
| Layer | Recommendation | Justification |
| --- | --- | --- |
| Frontend | Next.js with TypeScript | Good upload UX, SEO landing pages, and fast product iteration |
| Backend | Python FastAPI | Strong ecosystem for media processing, AI orchestration, and PDF/export tooling |
| Queue | Celery with Redis | Mature async processing for long-running transcription jobs |
| Database | PostgreSQL | Reliable relational store for jobs, lectures, notes, and exports |
| Storage | S3-compatible object storage | Cheap large-file storage with signed URL access |
| Transcription | Whisper API or AssemblyAI | High-quality speech-to-text for lecture media |
| LLM summarization | OpenAI Responses API | Strong structured output for notes and flashcards |
| Hosting | Render or Railway for app/worker; managed Postgres and object storage | Low-ops deployment suitable for student SaaS MVP |

### API Design
| Method | Path | Request body | Response schema | Auth |
| --- | --- | --- | --- | --- |
| POST | `/api/v1/uploads` | multipart form with file, `title`, `subject` | `{ "lectureId": "uuid", "status": "uploaded", "durationSeconds": 0 }` | Anonymous or bearer token |
| POST | `/api/v1/lectures/{lectureId}/process` | `{ "languageHint": "string?" }` | `{ "jobId": "uuid", "status": "queued" }` | Anonymous or bearer token |
| GET | `/api/v1/jobs/{jobId}` | None | `{ "jobId": "uuid", "status": "queued|processing|completed|failed", "progress": 0-100 }` | Anonymous or bearer token |
| GET | `/api/v1/lectures/{lectureId}/notes` | None | `{ "lectureId": "uuid", "title": "string", "sections": [{ "heading": "string", "bullets": ["string"] }], "summary": "string" }` | Anonymous or bearer token |
| GET | `/api/v1/lectures/{lectureId}/flashcards` | None | `{ "lectureId": "uuid", "flashcards": [{ "front": "string", "back": "string" }] }` | Anonymous or bearer token |
| POST | `/api/v1/lectures/{lectureId}/export/pdf` | None | `{ "downloadUrl": "string", "expiresAt": "datetime" }` | Anonymous or bearer token |
| POST | `/api/v1/lectures/{lectureId}/export/anki` | None | `{ "downloadUrl": "string", "format": "csv" }` | Anonymous or bearer token |

### Data Models
| Table | Key fields | Notes / relationships |
| --- | --- | --- |
| `users` | `id UUID PK`, `email VARCHAR(255) UNIQUE NULL`, `plan VARCHAR(32)`, `created_at TIMESTAMP` | Optional account model; anonymous uploads can be attached later |
| `lectures` | `id UUID PK`, `user_id UUID FK NULL`, `title VARCHAR(255)`, `subject VARCHAR(128)`, `source_filename TEXT`, `mime_type VARCHAR(64)`, `duration_seconds INT`, `storage_key TEXT`, `created_at TIMESTAMP` | One lecture has one or more processing jobs |
| `processing_jobs` | `id UUID PK`, `lecture_id UUID FK`, `status VARCHAR(16)`, `provider VARCHAR(32)`, `error_message TEXT NULL`, `started_at TIMESTAMP NULL`, `completed_at TIMESTAMP NULL` | Tracks asynchronous processing |
| `transcripts` | `id UUID PK`, `lecture_id UUID FK UNIQUE`, `language_code VARCHAR(16)`, `raw_text TEXT`, `clean_text TEXT`, `created_at TIMESTAMP` | Stores transcript versions |
| `note_documents` | `id UUID PK`, `lecture_id UUID FK UNIQUE`, `outline JSONB`, `summary TEXT`, `key_points JSONB`, `definitions JSONB`, `created_at TIMESTAMP` | Stores structured notes |
| `flashcards` | `id UUID PK`, `lecture_id UUID FK`, `front TEXT`, `back TEXT`, `source_section TEXT`, `created_at TIMESTAMP` | Multiple cards per lecture |
| `export_artifacts` | `id UUID PK`, `lecture_id UUID FK`, `artifact_type VARCHAR(16)`, `storage_key TEXT`, `expires_at TIMESTAMP NULL` | PDF and CSV export files |

### Third-Party Integrations
| Service | Endpoint(s) used | Auth method | Rate limits | Fallback strategy |
| --- | --- | --- | --- | --- |
| Whisper API or speech provider | provider transcription endpoint | Server API key | Provider-plan dependent | Queue retry once, then offer transcript-only or shorter upload recommendation |
| OpenAI Responses API | `POST /v1/responses` | Server API key | Provider-tier dependent | Use smaller context windows and chunk transcript sections if full document generation fails |
| S3-compatible object storage | object upload and signed URL operations | Access key / IAM role | Host-plan dependent | Retain local temp file until storage confirmation; retry on transient failure |
| PDF rendering service or library | Internal render process | None if self-hosted | Self-managed | Allow Markdown/HTML download if PDF render fails |

### Security Architecture
- Authentication: anonymous token for no-login mode; email/passwordless auth for saved histories and paid plans.
- Authorization: lecture records scoped to session or account; signed URLs for file access.
- Encryption: TLS in transit; encrypted object storage and managed database encryption at rest.
- Secret management: all provider secrets stored in host secret manager; no client-side exposure.
- Compliance posture: privacy policy, deletion controls, and copyright complaint workflow; not marketed as a classroom recording authorization bypass.

### Infrastructure and DevOps
- Environments: `dev`, `staging`, and `production` with isolated storage buckets and database schemas.
- CI/CD: GitHub Actions for linting, type checks, integration tests on upload and export flows, and deployment to staging on merge.
- Monitoring: Sentry for exceptions, queue latency alerts, storage failure alerts, and uptime checks on upload and notes endpoints.
- Backups: daily Postgres backups and lifecycle rules for exported artifacts.
- Cost controls: worker autoscaling based on queue length and hard caps on free-tier duration.

### Scalability Plan
At 10x growth, the bottlenecks will be queue throughput, storage costs, and transcript chunk size. Scale by separating transcription and summarization workers, using chunked transcript processing, and moving completed export artifacts to cheaper object storage tiers. Introduce account-based quotas, campus-level promo codes, and educator workspaces only after the single-user flow is stable. If long-form institutional usage grows, add batch-processing queues and precomputed flashcard generation as separate worker pools.

### Sources
[^unesco-he]: UNESCO Higher Education overview, accessed April 19, 2026: https://www.unesco.org/en/higher-education
[^aishe]: Government of India / PIB, AISHE 2021-22 release, January 25, 2024: https://www.pib.gov.in/Pressreleaseshare.aspx?PRID=1999713
[^otter-pricing]: Otter.ai pricing page, accessed April 19, 2026: https://otter.ai/pricing
[^knowt-pricing]: Knowt plans page, accessed April 19, 2026: https://knowt.com/plans
[^turbolearn-pricing]: TurboLearn pricing page, accessed April 19, 2026: https://turbolearn.app/pricing
[^notion-pricing]: Notion pricing page, accessed April 19, 2026: https://www.notion.com/pricing

## Production Requirements

### Required Backend Components
- `Supabase Postgres` for uploads, jobs, transcripts, notes, flashcards, and usage
- `Supabase Storage` for uploaded media and generated exports
- Background job runner for transcription and note generation

### Recommended Free Stack
- `Vercel` for frontend
- `Supabase` for auth, DB, and storage
- `Sentry` and `PostHog` for operational visibility

### Production Notes
- File-retention rules are required to control cost and privacy
- Processing-status tracking is mandatory
- Usage caps should be enforced before expensive transcription starts
