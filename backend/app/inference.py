"""Inference Engine for Cardiose
Loads serialized model bundles, performs vectorized transformations,
extracts model probabilities, and calculates triangulated consensus risk scores.
"""

from pathlib import Path
import joblib
import numpy as np
from typing import Dict, Any, Tuple
from app.schemas import HeartScreeningInput, DiabetesScreeningInput

MODELS_DIR = Path(__file__).resolve().parent.parent / "models"

class ModelManager:
    def __init__(self):
        self.heart_bundle: Dict[str, Any] = {}
        self.diabetes_bundle: Dict[str, Any] = {}
        self.loaded = False

    def load_models(self):
        heart_path = MODELS_DIR / "heart_models.joblib"
        diabetes_path = MODELS_DIR / "diabetes_models.joblib"

        if not heart_path.exists() or not diabetes_path.exists():
            raise FileNotFoundError(
                f"Model bundles missing in {MODELS_DIR}. Run train_models.py first."
            )

        self.heart_bundle = joblib.load(heart_path)
        self.diabetes_bundle = joblib.load(diabetes_path)
        self.loaded = True

    def predict_heart(self, data: HeartScreeningInput) -> Tuple[int, str, Dict[str, float]]:
        if not self.loaded:
            self.load_models()

        features = self.heart_bundle.get("features", [
            'age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg',
            'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal'
        ])
        
        input_dict = data.model_dump()
        vector = np.array([[float(input_dict[f]) for f in features]], dtype=np.float64)

        scaler = self.heart_bundle["scaler"]
        vector_scaled = scaler.transform(vector)

        lr_model = self.heart_bundle["lr"]
        rf_model = self.heart_bundle["rf"]
        nb_model = self.heart_bundle["nb"]

        p_lr = float(lr_model.predict_proba(vector_scaled)[0, 1])
        p_rf = float(rf_model.predict_proba(vector_scaled)[0, 1])
        p_nb = float(nb_model.predict_proba(vector_scaled)[0, 1])

        # Triangulated risk formula
        mean_p = (p_lr + p_rf + p_nb) / 3.0
        risk_score = int(round(mean_p * 100))
        risk_score = max(0, min(100, risk_score))

        # Risk categorization thresholds
        if risk_score <= 35:
            risk_level = "LOW"
        elif risk_score <= 70:
            risk_level = "MODERATE"
        else:
            risk_level = "HIGH"

        consensus = {
            "logistic_regression": round(p_lr, 2),
            "random_forest": round(p_rf, 2),
            "naive_bayes": round(p_nb, 2)
        }
        return risk_score, risk_level, consensus

    def predict_diabetes(self, data: DiabetesScreeningInput) -> Tuple[int, str, Dict[str, float]]:
        if not self.loaded:
            self.load_models()

        features = self.diabetes_bundle.get("features", [
            'pregnancies', 'glucose', 'blood_pressure', 'skin_thickness',
            'insulin', 'bmi', 'dpf', 'age'
        ])

        input_dict = data.model_dump()
        vector = np.array([[float(input_dict[f]) for f in features]], dtype=np.float64)

        scaler = self.diabetes_bundle["scaler"]
        vector_scaled = scaler.transform(vector)

        lr_model = self.diabetes_bundle["lr"]
        rf_model = self.diabetes_bundle["rf"]
        nb_model = self.diabetes_bundle["nb"]

        p_lr = float(lr_model.predict_proba(vector_scaled)[0, 1])
        p_rf = float(rf_model.predict_proba(vector_scaled)[0, 1])
        p_nb = float(nb_model.predict_proba(vector_scaled)[0, 1])

        # Triangulated risk formula
        mean_p = (p_lr + p_rf + p_nb) / 3.0
        risk_score = int(round(mean_p * 100))
        risk_score = max(0, min(100, risk_score))

        # Risk categorization thresholds
        if risk_score <= 35:
            risk_level = "LOW"
        elif risk_score <= 70:
            risk_level = "MODERATE"
        else:
            risk_level = "HIGH"

        consensus = {
            "logistic_regression": round(p_lr, 2),
            "random_forest": round(p_rf, 2),
            "naive_bayes": round(p_nb, 2)
        }
        return risk_score, risk_level, consensus

model_manager = ModelManager()
