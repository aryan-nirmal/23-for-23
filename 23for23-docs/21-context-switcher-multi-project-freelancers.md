# Context Switcher for Multi-Project Freelancers

## MRD

### Executive Summary
Context Switcher for Multi-Project Freelancers is a Chrome-first productivity tool that saves and restores a project's working context: tabs, notes, and checklist state. It addresses an overlooked operational cost for freelancers and developers juggling several clients: each switch requires mentally reconstructing the right browser state and task context. Existing tab managers save tabs, but not enough context to make project re-entry instant.

### Target Market
Primary persona: freelancer handling 3-8 client projects
- browser-heavy workflow
- loses time rebuilding context

Primary persona: consultant or PM across multiple workspaces
- uses many tabs, docs, and notes per project

Secondary persona: developer wanting a lightweight project-state switcher

### Market Size
- TAM estimate: millions of independent professionals working across multiple concurrent projects.
- SAM estimate: 500,000 browser-heavy freelancers and consultants likely to try a Chrome productivity extension.
- SOM estimate: 15,000 active installs and 2,000 paid upgrades in 3 years.

### Problem Statement
The time lost in context switching is not just tab management; it is tab recovery plus remembering what mattered. Existing products capture one piece of the workflow. The gap is a saved "project state" primitive that bundles URLs, notes, and tasks into one-click restore.

### Competitive Landscape
| Competitor | Pricing | Strengths | Weaknesses |
| --- | --- | --- | --- |
| Toby / tab managers | known browser productivity tools | strong tab grouping | limited note/checklist context |
| OneTab | simple tab saving | lightweight and cheap | minimal metadata and restore context |
| Notion + manual tab groups | flexible | customizable | manual and slow to maintain |

### Differentiation Strategy
- project state, not just tab state
- fast save/restore with notes and checklist
- cloud sync as a paid upgrade path
- freelancer-specific positioning

### Business Model
- Free Chrome extension with up to 5 saved contexts
- Pro at $4/month for unlimited projects and cloud sync
- Team variant later for agencies

### Go-to-Market Strategy
- Chrome Web Store launch
- productivity creator demos
- direct appeal to freelancer and consultant communities

## PRD

### Purpose and Vision
Vision statement: make switching between client projects take seconds, not fifteen minutes.

The product captures the minimum context needed to resume work: relevant tabs, a short note, and an actionable checklist.

### Target Audience
Persona 1: Elena, freelance product designer
- Goals: move between clients quickly
- Frustrations: has to reopen tabs and remember where she left off
- Day-in-the-life: alternates between Figma, docs, and client dashboards across several projects

Persona 2: Varun, web developer with five active clients
- Goals: reduce context-loss mistakes
- Frustrations: browser tab managers do not preserve notes
- Day-in-the-life: jumps between repos, CMS tabs, and issue trackers

### Feature List
- Must-have: save current tab group as project state
- Must-have: attach text note
- Must-have: attach checklist
- Must-have: restore tabs in one click
- Must-have: edit and rename project states
- Must-have: local persistence
- Should-have: keyboard shortcut overlay
- Could-have: cloud sync and desktop app companion
- Won't-have for v1: full VS Code or terminal integration

### User Stories
1. As a freelancer, I want to save my current browser tabs as a named project.
2. As a freelancer, I want to attach a note so that I remember what to do next.
3. As a user, I want a checklist so that task context returns too.
4. As a user, I want to restore all project tabs at once.
5. As a user, I want to rename or update a saved project.
6. As a user, I want data saved locally without account creation.
7. As a power user, I want keyboard access to the switcher.
8. As a future paid user, I want cloud sync between machines.

### Acceptance Criteria
- current-window tabs save successfully into a named state
- note and checklist persist across browser restarts
- restore opens saved URLs in a new tab group or window
- deleting a state removes local storage record
- shortcut opens switcher overlay when extension is enabled

### User Flow
1. User installs extension
2. Clicks save current context
3. Names project and adds note/checklist
4. Later opens extension and selects project
5. Tabs restore and context note appears

### Non-Functional Requirements
- restore under 5 seconds for typical projects
- no unnecessary permission scope beyond tabs and storage
- no remote data transfer in free tier
- clear privacy messaging

### Constraints and Dependencies
- Chrome extension permission review
- DOM context beyond tabs is out of scope in v1
- store listing trust and privacy messaging are important

## TRD

### System Architecture
Chrome extension with popup UI, background service worker, and optional sync service later. Local storage holds project states. Restore flow opens tabs and shows current note/checklist in the popup or side panel.

### Technology Stack
| Layer | Recommendation | Justification |
| --- | --- | --- |
| Extension UI | React + TypeScript | maintainable popup/options UI |
| Platform | Chrome Extension Manifest V3 | modern extension standard |
| Storage | chrome.storage.local | native local persistence |
| Optional sync | small backend later | paid upgrade path |

### API Design
Internal extension APIs/events rather than public HTTP are primary.

| Method | Path/Event | Request | Response | Auth |
| --- | --- | --- | --- | --- |
| internal | `saveProjectState` | name, tabs, note, checklist | state id | Local |
| internal | `restoreProjectState` | state id | restore result | Local |
| internal | `listProjectStates` | none | state list | Local |
| internal | `deleteProjectState` | state id | success | Local |
| internal | `updateProjectState` | state id, fields | updated state | Local |
| internal | `openSwitcherOverlay` | shortcut trigger | UI open | Local |

### Data Models
| Store | Fields | Notes |
| --- | --- | --- |
| `project_states` | id, name, urls[], note, checklist[], updated_at | stored in local extension storage |

### Third-Party Integrations
- none for free tier
- optional account sync API later

### Security Architecture
- local-only default storage
- minimal permissions
- no tab content capture beyond URL/title metadata
- transparent privacy policy

### Infrastructure and DevOps
- extension build/release workflow
- automated testing on save/restore behavior
- Chrome Web Store packaging and versioning

### Scalability Plan
Local extension scale is not infrastructure-bound. Future cloud sync would require account identity, encrypted sync storage, and conflict resolution while keeping free local-only mode intact.

## Production Requirements

### Required Components
- Stable local storage schema for project states
- Reliable save/restore engine
- Extension permissions and privacy messaging

### Recommended Free Stack
- No backend required for v1
- `chrome.storage.local` for state persistence
- Add `Supabase` only when cloud sync becomes core

### Production Notes
- A database is not required for local-first MVP
- Keep permissions minimal
- Project-state schema versioning will help with future sync support
