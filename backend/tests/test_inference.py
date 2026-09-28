"""Unit tests for inference and clinical explainability."""

import pytest
from app.inference import model_manager
from app.schemas import HeartScreeningInput, DiabetesScreeningInput
from app.explainer import explain_heart, explain_diabetes

@pytest.fixture(scope="session", autouse=True)
def setup_models():
    model_manager.load_models()

def test_heart_inference_and_triangulation():
    sample_high_risk = HeartScreeningInput(
        age=58,
        sex=1,
        cp=3,
        trestbps=145,
        chol=260,
        fbs=1,
        restecg=0,
        thalach=130,
        exang=1,
        oldpeak=2.3,
        slope=2,
        ca=1,
        thal=2
    )

    risk_score, risk_level, consensus = model_manager.predict_heart(sample_high_risk)
    assert 0 <= risk_score <= 100
    assert risk_level in ["LOW", "MODERATE", "HIGH"]
    assert "logistic_regression" in consensus
    assert "random_forest" in consensus
    assert "naive_bayes" in consensus

    # Verify triangulation math
    mean_p = (consensus["logistic_regression"] + consensus["random_forest"] + consensus["naive_bayes"]) / 3.0
    expected_score = int(round(mean_p * 100))
    # Allow 1-point tolerance for rounding of individual components
    assert abs(risk_score - expected_score) <= 1

    evidence, action = explain_heart(sample_high_risk, risk_score, risk_level)
    assert len(evidence) >= 2
    # Check that hypertension and angina are captured
    assert any("hypertension" in e.lower() for e in evidence)
    assert any("angina" in e.lower() for e in evidence)
    assert action.dietary != ""
    assert action.clinical != ""

def test_diabetes_inference_and_triangulation():
    sample_high_risk = DiabetesScreeningInput(
        pregnancies=2,
        glucose=155,
        blood_pressure=82,
        skin_thickness=28,
        insulin=140,
        bmi=32.4,
        dpf=0.627,
        age=45
    )

    risk_score, risk_level, consensus = model_manager.predict_diabetes(sample_high_risk)
    assert 0 <= risk_score <= 100
    assert risk_level in ["LOW", "MODERATE", "HIGH"]
    assert "logistic_regression" in consensus
    assert "random_forest" in consensus
    assert "naive_bayes" in consensus

    evidence, action = explain_diabetes(sample_high_risk, risk_score, risk_level)
    assert len(evidence) >= 2
    # Check that glucose and BMI/obesity are captured
    assert any("glucose" in e.lower() for e in evidence)
    assert any("obesity" in e.lower() or "bmi" in e.lower() for e in evidence)
    assert action.dietary != ""
    assert action.clinical != ""
