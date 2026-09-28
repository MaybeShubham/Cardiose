"""Database access layer for Cardiose
Provides Supabase PostgreSQL persistence for screening audit logs
with robust in-memory fallback for local development or offline viva demonstrations.
"""

import os
import uuid
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", "").strip()
SUPABASE_KEY = os.getenv("SUPABASE_KEY", os.getenv("SUPABASE_ANON_KEY", "")).strip()

_supabase_client = None
if SUPABASE_URL and SUPABASE_KEY:
    try:
        from supabase import create_client, Client
        _supabase_client: Optional[Client] = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("✓ Supabase client initialized successfully.")
    except Exception as e:
        print(f"⚠ Warning: Could not initialize Supabase client ({e}). Using in-memory fallback.")
        _supabase_client = None
else:
    print("ℹ Supabase credentials not provided. Operating in in-memory audit log mode.")

# In-memory storage fallback for local testing & viva defense
_IN_MEMORY_HISTORY: List[Dict[str, Any]] = []

async def log_screening(
    disease_type: str,
    risk_score: int,
    risk_level: str,
    model_breakdown: Dict[str, float],
    evidence_points: List[str],
    action_plan: Dict[str, str],
    user_inputs: Dict[str, Any]
) -> Dict[str, Any]:
    """Persist screening record to Supabase, falling back to local in-memory log."""
    record = {
        "id": str(uuid.uuid4()),
        "created_at": datetime.now(timezone.utc).isoformat(),
        "disease_type": disease_type,
        "risk_score": risk_score,
        "risk_level": risk_level,
        "model_breakdown": model_breakdown,
        "evidence_points": evidence_points,
        "action_plan": action_plan,
        "user_inputs": user_inputs
    }

    if _supabase_client:
        try:
            response = _supabase_client.table("cardiose_screening_history").insert(record).execute()
            if response.data:
                return response.data[0]
        except Exception as e:
            print(f"⚠ Supabase insert failed: {e}. Logging to in-memory fallback.")

    _IN_MEMORY_HISTORY.insert(0, record)
    return record

async def get_history(limit: int = 50) -> List[Dict[str, Any]]:
    """Retrieve historical screenings sorted newest first."""
    if _supabase_client:
        try:
            response = (
                _supabase_client.table("cardiose_screening_history")
                .select("*")
                .order("created_at", desc=True)
                .limit(limit)
                .execute()
            )
            if response.data is not None:
                return response.data
        except Exception as e:
            print(f"⚠ Supabase query failed: {e}. Falling back to in-memory history.")

    return _IN_MEMORY_HISTORY[:limit]
