# Disease Prediction from Medical Data

## MRD

### Executive Summary
Disease Prediction from Medical Data is an ML screening demo that predicts risk for diabetes, heart disease, and chronic kidney disease from structured clinical features. This is best positioned as a screening-aid prototype and educational project, not a clinical product. The value lies in model quality, explainability, and deployment discipline for a medically sensitive classification use case.

### Target Market
Primary persona: data-science student or ML engineer
- wants a healthcare ML project with more rigor than a notebook

Primary persona: academic reviewer or hiring manager
- wants to see appropriate evaluation and disclaimers

Secondary persona: prototype builder for rural-screening or triage concepts

### Market Size
- portfolio/educational project first
- adjacent future market would sit in clinical decision support and digital screening

### Problem Statement
Many healthcare ML demos oversimplify the medical context and treat classification accuracy alone as success. The gap is a careful implementation emphasizing screening, recall, explainability, and dataset limitations.

### Competitive Landscape
| Competitor | Pricing | Strengths | Weaknesses |
| --- | --- | --- | --- |
| Kaggle disease prediction notebooks | free | accessible references | often weak clinical framing |
| academic toy demos | free | educational value | poor deployment quality |
| enterprise clinical decision support tools | commercial | real-world governance | not comparable to student project scope |

### Differentiation Strategy
- multi-disease structure
- evaluation prioritizes recall and ROC-AUC
- explainability and disclaimer-first design
- deployable Streamlit or API demo

### Business Model
- educational and demonstrator asset, not direct monetization target

### Go-to-Market Strategy
- GitHub, LinkedIn, and portfolio use
- technical write-up on data leakage, recall tradeoffs, and limitations

## PRD

### Purpose and Vision
Vision statement: demonstrate a responsible ML screening workflow for common chronic-disease risk prediction.

The project should show engineering and modeling rigor while avoiding any implication of diagnosis or treatment decision support.

### Target Audience
Persona 1: Farhan, data-science student
- Goals: build a meaningful health ML portfolio project
- Frustrations: generic notebooks do not stand out
- Day-in-the-life: experiments with tabular models and needs a deployable application

Persona 2: Dr. Singh, faculty reviewer
- Goals: evaluate modeling discipline and ethical framing
- Frustrations: students ignore class imbalance and clinical interpretation
- Day-in-the-life: checks whether the project understands screening-risk tradeoffs

### Feature List
- Must-have: per-disease data pipelines
- Must-have: model comparison for SVM, Random Forest, XGBoost
- Must-have: stratified validation
- Must-have: recall- and ROC-AUC-focused evaluation
- Must-have: Streamlit demo for disease-specific inputs
- Must-have: feature contribution display
- Should-have: threshold tuning
- Could-have: calibration plots
- Won't-have for v1: EMR integration or clinical workflow use

### User Stories
1. As a student, I want separate model pipelines per disease.
2. As a reviewer, I want metrics by disease and by model.
3. As a user, I want to input patient values and get a risk category.
4. As a reviewer, I want top contributing features shown.
5. As a maintainer, I want reproducible training runs.
6. As a user, I want low/medium/high screening risk labels.
7. As a reviewer, I want explicit medical disclaimers.
8. As a maintainer, I want serialized models versioned by disease.

### Acceptance Criteria
- each disease dataset preprocesses successfully
- selected models train and save artifacts
- evaluation report includes recall and ROC-AUC
- demo returns score and explanation for valid inputs
- disclaimer shown before and after prediction

### User Flow
1. Maintainer prepares datasets
2. Runs training pipelines
3. Compares performance
4. Chooses promoted model per disease
5. User selects disease and inputs values
6. App returns screening risk and top features

### Non-Functional Requirements
- reproducibility and seed control
- inference under 2 seconds
- validated input ranges to reduce nonsensical entries
- no storage of real medical records in demo mode

### Constraints and Dependencies
- public datasets are population-specific and limited
- model outputs are not diagnoses
- fairness and calibration should be discussed even if not fully optimized

## TRD

### System Architecture
Offline model-training pipeline and online demo app. Separate preprocessing and model artifacts per disease. Streamlit app loads disease-specific model and input schema. Optional FastAPI wrapper can expose prediction endpoints.

### Technology Stack
| Layer | Recommendation | Justification |
| --- | --- | --- |
| ML | Python, pandas, scikit-learn, XGBoost | tabular healthcare baseline stack |
| Explainability | SHAP | interpretable outputs |
| App | Streamlit | fast deployment |
| Tracking | MLflow or local artifacts | reproducibility |

### API Design
| Method | Path | Request | Response | Auth |
| --- | --- | --- | --- | --- |
| POST | `/api/v1/predict/{disease}` | structured feature payload | score, risk band | Internal/Auth |
| GET | `/api/v1/models/{disease}` | none | model metadata | Internal/Auth |
| GET | `/api/v1/metrics/{disease}` | none | metrics report | Internal/Auth |
| POST | `/api/v1/train/{disease}` | config | job id | Internal/Auth |
| GET | `/api/v1/explain/{disease}` | feature payload | contributions | Internal/Auth |
| GET | `/api/v1/health` | none | status | Public |

### Data Models
| Artifact | Fields | Notes |
| --- | --- | --- |
| `datasets` | disease, source_version, preprocessing_notes | dataset registry |
| `training_runs` | disease, model_name, params_json, metrics_json, artifact_path | experiment log |
| `prediction_logs` | disease, input_json, score, risk_band, model_version | optional demo log |

### Third-Party Integrations
- none required for core demo
- optional experiment-tracking store

### Security Architecture
- validate user inputs
- avoid retaining health data by default
- clear non-diagnostic disclaimers

### Infrastructure and DevOps
- pinned environment and reproducible runs
- CI smoke tests for preprocessing and inference
- artifact backup

### Scalability Plan
If used beyond demo traffic, inference can move behind FastAPI and a model server. For sprint scope, a clean local-to-hosted pipeline matters more than high concurrency.

## Production Requirements

### Required Components
- Per-disease preprocessing and training pipelines
- Saved model artifacts and metrics
- Inference UI with explanation outputs

### Recommended Free Stack
- `Streamlit` for demo app
- File-based artifacts first
- `Supabase` only if you want shared run logs or hosted inference metadata

### Production Notes
- A database is optional for v1
- Clear risk-band definitions should be documented
- Keep all outputs framed as screening aid only
