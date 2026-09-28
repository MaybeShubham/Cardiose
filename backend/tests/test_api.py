"""Integration tests for FastAPI endpoints."""

import pytest
from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c

def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert data["models_loaded"] is True

def test_heart_prediction_api(client):
    payload = {
        "age": 58,
        "sex": 1,
        "cp": 3,
        "trestbps": 145,
        "chol": 260,
        "fbs": 1,
        "restecg": 0,
        "thalach": 130,
        "exang": 1,
        "oldpeak": 2.3,
        "slope": 2,
        "ca": 1,
        "thal": 2
    }
    response = client.post("/api/predict/heart", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "risk_score" in data
    assert "risk_level" in data
    assert "consensus" in data
    assert "evidence_points" in data
    assert "action_plan" in data
    assert data["risk_score"] >= 0
    assert len(data["evidence_points"]) > 0

def test_diabetes_prediction_api(client):
    payload = {
        "pregnancies": 2,
        "glucose": 155,
        "blood_pressure": 82,
        "skin_thickness": 28,
        "insulin": 140,
        "bmi": 32.4,
        "dpf": 0.627,
        "age": 45
    }
    response = client.post("/api/predict/diabetes", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "risk_score" in data
    assert "risk_level" in data
    assert "consensus" in data
    assert "evidence_points" in data
    assert "action_plan" in data

def test_history_api(client):
    response = client.get("/api/history")
    assert response.status_code == 200
    data = response.json()
    assert "count" in data
    assert "history" in data
    assert isinstance(data["history"], list)
    assert data["count"] >= 2  # The prior two screenings should be recorded
