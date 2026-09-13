from __future__ import annotations

from pathlib import Path

import pandas as pd
from fastapi import APIRouter
from pydantic import BaseModel, Field
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import StratifiedKFold, cross_val_score

from models.responses import BaseResponse


FEATURE_COLUMNS = [
    "age", "sex", "cp", "trestbps", "chol", "fbs", "restecg",
    "thalachh", "exang", "oldpeak", "slope", "ca", "thal",
]
DATASET_PATH = Path(__file__).resolve().parents[1] / "Dataset" / "cleaned_merged_heart_dataset.csv"
router = APIRouter(prefix="/prediction", tags=["Prediction"])
_model: RandomForestClassifier | None = None
_metrics: dict | None = None


class PredictionRequest(BaseModel):
    age: int = Field(ge=1)
    sex: int = Field(ge=0, le=1)
    cp: int = Field(ge=0)
    trestbps: int = Field(ge=1)
    chol: int = Field(ge=1)
    fbs: int = Field(ge=0, le=1)
    restecg: int = Field(ge=0)
    thalachh: int = Field(ge=1)
    exang: int = Field(ge=0, le=1)
    oldpeak: float = Field(ge=0)
    slope: int = Field(ge=0)
    ca: int = Field(ge=0)
    thal: int = Field(ge=0)


def get_model() -> tuple[RandomForestClassifier, dict]:
    global _model, _metrics
    if _model is not None and _metrics is not None:
        return _model, _metrics

    dataset = pd.read_csv(DATASET_PATH)
    dataset = dataset[FEATURE_COLUMNS + ["target"]].dropna()
    features = dataset[FEATURE_COLUMNS]
    target = dataset["target"]
    model = RandomForestClassifier(
        n_estimators=300,
        random_state=42,
        class_weight="balanced",
        n_jobs=1,
    )
    cross_validator = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    cross_validation_scores = cross_val_score(
        model,
        features,
        target,
        cv=cross_validator,
        scoring="accuracy",
        n_jobs=1,
    )
    model.fit(features, target)
    _model = model
    _metrics = {
        "accuracy": round(float(cross_validation_scores.mean()), 4),
        "accuracy_min": round(float(cross_validation_scores.min()), 4),
        "accuracy_max": round(float(cross_validation_scores.max()), 4),
        "folds": int(cross_validator.n_splits),
        "training_rows": int(len(features)),
        "duplicate_rows": int(dataset.duplicated().sum()),
    }
    return _model, _metrics


@router.get("/metrics", response_model=BaseResponse)
def prediction_metrics() -> BaseResponse:
    try:
        _, metrics = get_model()
    except (OSError, ValueError, KeyError):
        return BaseResponse(success=False, message="Unable to train the prediction model", data=None)
    return BaseResponse(success=True, message="Random Forest model metrics retrieved", data=metrics)


@router.post("/predict", response_model=BaseResponse)
def predict_disease(request: PredictionRequest) -> BaseResponse:
    try:
        model, metrics = get_model()
        values = pd.DataFrame([request.model_dump()], columns=FEATURE_COLUMNS)
        prediction = int(model.predict(values)[0])
        probabilities = model.predict_proba(values)[0]
        probability = float(probabilities[prediction])
    except (OSError, ValueError, KeyError):
        return BaseResponse(success=False, message="Unable to run the prediction model", data=None)

    return BaseResponse(
        success=True,
        message="Disease prediction completed",
        data={
            "prediction": prediction,
            "label": "Heart disease likely" if prediction == 1 else "No heart disease likely",
            "confidence": round(probability, 4),
            "model": "Random Forest",
            "accuracy": metrics["accuracy"],
        },
    )