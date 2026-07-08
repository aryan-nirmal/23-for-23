# Credit Scoring Model

## MRD

### Executive Summary
Credit Scoring Model is an ML portfolio project focused on predicting creditworthiness using classical and tree-based models on public datasets. Unlike the other products in the sprint, this is primarily a demonstration and learning asset rather than a commercial SaaS in its MVP form. Its value comes from reproducible modeling, evaluation rigor, and explainability, all of which matter in financial-risk use cases.

### Target Market
Primary persona: student or early-career data scientist building a portfolio
- wants a credible end-to-end ML project

Primary persona: instructor or recruiter evaluating applied ML capability
- wants interpretable model comparison and deployment quality

Secondary persona: fintech prototype team exploring baseline scoring workflows

### Market Size
- This project is best treated as an educational and prototyping asset rather than a standalone software business.
- If commercialized as a toolkit, the addressable market would overlap with fintech analytics and ML education platforms.

### Problem Statement
Credit scoring is a classic applied ML problem, but many student projects stop at a notebook. The gap is a disciplined implementation with data cleaning, model comparison, fairness discussion, explainability, and a simple demo interface.

### Competitive Landscape
| Competitor | Pricing | Strengths | Weaknesses |
| --- | --- | --- | --- |
| Kaggle notebooks | free | abundant examples | quality varies and production rigor is inconsistent |
| DataCamp project templates | subscription | structured learning | less portfolio differentiation |
| open-source credit-risk repos | free | useful references | often weak deployment and documentation |

### Differentiation Strategy
- emphasis on model comparison and interpretability
- reproducible training pipeline
- simple demo app with explanation outputs
- explicit limitations around dataset bias and real-world deployment

### Business Model
- Not a primary monetization product in the sprint.
- Could later be packaged as an educational repository, template kit, or consulting demonstrator.

### Go-to-Market Strategy
- publish as portfolio project
- share on GitHub, LinkedIn, and ML communities
- use as a proof point for data science capability

## PRD

### Purpose and Vision
Vision statement: show a credible, reproducible baseline for credit-risk prediction with explainable outputs.

The product is a demonstrator: it should be good enough for reviewers to trust the engineering discipline, while still remaining honest about dataset limitations and real-world constraints.

### Target Audience
Persona 1: Riya, final-year data science student
- Goals: build a portfolio project that stands out
- Frustrations: many ML projects look like superficial notebooks
- Day-in-the-life: balances coursework with interview prep and wants a deployable project

Persona 2: Marcus, fintech hiring manager
- Goals: see whether a candidate understands modeling tradeoffs
- Frustrations: many candidates overfit and under-explain
- Day-in-the-life: reviews repos for code quality, explainability, and evaluation rigor

### Feature List
- Must-have: dataset loading and cleaning pipeline
- Must-have: train/test split and cross-validation
- Must-have: model comparison across Logistic Regression, Decision Tree, Random Forest, XGBoost
- Must-have: evaluation metrics dashboard
- Must-have: feature importance or SHAP explanations
- Must-have: Streamlit prediction demo
- Should-have: threshold tuning and class-imbalance handling
- Could-have: fairness metrics by subgroup
- Won't-have for v1: production lending integration

### User Stories
1. As a student, I want a reproducible preprocessing pipeline.
2. As a reviewer, I want comparable metrics across models.
3. As a user, I want a demo form to test new inputs.
4. As a reviewer, I want feature importance explanations.
5. As a student, I want hyperparameter tuning tracked.
6. As a user, I want serialized models versioned.
7. As an evaluator, I want ROC-AUC and recall emphasized.
8. As a maintainer, I want experiment outputs logged.

### Acceptance Criteria
- data preprocessing runs from raw dataset to model-ready matrix
- all listed models train successfully with saved metrics
- evaluation report includes confusion matrix, ROC-AUC, precision, recall, F1
- Streamlit app loads selected model and returns prediction probability
- explanation panel displays feature contribution summary

### User Flow
1. Maintainer downloads dataset
2. Runs preprocessing and training pipeline
3. Compares metrics
4. Selects best model
5. Launches Streamlit app
6. Inputs applicant values
7. Receives score and explanation

### Non-Functional Requirements
- deterministic experiments with seed control
- training runtime under practical local-machine constraints
- documented environment and dependency pinning
- clear disclaimer against real credit decisions

### Constraints and Dependencies
- public datasets may not reflect present-day lending behavior
- fairness and regulatory discussions are essential
- model is for education, not production underwriting

## TRD

### System Architecture
Offline ML pipeline plus lightweight Streamlit frontend. Training pipeline handles ingestion, cleaning, feature engineering, training, evaluation, and model artifact persistence. Streamlit app loads the chosen model and returns score plus explanation.

### Technology Stack
| Layer | Recommendation | Justification |
| --- | --- | --- |
| ML | Python, pandas, scikit-learn, XGBoost | standard structured-data stack |
| Explainability | SHAP | model interpretation |
| App | Streamlit | rapid demo deployment |
| Experiment tracking | MLflow or local artifact logging | reproducibility |
| Hosting | Streamlit Community or Render | simple demo hosting |

### API Design
This project can expose internal app endpoints if deployed behind FastAPI.

| Method | Path | Request | Response | Auth |
| --- | --- | --- | --- | --- |
| POST | `/api/v1/predict` | applicant features | score + class | Internal/Auth |
| GET | `/api/v1/models` | none | model list | Internal/Auth |
| GET | `/api/v1/metrics/{model}` | none | metrics payload | Internal/Auth |
| POST | `/api/v1/train` | config | job id | Internal/Auth |
| GET | `/api/v1/explanations` | feature vector | contribution data | Internal/Auth |
| GET | `/api/v1/health` | none | status | Public |

### Data Models
| Artifact | Fields | Notes |
| --- | --- | --- |
| `training_runs` | run_id, dataset_version, params_json, metrics_json | experiment log |
| `model_registry` | model_name, version, artifact_path, promoted | chosen models |
| `prediction_logs` | input_json, score, predicted_class, model_version, created_at | optional demo logging |

### Third-Party Integrations
- optional MLflow
- optional Streamlit hosting
- no external APIs required for core model training

### Security Architecture
- if deployed publicly, sanitize input and limit request volume
- no sensitive real-user financial data stored in demo version
- model artifacts signed or checksummed in CI

### Infrastructure and DevOps
- pinned Python environment
- automated training and tests in CI
- artifact storage for models and metrics

### Scalability Plan
At 10x usage, the main shift is from local demo to API-backed inference service. Batch scoring and monitoring only become necessary if commercialized; for sprint scope, reproducibility and clarity matter more than scale.

## Production Requirements

### Required Components
- Reproducible training pipeline
- Model artifact registry
- Metrics and experiment logging
- Inference UI or API

### Recommended Free Stack
- Local or notebook-based training
- `Streamlit` or `Gradio` for demo UI
- `Supabase` only if shared metadata or run tracking is needed

### Production Notes
- A database is optional for v1
- Artifact versioning is mandatory
- Disclaimer and bounded input validation are required in the demo
