"""Cardiose FastAPI Application Entry Point
Exposes clinical prediction endpoints, health checks, and historical audit logs.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
import time

from app.schemas import (
    HeartScreeningInput,
    DiabetesScreeningInput,
    ScreeningResponse,
    ConsensusScores,
    ScreeningHistoryItem,
)
from app.inference import model_manager
from app.explainer import explain_heart, explain_diabetes
from app.db import log_screening, get_history, delete_screening, clear_all_history

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Preload models into memory for <5ms response latency
    print("Preloading Cardiose model bundles...")
    model_manager.load_models()
    print("✓ Model bundles loaded successfully into memory.")
    yield

app = FastAPI(
    title="Cardiose API",
    description="Explainable Dual-Disease Risk Screening Platform (Cardiovascular Disease & Diabetes Mellitus)",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for decoupled React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health", tags=["System"])
async def health_check():
    return {
        "status": "online",
        "service": "Cardiose Screening API",
        "models_loaded": model_manager.loaded,
        "runtime": "FastAPI + NumPy + Scikit-Learn"
    }

@app.post("/api/predict/heart", response_model=ScreeningResponse, tags=["Screening"])
async def predict_heart(payload: HeartScreeningInput):
    start_time = time.perf_counter()
    try:
        risk_score, risk_level, consensus = model_manager.predict_heart(payload)
        evidence_points, action_plan = explain_heart(payload, risk_score, risk_level)

        # Log screening asynchronously to Supabase
        await log_screening(
            disease_type="HEART",
            risk_score=risk_score,
            risk_level=risk_level,
            model_breakdown=consensus,
            evidence_points=evidence_points,
            action_plan=action_plan.model_dump(),
            user_inputs=payload.model_dump()
        )

        latency_ms = (time.perf_counter() - start_time) * 1000
        print(f"[Heart Screening] Risk: {risk_score} ({risk_level}) in {latency_ms:.2f}ms")

        return ScreeningResponse(
            risk_score=risk_score,
            risk_level=risk_level,
            consensus=ConsensusScores(**consensus),
            evidence_points=evidence_points,
            action_plan=action_plan
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference error during heart disease screening: {str(e)}"
        )

@app.post("/api/predict/diabetes", response_model=ScreeningResponse, tags=["Screening"])
async def predict_diabetes(payload: DiabetesScreeningInput):
    start_time = time.perf_counter()
    try:
        risk_score, risk_level, consensus = model_manager.predict_diabetes(payload)
        evidence_points, action_plan = explain_diabetes(payload, risk_score, risk_level)

        # Log screening asynchronously to Supabase
        await log_screening(
            disease_type="DIABETES",
            risk_score=risk_score,
            risk_level=risk_level,
            model_breakdown=consensus,
            evidence_points=evidence_points,
            action_plan=action_plan.model_dump(),
            user_inputs=payload.model_dump()
        )

        latency_ms = (time.perf_counter() - start_time) * 1000
        print(f"[Diabetes Screening] Risk: {risk_score} ({risk_level}) in {latency_ms:.2f}ms")

        return ScreeningResponse(
            risk_score=risk_score,
            risk_level=risk_level,
            consensus=ConsensusScores(**consensus),
            evidence_points=evidence_points,
            action_plan=action_plan
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference error during diabetes screening: {str(e)}"
        )

@app.get("/api/history", tags=["Audit Log"])
async def history(limit: int = 50):
    try:
        records = await get_history(limit=limit)
        return {"count": len(records), "history": records}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error querying screening history: {str(e)}"
        )

@app.delete("/api/history/{record_id}", tags=["Audit Log"])
async def delete_history_item(record_id: str):
    try:
        await delete_screening(record_id)
        return {"status": "deleted", "id": record_id}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting screening record: {str(e)}"
        )

@app.delete("/api/history", tags=["Audit Log"])
async def delete_all_history():
    try:
        await clear_all_history()
        return {"status": "cleared", "message": "All screening history cleared."}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error clearing screening history: {str(e)}"
        )
