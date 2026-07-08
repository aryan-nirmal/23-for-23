# Zomato Restaurant Intelligence System

## MRD

### Executive Summary
Zomato Restaurant Intelligence System is a data-analysis and ML dashboard project that clusters restaurants and analyzes customer-review sentiment to surface competitive insight. The short-term product is a restaurant-intelligence demonstrator for owners, analysts, or recruiters reviewing data-science work. The project's practical value is in combining clustering, sentiment analysis, and topic extraction into one interactive interface.

### Target Market
Primary persona: data-science student or analyst
- wants a marketable analytics project with visualization

Primary persona: restaurant consultant or local operator
- wants to compare restaurants by rating, pricing, and review themes

Secondary persona: hiring manager evaluating practical ML/dashboard skills

### Market Size
- educational and analytics project first
- adjacent commercial market would include restaurant analytics and local commerce intelligence

### Problem Statement
Restaurant data is abundant, but comparative insight is fragmented. Ratings alone do not reveal why restaurants underperform. The gap is a visual system that groups comparable restaurants and explains review sentiment drivers.

### Competitive Landscape
| Competitor | Pricing | Strengths | Weaknesses |
| --- | --- | --- | --- |
| generic BI dashboards | flexible visualization | broad business use | no restaurant-specific clustering logic |
| Zomato interface itself | rich public listing data | consumer familiarity | not an analytics tool for benchmarking |
| Kaggle notebooks | free | educational examples | limited interactivity and product polish |

### Differentiation Strategy
- combines clustering and sentiment in one app
- restaurant-specific framing and metrics
- clearer visual storytelling than raw notebooks

### Business Model
- primarily a portfolio/demonstration project
- could later become a paid local market-analysis tool for restaurants or investors

### Go-to-Market Strategy
- publish as portfolio dashboard
- write case study around cluster interpretation and review topics

## PRD

### Purpose and Vision
Vision statement: turn restaurant listing and review data into actionable competitive segments and customer-sentiment insight.

The product demonstrates end-to-end analytics value: ingest data, group similar businesses, analyze reviews, and present recommendations visually.

### Target Audience
Persona 1: Tanvi, aspiring data analyst
- Goals: build a dashboard project with business narrative
- Frustrations: most projects stop at static charts
- Day-in-the-life: explores Kaggle datasets and wants a deployable artifact

Persona 2: Raj, restaurant owner
- Goals: understand whether low performance is driven by price, service, or food sentiment
- Frustrations: consumer apps do not benchmark him meaningfully
- Day-in-the-life: tracks ratings but lacks structured review analysis

### Feature List
- Must-have: dataset ingestion and cleaning
- Must-have: clustering dashboard
- Must-have: sentiment analysis on reviews
- Must-have: topic extraction from reviews
- Must-have: restaurant comparison visuals
- Must-have: summary insights per cluster
- Should-have: filter by city/cuisine
- Could-have: recommendation engine for strategic actions
- Won't-have for v1: live Zomato data integrations

### User Stories
1. As an analyst, I want to cluster restaurants by meaningful features.
2. As a user, I want to filter by location and cuisine.
3. As an owner, I want to see sentiment distribution for reviews.
4. As a user, I want top positive and negative topics extracted.
5. As an analyst, I want cluster visualizations that are easy to explain.
6. As a reviewer, I want methodology notes for sentiment model choice.
7. As a maintainer, I want reproducible preprocessing scripts.
8. As a user, I want restaurant-level and cluster-level drilldowns.

### Acceptance Criteria
- cleaned dataset loads into dashboard
- cluster labels and profiles are persisted
- sentiment scores compute for review corpus
- topic extraction returns interpretable themes
- dashboard responds to filters without breaking

### User Flow
1. Maintainer preprocesses dataset
2. Runs clustering and sentiment pipeline
3. Launches dashboard
4. User selects city or cluster
5. Dashboard shows segment profile and top topics

### Non-Functional Requirements
- dashboard loads under 3 seconds for cached data
- notebook-free reproducible scripts
- stable local and hosted execution
- clear data-freshness disclaimer

### Constraints and Dependencies
- public dataset freshness may lag real market
- sentiment quality varies by slang and review language
- not suitable for operational decisions without fresher data

## TRD

### System Architecture
Batch preprocessing pipeline plus dashboard app. Data cleaning, feature engineering, clustering, sentiment scoring, and topic modeling run offline, generating derived tables. Dashboard reads prepared artifacts and renders interactive views.

### Technology Stack
| Layer | Recommendation | Justification |
| --- | --- | --- |
| Data | Python, pandas, scikit-learn | core preprocessing and clustering |
| NLP | NLTK/VADER or transformers-lite | sentiment baseline |
| Topic Modeling | gensim or BERTopic-lite | review theme extraction |
| Dashboard | Plotly Dash or Streamlit | interactive visual delivery |

### API Design
| Method | Path | Request | Response | Auth |
| --- | --- | --- | --- | --- |
| GET | `/api/v1/restaurants` | filters | restaurant list | Internal/Auth |
| GET | `/api/v1/clusters` | none | cluster summaries | Internal/Auth |
| GET | `/api/v1/restaurants/{id}/sentiment` | none | sentiment payload | Internal/Auth |
| GET | `/api/v1/clusters/{id}/topics` | none | topic list | Internal/Auth |
| POST | `/api/v1/rebuild` | config | job id | Internal/Auth |
| GET | `/api/v1/health` | none | status | Public |

### Data Models
| Artifact | Fields | Notes |
| --- | --- | --- |
| `restaurants_clean` | restaurant_id, city, cuisine, rating, price_range, cluster_id | cleaned base table |
| `review_sentiment` | review_id, restaurant_id, score, label | derived review data |
| `cluster_profiles` | cluster_id, centroid_json, size, description | cluster summary |
| `topic_outputs` | cluster_id or restaurant_id, topic_label, keywords_json | extracted themes |

### Third-Party Integrations
- none required for static dataset version
- optional hosted dashboard

### Security Architecture
- no sensitive PII expected in dataset
- admin-only rebuild endpoints if API deployed

### Infrastructure and DevOps
- reproducible data pipeline scripts
- artifact versioning
- dashboard monitoring

### Scalability Plan
At 10x use, cache precomputed views and serve static artifact-backed APIs. Real-time ingestion should remain out of scope until access to fresher data sources exists.

## Production Requirements

### Required Components
- Batch preprocessing pipeline
- Stored derived outputs for clusters, sentiment, and topics
- Interactive dashboard

### Recommended Free Stack
- `Streamlit` or `Plotly Dash`
- Precomputed file artifacts first
- `Supabase` only if the dashboard becomes multi-user or API-backed

### Production Notes
- A database is optional for first release
- Precompute as much as possible to keep hosting cheap
- Make dataset freshness visible in the UI
