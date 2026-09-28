\# Cardiose: Complete Engineering Blueprint \& Antigravity Hand-Off Dossier

\*\*Project Name:\*\* Cardiose (Explainable Dual-Disease Risk Screening Platform)  

\*\*Academic Scope:\*\* AI/ML Capstone / Mini-Project (Supervised Multivariate Classification)  

\*\*Deployment Target:\*\* Production Free-Tier (Vercel Frontend + Render Backend + Supabase PostgreSQL)



\---



\## 1. Executive Summary \& Objective



\*\*Cardiose\*\* is an accessible, end-to-end clinical decision support platform designed to screen individuals for \*\*Cardiovascular Disease\*\* and \*\*Diabetes Mellitus\*\* using self-reported symptoms and routine laboratory biometrics\[cite: 1, 2]. 



Unlike conventional academic projects that conclude at binary classification ($0$ or $1$) within an isolated Google Colab notebook, Cardiose establishes a unified, cloud-deployed web interface\[cite: 1]. It passes input features through three mandatory machine learning algorithms, triangulates their probabilities into an intuitive $0\\text{--}100$ Risk Score, isolates aberrant physiological risk drivers ("Why It Was Flagged"), generates actionable dietary/lifestyle recommendations, and logs screenings into a persistent database\[cite: 1, 2].



\---



\## 2. Mandatory Project Constraints \& Algorithms



\### 2.1 The Two Problem Tracks

1\. \*\*Heart Disease Prediction Track:\*\* Screen coronary artery disease presence based on the \*\*UCI Cleveland Dataset\*\* (`processed.cleveland.data`, 303 instances, 14 clinical features)\[cite: 4, 5].

2\. \*\*Diabetes Prediction Track:\*\* Screen diabetic risk based on the \*\*Pima Indians Diabetes Database\*\* (`Pima Indians Diabetes Database.csv`, 768 instances, 8 features + outcome).



\### 2.2 The Three Mandatory Algorithms

Every screening must be scored concurrently across all three algorithms to prevent single-estimator bias:

1\. \*\*Logistic Regression (LR):\*\* Establishes the linear log-odds baseline and calibrated probabilities.

2\. \*\*Random Forest Classifier (RF):\*\* Models complex non-linear feature interactions (e.g., ST-depression interacting with age and resting BP) and supplies split-criterion feature importances\[cite: 1].

3\. \*\*Gaussian Naive Bayes (GNB):\*\* Fast conditional probabilistic likelihood estimator assuming class-conditional feature independence\[cite: 1].



\---



\## 3. Academic Framing \& Literature Context (Viva Defense)



\### 3.1 Five Benchmark IEEE Research Papers

1\. \*\*Mohan et al. (IEEE Access, 2019):\*\* Combined Random Forest with Linear Models on the UCI Cleveland dataset, reporting $88.7\\%$ accuracy. \*Limitation:\* Opaque black-box prediction; fails to explain which biometric features caused the classification\[cite: 1].

2\. \*\*Singh \& Kumar (IEEE ICACCS, 2020):\*\* Benchmarked LR, RF, and NB for heart disease prediction ($85\\%\\text{--}89\\%$ accuracy). \*Limitation:\* Script-based offline execution without a deployable user-facing interface or API\[cite: 1].

3\. \*\*Sisodia \& Sisodia (Procedia CS / IEEE, 2018):\*\* Benchmarked Naive Bayes and Decision Trees on the Pima dataset ($76.3\\%$ accuracy). \*Limitation:\* Used default 0.5 decision cutoffs, ignoring clinical False Negatives (Recall neglect)\[cite: 1].

4\. \*\*Sarwar et al. (IEEE ICAC, 2018):\*\* Applied supervised learning on Pima Diabetes. \*Limitation:\* Provides isolated diagnostic output without post-diagnostic behavioral, dietary, or clinical guidance\[cite: 1].

5\. \*\*Katarya \& Srinivas (IEEE ICESC, 2020):\*\* Surveyed early chronic illness models. \*Limitation:\* Analyzed diabetes and heart disease in complete isolation, ignoring shared metabolic risk markers\[cite: 1].



\### 3.2 Addressed Research Gaps

\* \*\*Gap 1 (Opaque Predictions \& Guidance Void):\*\* Cardiose extracts the specific physiological values driving high-risk predictions and pairs them with metric-targeted lifestyle interventions (DASH diet, low-glycemic guidelines, physician consultation notices)\[cite: 1, 2].

\* \*\*Gap 2 (Disjointed Tools \& Deployment Barrier):\*\* Bridges disparate diagnostic scripts into a single, cohesive, mobile-responsive web gateway\[cite: 1].

\* \*\*Gap 3 (Clinical Sensitivity Optimization):\*\* Optimizes classification decision thresholds for high \*\*Recall (Sensitivity)\*\*, acknowledging that false negatives in medical screening carry severe real-world consequences\[cite: 1].



\---



\## 4. Current Progress: What Has Already Been Done



Do not redo or duplicate these steps; continue directly from this foundation:

1\. \*\*UCI Heart Disease Dataset Cleaned:\*\* Verified `processed.cleveland.data`\[cite: 5]. Columns mapped to standard 14 clinical features from `heart-disease.names` (`age`, `sex`, `cp`, `trestbps`, `chol`, `fbs`, `restecg`, `thalach`, `exang`, `oldpeak`, `slope`, `ca`, `thal`, `target`)\[cite: 4]. Null values in `ca` and `thal` handled, multi-class labels ($1\\text{--}4$) binarized to $1$\[cite: 4, 5].

2\. \*\*Pima Diabetes Dataset Cleaned:\*\* Handled whitespace variations and case headers. Handled biological zero values in `Glucose`, `BloodPressure`, `SkinThickness`, `Insulin`, and `BMI` via median imputation.

3\. \*\*Google Colab Training Completed:\*\* Stratified 80/20 train/test splits performed\[cite: 1]. `StandardScaler` fitted on training sets only\[cite: 1]. Both datasets trained across \*\*Logistic Regression\*\*, \*\*Random Forest\*\* (`n\_estimators=100`, `max\_depth=8`), and \*\*Gaussian Naive Bayes\*\*\[cite: 1].

4\. \*\*Model Artifacts Generated:\*\* Serialized bundles (`heart\_models.joblib` and `diabetes\_models.joblib`) created, each containing `{'lr': model, 'rf': model, 'nb': model, 'scaler': scaler, 'features': list}`.



\---



\## 5. System Architecture \& Component Interactions



┌────────────────────────────────────────────────────────────────────────┐│                        FRONTEND CLIENT (React/Vite)                    ││   • Track Selector: \[Heart Disease Panel] | \[Diabetes Panel]           ││   • Form Validation: Realistic clinical input limits \& unit tooltips   ││   • Animated Output: 0-100 Gauge, Consensus Badges, Evidence Points    │└───────────────────────────────────┬────────────────────────────────────┘│ HTTP POST (JSON Payload)▼┌────────────────────────────────────────────────────────────────────────┐│                       BACKEND API (Python FastAPI)                     ││   • Layer 1: Pydantic Schema Validation (Rejects invalid medical data) ││   • Layer 2: Vectorization \& Scaling via scaler.transform()          ││   • Layer 3: Model Inference: Query LR, RF, NB probabilities (<5ms)    ││   • Layer 4: Clinical Heuristic Engine (Flag AHA/ADA threshold alerts) ││   • Layer 5: Explainer \& Guidance Synthesizer                          │└───────────────────┬────────────────────────────────┬───────────────────┘│                                │Async DB Write  ▼                                ▼  HTTP JSON Response┌───────────────────────────────────┐  ┌─────────────────────────────────┐│     DATABASE (Supabase / PG)      │  │      CLIENT DASHBOARD RENDER    ││  • cardiose\_screening\_history   │  │  • Risk Meter: 78/100 (HIGH)    ││  • Full audit trail \& past scans  │  │  • Model Probabilities:         ││  • User historical trends         │  │     LR: 74%, RF: 82%, NB: 77%   │└───────────────────────────────────┘  │  • Evidence: High BP \& Angina   ││  • Advice: DASH Diet, ECG check │└─────────────────────────────────┘

\---



\## 6. Detailed Technical Specifications



\### 6.1 Strict Free-Tier Architecture Rules

\* \*\*No Heavy Data Libraries in Backend Runtime:\*\* \*\*DO NOT include `pandas`, `matplotlib`, or `seaborn`\*\* in `backend/requirements.txt`. The API must handle inputs purely via `pydantic`, `numpy`, and pre-loaded `scikit-learn`/`joblib` pipelines. This maintains sub-100ms response times and keeps RAM footprint below 100 MB (well under Render's 512 MB free cap).

\* \*\*Decoupled Deployment:\*\*

&#x20; \* \*\*Frontend:\*\* Hosted on \*\*Vercel\*\* (Static edge build, 0 cold starts).

&#x20; \* \*\*Backend API:\*\* Hosted on \*\*Render\*\* (Free Web Service).

&#x20; \* \*\*Database:\*\* Hosted on \*\*Supabase\*\* (Managed PostgreSQL via REST).

\* \*\*Cold-Start Resilience:\*\* The React frontend must include a loading state warning users that free-tier instances may take 30–50 seconds to warm up on the initial request.



\### 6.2 Data Schemas \& API Contracts



\#### Heart Disease POST (`/api/predict/heart`):

\* \*\*Request Payload:\*\*

&#x20; ```json

&#x20; {

&#x20;   "age": 58,

&#x20;   "sex": 1,

&#x20;   "cp": 3,

&#x20;   "trestbps": 145,

&#x20;   "chol": 260,

&#x20;   "fbs": 1,

&#x20;   "restecg": 0,

&#x20;   "thalach": 130,

&#x20;   "exang": 1,

&#x20;   "oldpeak": 2.3,

&#x20;   "slope": 2,

&#x20;   "ca": 1,

&#x20;   "thal": 2

&#x20; }

Response Payload:JSON{

&#x20; "risk\_score": 78,

&#x20; "risk\_level": "HIGH",

&#x20; "consensus": {

&#x20;   "logistic\_regression": 0.74,

&#x20;   "random\_forest": 0.82,

&#x20;   "naive\_bayes": 0.77

&#x20; },

&#x20; "evidence\_points": \[

&#x20;   "Resting blood pressure (145 mmHg) exceeds AHA Stage-2 hypertension guidelines (>140 mmHg).",

&#x20;   "Presence of exercise-induced angina indicates potential coronary ischemia under exertion.",

&#x20;   "Serum cholesterol (260 mg/dL) exceeds optimal cardiovascular levels (<200 mg/dL)."

&#x20; ],

&#x20; "action\_plan": {

&#x20;   "dietary": "Adopt a sodium-restricted DASH dietary pattern (<2,300 mg/day) with high soluble fiber intake.",

&#x20;   "lifestyle": "Limit strenuous exertion until cleared; begin low-impact supervised aerobic walking 30 mins/day.",

&#x20;   "clinical": "Schedule a physician consultation for a formal 12-lead resting ECG and comprehensive lipid profile."

&#x20; }

}

Diabetes POST (/api/predict/diabetes):Request Payload:JSON{

&#x20; "pregnancies": 2,

&#x20; "glucose": 155,

&#x20; "blood\_pressure": 82,

&#x20; "skin\_thickness": 28,

&#x20; "insulin": 140,

&#x20; "bmi": 32.4,

&#x20; "dpf": 0.627,

&#x20; "age": 45

}

Response Payload:JSON{

&#x20; "risk\_score": 71,

&#x20; "risk\_level": "HIGH",

&#x20; "consensus": {

&#x20;   "logistic\_regression": 0.69,

&#x20;   "random\_forest": 0.74,

&#x20;   "naive\_bayes": 0.70

&#x20; },

&#x20; "evidence\_points": \[

&#x20;   "Plasma glucose level (155 mg/dL) exceeds the standard diagnostic threshold for impaired fasting glucose.",

&#x20;   "Body Mass Index (32.4) indicates Class I Obesity, elevating peripheral insulin resistance.",

&#x20;   "Elevated Diabetes Pedigree Function (0.63) reflects a significant hereditary genetic predisposition."

&#x20; ],

&#x20; "action\_plan": {

&#x20;   "dietary": "Shift to complex, low-glycemic index carbohydrates; eliminate refined sugars and sweetened beverages.",

&#x20;   "lifestyle": "Incorporate light 15-minute walks immediately following major meals to lower postprandial glucose spikes.",

&#x20;   "clinical": "Schedule an in-clinic laboratory assessment for a formal glycated hemoglobin (HbA1c) diagnostic test."

&#x20; }

}

6.3 Risk Scoring \& Explainability Engine LogicTriangulated Risk Formula:$$\\text{Risk Score} = \\operatorname{round}\\left(\\frac{P\_{\\text{LR}} + P\_{\\text{RF}} + P\_{\\text{NB}}}{3} \\times 100\\right)$$Risk Categorization Thresholds:$0\\text{ to }35$: LOW (Green UI badge)   $36\\text{ to }70$: MODERATE (Amber/Yellow UI badge)   $71\\text{ to }100$: HIGH (Red UI alert)   Clinical Heuristics Mapping (backend/app/explainer.py):Heart Checks: trestbps > 130 $\\rightarrow$ Hypertension alert; chol > 200 $\\rightarrow$ Hypercholesterolemia alert; exang == 1 $\\rightarrow$ Angina alert; oldpeak >= 2.0 $\\rightarrow$ Severe ST depression; thalach < 120 \& age > 50 $\\rightarrow$ Poor chronotropic heart rate response.Diabetes Checks: glucose >= 126 $\\rightarrow$ Diabetic hyperglycemia alert; glucose between 100 and 125 $\\rightarrow$ Pre-diabetic alert; bmi >= 30.0 $\\rightarrow$ Obesity indicator; dpf >= 0.50 $\\rightarrow$ Hereditary risk.6.4 Supabase Database SchemaRun this DDL statement in the Supabase SQL Editor:SQLcreate table if not exists cardiose\_screening\_history (

&#x20;   id uuid default gen\_random\_uuid() primary key,

&#x20;   created\_at timestamp with time zone default timezone('utc'::text, now()) not null,

&#x20;   disease\_type text not null check (disease\_type in ('HEART', 'DIABETES')),

&#x20;   risk\_score integer not null check (risk\_score between 0 and 100),

&#x20;   risk\_level text not null check (risk\_level in ('LOW', 'MODERATE', 'HIGH')),

&#x20;   model\_breakdown jsonb not null,

&#x20;   evidence\_points text\[] not null,

&#x20;   action\_plan jsonb not null,

&#x20;   user\_inputs jsonb not null

);



\-- Enable public read/write access for demonstration purposes

alter table cardiose\_screening\_history enable row level security;

create policy "Allow anonymous screening logging" on cardiose\_screening\_history

&#x20;   for insert with check (true);

create policy "Allow anonymous reading of history" on cardiose\_screening\_history

&#x20;   for select using (true);

7\. Target Repository StructurePlaintextcardiose/

├── backend/

│   ├── app/

│   │   ├── \_\_init\_\_.py

│   │   ├── main.py              # FastAPI entry point, CORS, routers

│   │   ├── schemas.py           # Pydantic validation models

│   │   ├── inference.py         # Scaling, vectorized model inference

│   │   ├── explainer.py         # Clinical rules \& lifestyle advice generator

│   │   └── db.py                # Supabase REST client logging

│   ├── models/                  # Uploaded pre-trained joblib bundles

│   │   ├── heart\_models.joblib

│   │   └── diabetes\_models.joblib

│   └── requirements.txt         # fastapi, uvicorn, scikit-learn, numpy, joblib, supabase

│

├── frontend/

│   ├── src/

│   │   ├── components/

│   │   │   ├── Navbar.jsx       # Cardiose navigation \& status badge

│   │   │   ├── HeartForm.jsx    # 13 heart clinical inputs with tooltips

│   │   │   ├── DiabetesForm.jsx # 8 diabetes clinical inputs with tooltips

│   │   │   ├── RiskGauge.jsx    # Visual 0-100 meter with Low/Med/High states

│   │   │   ├── ConsensusCard.jsx# LR, RF, NB side-by-side probability breakdown

│   │   │   ├── EvidenceBox.jsx  # "Why It Was Flagged" cards

│   │   │   ├── ActionPlan.jsx   # Targeted dietary \& medical advice cards

│   │   │   └── HistoryView.jsx  # Audit log querying Supabase

│   │   ├── App.jsx              # Main tabbed view switcher

│   │   ├── index.css            # Tailwind directives

│   │   └── main.jsx

│   ├── package.json

│   ├── tailwind.config.js

│   └── vite.config.js

│

├── CARDIODIOSE\_MASTER\_SPECIFICATION.md

└── README.md

8\. Exact Antigravity Directives \& Execution PlaybookExecute the following sequential prompts inside your Antigravity 2.0 workspace:Directive 1: Backend Scaffolding \& Inference Engine"Read CARDIODIOSE\_MASTER\_SPECIFICATION.md. Create the backend/ application directory. Write requirements.txt with only fastapi, uvicorn\[standard], scikit-learn, numpy, joblib, and supabase. Create schemas.py using Pydantic to strictly validate inputs for Heart Disease (13 features) and Diabetes (8 features). Implement inference.py to load heart\_models.joblib and diabetes\_models.joblib from backend/models/, run vectorized NumPy transformations, extract predictions from LR, RF, and NB, and compute the triangulated consensus score. Implement explainer.py to evaluate clinical thresholds and return evidence points and lifestyle plans. Finally, create main.py exposing POST /api/predict/heart, POST /api/predict/diabetes, and GET /api/history with CORS enabled."Directive 2: Frontend Dashboard Construction"Build the client application in frontend/ using Vite + React + Tailwind CSS. Follow the visual presentation structure defined in the specification (Cardiose branding, tabbed navigation between Heart and Diabetes tracks, intuitive inputs with physiological tooltip hints). Integrate the results display: an animated 0-100 Risk Gauge, a Consensus breakdown card displaying individual LR, RF, and NB probabilities, an 'Evidence Points' card showing why parameters were flagged, and an Action Plan card with lifestyle and dietary guidance. Connect form submissions to the backend API and render screening history from Supabase."Directive 3: Local Verification \& Deployment Verification"Run both the FastAPI backend and React frontend locally. Submit a sample high-risk patient vector through the Heart form and verify that: 1. Inference completes in <100ms, 2. Probabilities are triangulated across all 3 models, 3. Clinical evidence points are generated, 4. The screening row is persisted into Supabase, and 5. The risk meter reflects the correct severity level without console errors."

