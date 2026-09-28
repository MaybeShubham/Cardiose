"""Clinical Heuristic & Explainability Engine for Cardiose
Translates raw biometrics into evidence points and actionable lifestyle recommendations
based on American Heart Association (AHA) and American Diabetes Association (ADA) guidelines.
"""

from typing import List, Dict, Any
from app.schemas import HeartScreeningInput, DiabetesScreeningInput, ActionPlan

def explain_heart(data: HeartScreeningInput, risk_score: int, risk_level: str) -> tuple[List[str], ActionPlan]:
    evidence: List[str] = []

    # AHA Blood Pressure Guidelines
    if data.trestbps >= 140:
        evidence.append(
            f"Resting blood pressure ({data.trestbps:.0f} mmHg) exceeds AHA Stage-2 hypertension guidelines (>140 mmHg)."
        )
    elif data.trestbps > 130:
        evidence.append(
            f"Resting blood pressure ({data.trestbps:.0f} mmHg) indicates AHA Stage-1 hypertension (>130 mmHg)."
        )

    # Angina
    if data.exang == 1:
        evidence.append(
            "Presence of exercise-induced angina indicates potential coronary ischemia under exertion."
        )

    # Cholesterol
    if data.chol >= 240:
        evidence.append(
            f"Serum cholesterol ({data.chol:.0f} mg/dL) is high (>=240 mg/dL), significantly elevating plaque formation risk."
        )
    elif data.chol > 200:
        evidence.append(
            f"Serum cholesterol ({data.chol:.0f} mg/dL) exceeds optimal cardiovascular levels (<200 mg/dL)."
        )

    # ST Depression
    if data.oldpeak >= 2.0:
        evidence.append(
            f"Severe ST depression ({data.oldpeak:.1f} mm) relative to rest suggests significant exertional myocardial ischemia."
        )
    elif data.oldpeak >= 1.0:
        evidence.append(
            f"Moderate ST depression ({data.oldpeak:.1f} mm) observed under exertion, warranting further cardiological review."
        )

    # Chronotropic Response
    if data.thalach < 120 and data.age > 50:
        evidence.append(
            f"Max heart rate achieved ({data.thalach:.0f} bpm) reflects a blunted chronotropic response for age {data.age:.0f}."
        )

    # Fluoroscopy major vessels
    if data.ca > 0:
        evidence.append(
            f"Fluoroscopy identified {int(data.ca)} major coronary vessel(s) with observable calcification or narrowing."
        )

    # Fasting blood sugar
    if data.fbs == 1:
        evidence.append(
            "Elevated fasting blood sugar (>120 mg/dL) indicates concurrent metabolic stress on vascular endothelium."
        )

    if not evidence:
        evidence.append(
            "All assessed cardiovascular biometrics (blood pressure, cholesterol, ECG markers) fall within conventional normative ranges."
        )

    # Action Plan Synthesis
    if risk_level == "HIGH":
        action = ActionPlan(
            dietary="Adopt a sodium-restricted DASH dietary pattern (<2,300 mg/day) with high soluble fiber intake and omega-3 fatty acids.",
            lifestyle="Limit strenuous exertion until cleared; begin low-impact supervised aerobic walking 30 mins/day with stress reduction.",
            clinical="Schedule a physician consultation for a formal 12-lead resting ECG and comprehensive fasting lipid profile."
        )
    elif risk_level == "MODERATE":
        action = ActionPlan(
            dietary="Reduce saturated and trans-fat intake; replace refined carbohydrates with whole grains and Mediterranean food groups.",
            lifestyle="Engage in moderate-intensity aerobic exercise (150 mins/week) such as brisk walking, cycling, or swimming.",
            clinical="Schedule a routine follow-up with your primary physician to monitor blood pressure trends and repeat lipid tests."
        )
    else:
        action = ActionPlan(
            dietary="Maintain a cardioprotective whole-foods diet rich in leafy greens, berries, lean proteins, and extra virgin olive oil.",
            lifestyle="Continue regular physical exercise (at least 30 mins daily) and prioritize 7-8 hours of restorative sleep.",
            clinical="Continue annual preventive health checkups and routine biometric screenings."
        )

    return evidence, action

def explain_diabetes(data: DiabetesScreeningInput, risk_score: int, risk_level: str) -> tuple[List[str], ActionPlan]:
    evidence: List[str] = []

    # ADA Glucose Guidelines
    if data.glucose >= 126:
        evidence.append(
            f"Plasma glucose level ({data.glucose:.0f} mg/dL) exceeds the standard diagnostic threshold for diabetes (>=126 mg/dL)."
        )
    elif data.glucose >= 100:
        evidence.append(
            f"Plasma glucose level ({data.glucose:.0f} mg/dL) falls into the impaired fasting glucose / pre-diabetes range (100-125 mg/dL)."
        )

    # BMI / Obesity
    if data.bmi >= 35.0:
        evidence.append(
            f"Body Mass Index ({data.bmi:.1f}) indicates Class II Obesity, substantially exacerbating peripheral insulin resistance."
        )
    elif data.bmi >= 30.0:
        evidence.append(
            f"Body Mass Index ({data.bmi:.1f}) indicates Class I Obesity, elevating peripheral insulin resistance."
        )
    elif data.bmi >= 25.0:
        evidence.append(
            f"Body Mass Index ({data.bmi:.1f}) is in the overweight range, representing a mild modifiable risk factor."
        )

    # Diabetes Pedigree Function
    if data.dpf >= 0.50:
        evidence.append(
            f"Elevated Diabetes Pedigree Function ({data.dpf:.2f}) reflects a significant hereditary genetic predisposition."
        )

    # Blood Pressure
    if data.blood_pressure >= 90:
        evidence.append(
            f"Diastolic blood pressure ({data.blood_pressure:.0f} mmHg) indicates Stage-2 hypertension (>90 mmHg)."
        )
    elif data.blood_pressure >= 80:
        evidence.append(
            f"Diastolic blood pressure ({data.blood_pressure:.0f} mmHg) is elevated above optimal thresholds (>=80 mmHg)."
        )

    # Insulin
    if data.insulin >= 166:
        evidence.append(
            f"Elevated 2-hour serum insulin ({data.insulin:.0f} mu U/ml) suggests compensatory hyperinsulinemia and receptor resistance."
        )

    if not evidence:
        evidence.append(
            "Fasting glucose, BMI, and metabolic markers fall within normal physiological parameters."
        )

    # Action Plan Synthesis
    if risk_level == "HIGH":
        action = ActionPlan(
            dietary="Shift to complex, low-glycemic index carbohydrates; eliminate refined sugars, high-fructose syrups, and sweetened beverages.",
            lifestyle="Incorporate light 15-minute walks immediately following major meals to lower postprandial glucose spikes.",
            clinical="Schedule an in-clinic laboratory assessment for a formal glycated hemoglobin (HbA1c) diagnostic test."
        )
    elif risk_level == "MODERATE":
        action = ActionPlan(
            dietary="Practice carbohydrate counting and increase dietary soluble fiber (>30g/day) to slow glucose absorption.",
            lifestyle="Aim for 150 minutes of weekly moderate aerobic activity combined with 2 days of resistance training.",
            clinical="Request an oral glucose tolerance test (OGTT) or fasting blood glucose re-check during your next clinician visit."
        )
    else:
        action = ActionPlan(
            dietary="Continue a balanced, nutrient-dense diet emphasizing legumes, non-starchy vegetables, and lean proteins.",
            lifestyle="Maintain an active lifestyle, adequate hydration, and consistent meal timings to preserve insulin sensitivity.",
            clinical="Maintain annual metabolic screening panels during regular health reviews."
        )

    return evidence, action
