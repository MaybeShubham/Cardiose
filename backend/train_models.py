"""Cardiose Model Training Script
Trains benchmark models for Heart Disease (UCI Cleveland) and Diabetes (Pima Indians)
Saves serialized bundles containing {'lr', 'rf', 'nb', 'scaler', 'features'}
Strictly adheres to project requirements without heavy runtime dependencies.
"""

import urllib.request
import numpy as np
import joblib
from pathlib import Path
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.naive_bayes import GaussianNB
from sklearn.metrics import accuracy_score, recall_score

MODELS_DIR = Path(__file__).resolve().parent / "models"
MODELS_DIR.mkdir(parents=True, exist_ok=True)

def train_heart_models():
    print("Training Heart Disease models (UCI Cleveland)...")
    cleveland_url = "https://archive.ics.uci.edu/ml/machine-learning-databases/heart-disease/processed.cleveland.data"
    with urllib.request.urlopen(cleveland_url, timeout=15) as r:
        lines = [line.strip().split(',') for line in r.read().decode('utf-8').strip().split('\n') if line.strip()]

    rows = []
    for line in lines:
        row = []
        for val in line:
            if val == '?':
                row.append(np.nan)
            else:
                row.append(float(val))
        rows.append(row)

    data = np.array(rows)
    X = data[:, :-1]
    y = (data[:, -1] > 0).astype(int)

    # Impute missing values with column median
    for col in range(X.shape[1]):
        nans = np.isnan(X[:, col])
        if np.any(nans):
            med = np.nanmedian(X[:, col])
            X[nans, col] = med

    features = ['age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg', 'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    scaler = StandardScaler().fit(X_train)
    X_train_s = scaler.transform(X_train)
    X_test_s = scaler.transform(X_test)

    lr = LogisticRegression(max_iter=1000, random_state=42).fit(X_train_s, y_train)
    rf = RandomForestClassifier(n_estimators=100, max_depth=8, random_state=42).fit(X_train_s, y_train)
    nb = GaussianNB().fit(X_train_s, y_train)

    print(f"Heart LR - Accuracy: {accuracy_score(y_test, lr.predict(X_test_s)):.4f}, Recall: {recall_score(y_test, lr.predict(X_test_s)):.4f}")
    print(f"Heart RF - Accuracy: {accuracy_score(y_test, rf.predict(X_test_s)):.4f}, Recall: {recall_score(y_test, rf.predict(X_test_s)):.4f}")
    print(f"Heart NB - Accuracy: {accuracy_score(y_test, nb.predict(X_test_s)):.4f}, Recall: {recall_score(y_test, nb.predict(X_test_s)):.4f}")

    bundle = {
        'lr': lr,
        'rf': rf,
        'nb': nb,
        'scaler': scaler,
        'features': features
    }
    joblib.dump(bundle, MODELS_DIR / "heart_models.joblib")
    print(f"Saved heart_models.joblib to {MODELS_DIR}")

def train_diabetes_models():
    print("\nTraining Diabetes models (Pima Indians)...")
    pima_url = "https://raw.githubusercontent.com/jbrownlee/Datasets/master/pima-indians-diabetes.data.csv"
    with urllib.request.urlopen(pima_url, timeout=15) as r:
        p_lines = [[float(v) for v in line.strip().split(',')] for line in r.read().decode('utf-8').strip().split('\n') if line.strip()]

    p_data = np.array(p_lines)
    X = p_data[:, :-1]
    y = p_data[:, -1].astype(int)

    # Impute biological zeros in [glucose, bp, skin, insulin, bmi] (columns 1, 2, 3, 4, 5)
    for col in [1, 2, 3, 4, 5]:
        zeros = (X[:, col] == 0)
        non_zero_median = np.median(X[~zeros, col])
        X[zeros, col] = non_zero_median

    features = ['pregnancies', 'glucose', 'blood_pressure', 'skin_thickness', 'insulin', 'bmi', 'dpf', 'age']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    scaler = StandardScaler().fit(X_train)
    X_train_s = scaler.transform(X_train)
    X_test_s = scaler.transform(X_test)

    lr = LogisticRegression(max_iter=1000, random_state=42).fit(X_train_s, y_train)
    rf = RandomForestClassifier(n_estimators=100, max_depth=8, random_state=42).fit(X_train_s, y_train)
    nb = GaussianNB().fit(X_train_s, y_train)

    print(f"Diabetes LR - Accuracy: {accuracy_score(y_test, lr.predict(X_test_s)):.4f}, Recall: {recall_score(y_test, lr.predict(X_test_s)):.4f}")
    print(f"Diabetes RF - Accuracy: {accuracy_score(y_test, rf.predict(X_test_s)):.4f}, Recall: {recall_score(y_test, rf.predict(X_test_s)):.4f}")
    print(f"Diabetes NB - Accuracy: {accuracy_score(y_test, nb.predict(X_test_s)):.4f}, Recall: {recall_score(y_test, nb.predict(X_test_s)):.4f}")

    bundle = {
        'lr': lr,
        'rf': rf,
        'nb': nb,
        'scaler': scaler,
        'features': features
    }
    joblib.dump(bundle, MODELS_DIR / "diabetes_models.joblib")
    print(f"Saved diabetes_models.joblib to {MODELS_DIR}")

if __name__ == "__main__":
    train_heart_models()
    train_diabetes_models()
