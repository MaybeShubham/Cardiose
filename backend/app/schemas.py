"""Pydantic schemas for clinical input validation and response payloads."""

from pydantic import BaseModel, Field
from typing import Dict, List, Literal, Any, Optional

class HeartScreeningInput(BaseModel):
    age: float = Field(..., ge=1.0, le=120.0, description="Age in years")
    sex: int = Field(..., ge=0, le=1, description="Biological sex (1 = male, 0 = female)")
    cp: int = Field(..., ge=0, le=4, description="Chest pain type (1: Typical, 2: Atypical, 3: Non-anginal, 4: Asymptomatic / 0-3 encoded)")
    trestbps: float = Field(..., ge=50.0, le=260.0, description="Resting blood pressure (mm Hg)")
    chol: float = Field(..., ge=80.0, le=600.0, description="Serum cholesterol (mg/dL)")
    fbs: int = Field(..., ge=0, le=1, description="Fasting blood sugar > 120 mg/dL (1 = true, 0 = false)")
    restecg: int = Field(..., ge=0, le=2, description="Resting ECG results (0 = normal, 1 = ST-T wave abnormality, 2 = left ventricular hypertrophy)")
    thalach: float = Field(..., ge=50.0, le=250.0, description="Maximum heart rate achieved (bpm)")
    exang: int = Field(..., ge=0, le=1, description="Exercise-induced angina (1 = yes, 0 = no)")
    oldpeak: float = Field(..., ge=0.0, le=10.0, description="ST depression induced by exercise relative to rest")
    slope: int = Field(..., ge=0, le=3, description="Slope of peak exercise ST segment (1 = upsloping, 2 = flat, 3 = downsloping)")
    ca: float = Field(..., ge=0.0, le=4.0, description="Major vessels colored by fluoroscopy (0-3)")
    thal: float = Field(..., ge=0.0, le=7.0, description="Thallium stress test result (1-3 or 3/6/7)")

class DiabetesScreeningInput(BaseModel):
    pregnancies: int = Field(..., ge=0, le=25, description="Number of times pregnant")
    glucose: float = Field(..., ge=40.0, le=350.0, description="Plasma glucose concentration (2 hours in oral glucose tolerance test, mg/dL)")
    blood_pressure: float = Field(..., ge=30.0, le=200.0, description="Diastolic blood pressure (mm Hg)")
    skin_thickness: float = Field(..., ge=0.0, le=100.0, description="Triceps skin fold thickness (mm)")
    insulin: float = Field(..., ge=0.0, le=900.0, description="2-Hour serum insulin (mu U/ml)")
    bmi: float = Field(..., ge=10.0, le=70.0, description="Body mass index (weight in kg/(height in m)^2)")
    dpf: float = Field(..., ge=0.01, le=3.5, description="Diabetes pedigree function (genetic score)")
    age: float = Field(..., ge=1.0, le=120.0, description="Age in years")

class ConsensusScores(BaseModel):
    logistic_regression: float = Field(..., description="Logistic Regression class-1 probability (0.0 to 1.0)")
    random_forest: float = Field(..., description="Random Forest class-1 probability (0.0 to 1.0)")
    naive_bayes: float = Field(..., description="Gaussian Naive Bayes class-1 probability (0.0 to 1.0)")

class ActionPlan(BaseModel):
    dietary: str = Field(..., description="Targeted dietary and nutritional recommendations")
    lifestyle: str = Field(..., description="Prescribed physical activity and behavioral modifications")
    clinical: str = Field(..., description="Recommended diagnostic laboratory or clinician follow-ups")

class ScreeningResponse(BaseModel):
    risk_score: int = Field(..., ge=0, le=100, description="Triangulated consensus risk score (0-100)")
    risk_level: Literal["LOW", "MODERATE", "HIGH"] = Field(..., description="Risk category: LOW (0-35), MODERATE (36-70), HIGH (71-100)")
    consensus: ConsensusScores = Field(..., description="Individual model probability outputs")
    evidence_points: List[str] = Field(..., description="Biometric risk factors and physiological drivers")
    action_plan: ActionPlan = Field(..., description="Post-screening actionable recommendations")

class ScreeningHistoryItem(BaseModel):
    id: Optional[str] = None
    created_at: Optional[str] = None
    disease_type: Literal["HEART", "DIABETES"]
    risk_score: int
    risk_level: Literal["LOW", "MODERATE", "HIGH"]
    model_breakdown: Dict[str, float]
    evidence_points: List[str]
    action_plan: Dict[str, str]
    user_inputs: Dict[str, Any]
