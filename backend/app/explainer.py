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

    # Dynamic Personalized Action Plan Synthesis
    # 1. Dietary recommendation tailored to BP and cholesterol
    if data.trestbps >= 140 and data.chol >= 240:
        diet = f"Adopt a DASH dietary protocol restricting sodium (<2,000 mg/day) and replacing saturated fats with plant sterols to directly target your elevated BP ({data.trestbps:.0f} mmHg) and cholesterol ({data.chol:.0f} mg/dL)."
    elif data.trestbps >= 130:
        diet = f"Prioritize a low-sodium DASH diet (<2,300 mg/day) rich in potassium (spinach, bananas) to assist in lowering your resting BP from {data.trestbps:.0f} mmHg toward optimal (<120 mmHg)."
    elif data.chol >= 200:
        diet = f"Target your elevated cholesterol ({data.chol:.0f} mg/dL) with soluble fiber (>30g/day from oats, legumes) and omega-3s, while keeping saturated fat under 6% of daily intake."
    else:
        diet = f"Maintain a heart-healthy Mediterranean whole-foods diet (leafy greens, olive oil, lean proteins) to keep your blood pressure ({data.trestbps:.0f} mmHg) and cholesterol ({data.chol:.0f} mg/dL) in their healthy ranges."

    # 2. Lifestyle recommendation tailored to exercise capacity, chest discomfort, and age
    if data.exang == 1 or data.oldpeak >= 1.5:
        lifestyle = f"Due to exertional chest discomfort and an ECG strain of {data.oldpeak:.1f} mm, avoid sudden strenuous lifting. Start low-impact supervised walking (20–30 mins/day) and prioritize stress management."
    elif data.thalach < 130 and data.age > 50:
        lifestyle = f"Build cardiovascular stamina with 150 mins/week of moderate brisk walking or cycling to help improve chronotropic response (currently max {data.thalach:.0f} bpm at age {data.age:.0f})."
    elif risk_level == "HIGH":
        lifestyle = "Limit unmonitored strenuous exertion; incorporate daily gentle 30-minute walks and 7-8 hours of regular, restorative sleep."
    elif risk_level == "MODERATE":
        lifestyle = "Engage in moderate-intensity aerobic exercise (150 mins/week) such as swimming or brisk walking to reinforce cardiovascular endurance."
    else:
        lifestyle = f"Continue regular physical exercise (at least 30 mins daily) and maintain your strong aerobic stamina ({data.thalach:.0f} bpm peak capacity)."

    # 3. Clinical recommendation tailored to scan results, ECG, and risk level
    if data.ca > 0:
        clinical = f"Consult a cardiologist to evaluate the {int(data.ca)} major coronary vessel(s) with observed narrowing and discuss a formal coronary calcium scan or CT angiogram."
    elif data.oldpeak >= 1.0 or data.exang == 1:
        clinical = f"Schedule an appointment for a 12-lead resting and treadmill stress ECG to investigate the {data.oldpeak:.1f} mm ST depression seen during screening."
    elif data.trestbps >= 140:
        clinical = f"Schedule an in-clinic follow-up to confirm the {data.trestbps:.0f} mmHg blood pressure reading and evaluate 24-hour ambulatory BP monitoring."
    elif risk_level == "HIGH":
        clinical = "Schedule a physician consultation for a comprehensive cardiovascular workup and repeat fasting lipid panel."
    elif risk_level == "MODERATE":
        clinical = "Schedule a routine check-up with your primary physician to monitor blood pressure trends and review lifestyle progress in 3 months."
    else:
        clinical = "Continue annual preventive health checkups and routine wellness screenings."

    action = ActionPlan(dietary=diet, lifestyle=lifestyle, clinical=clinical)
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

    # Dynamic Personalized Action Plan Synthesis
    # 1. Dietary recommendation tailored to glucose and BMI
    if data.glucose >= 126 and data.bmi >= 30.0:
        diet = f"Strictly limit high-glycemic carbohydrates and added sugars to address elevated blood glucose ({data.glucose:.0f} mg/dL), paired with a moderate 500-kcal deficit to reduce Class I/II obesity (BMI: {data.bmi:.1f})."
    elif data.glucose >= 126:
        diet = f"Shift to low-glycemic, high-fiber carbohydrates and eliminate sugar-sweetened beverages to bring elevated fasting glucose ({data.glucose:.0f} mg/dL) back toward normal."
    elif data.glucose >= 100:
        diet = f"Address pre-diabetic glucose ({data.glucose:.0f} mg/dL) by pairing carbohydrates with protein and fiber (>30g/day) to flatten post-meal blood sugar spikes."
    elif data.bmi >= 25.0:
        diet = f"Focus on whole foods, lean proteins, and portion control to support gradual weight management (current BMI: {data.bmi:.1f}) and protect insulin sensitivity."
    else:
        diet = f"Maintain balanced, nutrient-dense meals emphasizing non-starchy vegetables and legumes to sustain your healthy glucose level ({data.glucose:.0f} mg/dL)."

    # 2. Lifestyle recommendation tailored to BMI, insulin, and blood pressure
    if data.bmi >= 28.0 or data.insulin >= 140:
        lifestyle = f"Incorporate a 10–15 minute brisk walk immediately after major meals to directly lower blood sugar spikes and counter insulin resistance (insulin: {data.insulin:.0f} mu U/ml, BMI: {data.bmi:.1f})."
    elif data.blood_pressure >= 80:
        lifestyle = f"Combine 150 minutes of weekly aerobic activity with stress-reduction techniques to assist diastolic blood pressure control ({data.blood_pressure:.0f} mmHg)."
    elif risk_level == "HIGH":
        lifestyle = "Incorporate regular low-impact aerobic exercise (30 mins daily) paired with consistent meal and sleep schedules to enhance insulin sensitivity."
    elif risk_level == "MODERATE":
        lifestyle = "Aim for 150 minutes of weekly moderate aerobic activity combined with 2 sessions of light resistance training to build metabolic capacity."
    else:
        lifestyle = "Maintain an active lifestyle, regular hydration, and consistent meal timings to preserve healthy metabolic function."

    # 3. Clinical recommendation tailored to glucose, pedigree, and risk level
    if data.glucose >= 126:
        clinical = f"Schedule an immediate laboratory assessment for a formal glycated hemoglobin (HbA1c) diagnostic test to assess 3-month glycemic control ({data.glucose:.0f} mg/dL current reading)."
    elif data.glucose >= 100:
        clinical = f"Request an oral glucose tolerance test (OGTT) or 3-month fasting glucose re-check to monitor borderline glucose ({data.glucose:.0f} mg/dL)."
    elif data.dpf >= 0.50:
        clinical = f"Discuss your elevated hereditary family predisposition score ({data.dpf:.2f}) with a physician and request annual preventative metabolic panels."
    elif risk_level == "HIGH":
        clinical = "Schedule a comprehensive clinical assessment including an HbA1c test and kidney metabolic panel."
    elif risk_level == "MODERATE":
        clinical = "Schedule a routine check-up with your doctor to review metabolic markers and repeat fasting glucose in 6 months."
    else:
        clinical = "Maintain annual metabolic screening panels during regular health reviews."

    action = ActionPlan(dietary=diet, lifestyle=lifestyle, clinical=clinical)
    return evidence, action
