/**
 * Physiologically Correlated Patient Profile Generator for Cardiose CDSS
 *
 * Implements clinical multivariate dependencies:
 * - Age & Sex dependencies:
 *   - Arterial elastance & blood pressure rise with age
 *   - Chronotropic reserve / max heart rate achieved scales with (220 - age)
 *   - Male vs Female lipid & coronary risk profiles
 *   - Pregnancies strictly 0 for males, age-scaled for females
 * - Diabetic & metabolic coupling:
 *   - BMI couples with Insulin, Skin Thickness, and Glucose tolerance
 *   - DPF (genetic score) elevates risk likelihood in conjunction with age
 */

// Diverse realistic cohort profiles across the human lifespan
export const COHORT_ARCHETYPES = [
  {
    label: "Young Female Athlete (22y)",
    description: "Normative youthful biometrics, high aerobic capacity",
    heart: {
      age: 22,
      sex: 0,
      cp: 0,
      trestbps: 110,
      chol: 168,
      fbs: 0,
      restecg: 0,
      thalach: 194, // 220 - 22 ≈ 198 bpm peak
      exang: 0,
      oldpeak: 0.1,
      slope: 1, // upsloping
      ca: 0,
      thal: 1
    },
    diabetes: {
      pregnancies: 0,
      glucose: 88,
      blood_pressure: 68,
      skin_thickness: 16,
      insulin: 52,
      bmi: 21.2,
      dpf: 0.18,
      age: 22
    }
  },
  {
    label: "Young Male College Student (24y)",
    description: "Normative young male, sedentary, low cardiovascular strain",
    heart: {
      age: 24,
      sex: 1,
      cp: 0,
      trestbps: 118,
      chol: 178,
      fbs: 0,
      restecg: 0,
      thalach: 188,
      exang: 0,
      oldpeak: 0.2,
      slope: 1,
      ca: 0,
      thal: 1
    },
    diabetes: {
      pregnancies: 0,
      glucose: 94,
      blood_pressure: 74,
      skin_thickness: 20,
      insulin: 70,
      bmi: 23.5,
      dpf: 0.24,
      age: 24
    }
  },
  {
    label: "Adult Female Professional (36y)",
    description: "Mild work stress, borderline resting BP, normative glycemic panel",
    heart: {
      age: 36,
      sex: 0,
      cp: 1, // atypical mild
      trestbps: 124,
      chol: 195,
      fbs: 0,
      restecg: 0,
      thalach: 174,
      exang: 0,
      oldpeak: 0.4,
      slope: 1,
      ca: 0,
      thal: 1
    },
    diabetes: {
      pregnancies: 1,
      glucose: 104,
      blood_pressure: 76,
      skin_thickness: 22,
      insulin: 88,
      bmi: 25.4,
      dpf: 0.32,
      age: 36
    }
  },
  {
    label: "Middle-Aged Male (52y, Early Metabolic Strain)",
    description: "Stage-1 hypertension, elevated LDL cholesterol, reduced peak heart rate",
    heart: {
      age: 52,
      sex: 1,
      cp: 2, // non-anginal pain
      trestbps: 138,
      chol: 235,
      fbs: 0,
      restecg: 1,
      thalach: 148, // (220 - 52 = 168 max)
      exang: 0,
      oldpeak: 1.2,
      slope: 2, // flat
      ca: 1,
      thal: 2
    },
    diabetes: {
      pregnancies: 0,
      glucose: 122, // Impaired fasting
      blood_pressure: 84,
      skin_thickness: 30,
      insulin: 135,
      bmi: 29.2,
      dpf: 0.54,
      age: 52
    }
  },
  {
    label: "Middle-Aged Female (54y, Post-Menopausal Profile)",
    description: "Elevated cholesterol, pre-hypertension, multi-pregnancy history",
    heart: {
      age: 54,
      sex: 0,
      cp: 0,
      trestbps: 134,
      chol: 228,
      fbs: 0,
      restecg: 0,
      thalach: 152,
      exang: 0,
      oldpeak: 0.8,
      slope: 1,
      ca: 0,
      thal: 1
    },
    diabetes: {
      pregnancies: 3,
      glucose: 114,
      blood_pressure: 82,
      skin_thickness: 28,
      insulin: 115,
      bmi: 27.8,
      dpf: 0.42,
      age: 54
    }
  },
  {
    label: "Senior Male (68y, Coronary & Glycemic Risk)",
    description: "Stage-2 hypertension, exertional angina, blunted chronotropic response, multi-vessel calcification",
    heart: {
      age: 68,
      sex: 1,
      cp: 3, // asymptomatic / ischemic
      trestbps: 152,
      chol: 265,
      fbs: 1,
      restecg: 2, // LVH
      thalach: 118, // Blunted chronotropic response
      exang: 1, // exercise-induced angina
      oldpeak: 2.6, // severe ST depression
      slope: 2, // flat
      ca: 2,
      thal: 3 // reversible defect
    },
    diabetes: {
      pregnancies: 0,
      glucose: 168, // diabetic hyperglycemia
      blood_pressure: 88,
      skin_thickness: 32,
      insulin: 160,
      bmi: 33.5, // Class I Obesity
      dpf: 0.72,
      age: 68
    }
  },
  {
    label: "Senior Female (72y, Advanced Age Cardiometabolic)",
    description: "Arteriosclerotic hypertension, reduced exercise tolerance, elevated HOMA-IR",
    heart: {
      age: 72,
      sex: 0,
      cp: 2,
      trestbps: 158,
      chol: 252,
      fbs: 1,
      restecg: 1,
      thalach: 122,
      exang: 1,
      oldpeak: 2.1,
      slope: 2,
      ca: 1,
      thal: 2
    },
    diabetes: {
      pregnancies: 4,
      glucose: 154,
      blood_pressure: 86,
      skin_thickness: 26,
      insulin: 145,
      bmi: 31.8,
      dpf: 0.65,
      age: 72
    }
  }
];

// Random generation function ensuring internal physiological correlation
export function generateRandomCorrelatedPatient(type = 'heart') {
  // Randomly pick an age group: 18-30, 31-50, 51-65, 66-82
  const ageBands = [
    { min: 18, max: 28, weight: 0.25 },
    { min: 29, max: 48, weight: 0.30 },
    { min: 49, max: 64, weight: 0.30 },
    { min: 65, max: 80, weight: 0.15 },
  ];

  const roll = Math.random();
  let cumulative = 0;
  let band = ageBands[0];
  for (const b of ageBands) {
    cumulative += b.weight;
    if (roll <= cumulative) {
      band = b;
      break;
    }
  }

  const age = Math.floor(Math.random() * (band.max - band.min + 1)) + band.min;
  const sex = Math.random() > 0.48 ? 1 : 0; // 1 = Male, 0 = Female

  // Age-dependent base physiological parameters
  // Max heart rate declines with age: Tanaka formula (208 - 0.7 * age)
  const maxPossibleHR = 208 - 0.7 * age;
  // Intensity fraction (65% to 95%)
  const hrFraction = 0.65 + Math.random() * 0.30;
  const thalach = Math.round(maxPossibleHR * hrFraction);

  // Systolic BP rises with age due to arterial stiffness
  // Young adults: ~110-125, Middle: ~120-145, Senior: ~130-165
  const baseBP = 100 + age * 0.55 + (sex === 1 ? 5 : 0);
  const bpJitter = (Math.random() - 0.5) * 24;
  const trestbps = Math.round(Math.max(95, Math.min(200, baseBP + bpJitter)));

  // Serum cholesterol rises through middle age
  const baseChol = 160 + Math.min(age * 1.2, 85);
  const cholJitter = (Math.random() - 0.5) * 60;
  const chol = Math.round(Math.max(130, Math.min(360, baseChol + cholJitter)));

  // Angina & ST depression correlated with age and BP
  const isOlder = age >= 50;
  const hasHighBP = trestbps >= 140;
  const exang = isOlder && hasHighBP && Math.random() > 0.55 ? 1 : 0;
  const oldpeak = isOlder && (exang === 1 || chol > 240)
    ? parseFloat((1.2 + Math.random() * 2.2).toFixed(1))
    : parseFloat((Math.random() * 0.8).toFixed(1));

  const cp = exang === 1 ? (Math.random() > 0.5 ? 3 : 2) : (Math.random() > 0.7 ? 1 : 0);
  const slope = oldpeak >= 1.5 ? 2 : (Math.random() > 0.6 ? 2 : 1);
  const ca = isOlder && chol > 230 ? (Math.random() > 0.5 ? 1 : 2) : 0;
  const thal = oldpeak > 2.0 ? 3 : (isOlder && Math.random() > 0.6 ? 2 : 1);
  const fbs = (age > 45 && Math.random() > 0.7) ? 1 : 0;
  const restecg = isOlder && hasHighBP && Math.random() > 0.6 ? (Math.random() > 0.7 ? 2 : 1) : 0;

  // Diabetes correlated features
  const baseBMI = 21 + (age * 0.14) + (Math.random() - 0.5) * 8;
  const bmi = parseFloat(Math.max(18.5, Math.min(46.0, baseBMI)).toFixed(1));

  // Glucose and Insulin couple with BMI and age
  const insulinResistanceFactor = (bmi - 20) * 4.5;
  const insulin = Math.round(Math.max(25, Math.min(320, 60 + insulinResistanceFactor + (Math.random() - 0.5) * 30)));
  const baseGlucose = 85 + (bmi > 30 ? 35 : (bmi > 25 ? 15 : 0)) + (age > 50 ? 15 : 0);
  const glucose = Math.round(Math.max(70, Math.min(260, baseGlucose + (Math.random() - 0.5) * 40)));

  const diastolicBP = Math.round(Math.max(55, Math.min(115, 65 + age * 0.25 + (bmi > 30 ? 8 : 0))));
  const skin_thickness = Math.round(Math.max(10, Math.min(55, 12 + (bmi - 18) * 1.3)));
  const dpf = parseFloat((0.15 + (Math.random() * 0.75)).toFixed(3));

  // Pregnancies: strictly 0 for male, age-correlated for female
  const pregnancies = sex === 0
    ? (age < 22 ? (Math.random() > 0.8 ? 1 : 0) : Math.min(7, Math.floor((age - 20) / 8) + (Math.random() > 0.5 ? 1 : 0)))
    : 0;

  return {
    label: `${age}y ${sex === 1 ? 'Male' : 'Female'} (${age < 30 ? 'Young Adult' : age < 55 ? 'Middle-Aged' : 'Senior'})`,
    heart: {
      age,
      sex,
      cp,
      trestbps,
      chol,
      fbs,
      restecg,
      thalach,
      exang,
      oldpeak,
      slope,
      ca,
      thal
    },
    diabetes: {
      pregnancies,
      glucose,
      blood_pressure: diastolicBP,
      skin_thickness,
      insulin,
      bmi,
      dpf,
      age
    }
  };
}
