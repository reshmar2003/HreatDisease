import pyodbc
from fastapi import APIRouter

from database import get_connection
from models.responses import BaseResponse

router = APIRouter(prefix="/chart", tags=["Chart"])


HEART_DISEASE_QUERY = """
    SELECT target, COUNT(*) AS patient_count
    FROM dbo.PatientInfo
    GROUP BY target
    ORDER BY target
"""

AGE_DISTRIBUTION_QUERY = """
    SELECT
        CASE
            WHEN age < 30 THEN 'Under 30'
            WHEN age BETWEEN 30 AND 44 THEN '30-44'
            WHEN age BETWEEN 45 AND 59 THEN '45-59'
            ELSE '60+'
        END AS age_group,
        COUNT(*) AS patient_count
    FROM dbo.PatientInfo
    GROUP BY
        CASE
            WHEN age < 30 THEN 'Under 30'
            WHEN age BETWEEN 30 AND 44 THEN '30-44'
            WHEN age BETWEEN 45 AND 59 THEN '45-59'
            ELSE '60+'
        END
"""

CHOLESTEROL_QUERY = """
    SELECT cholesterol_group, [0] AS no_heart_disease, [1] AS heart_disease
    FROM (
        SELECT
            CASE
                WHEN chol < 200 THEN 'Under 200'
                WHEN chol BETWEEN 200 AND 239 THEN '200-239'
                WHEN chol BETWEEN 240 AND 279 THEN '240-279'
                ELSE '280+'
            END AS cholesterol_group,
            target,
            COUNT(*) AS patient_count
        FROM dbo.PatientInfo
        GROUP BY
            CASE
                WHEN chol < 200 THEN 'Under 200'
                WHEN chol BETWEEN 200 AND 239 THEN '200-239'
                WHEN chol BETWEEN 240 AND 279 THEN '240-279'
                ELSE '280+'
            END,
            target
    ) AS grouped
    PIVOT (
        SUM(patient_count) FOR target IN ([0], [1])
    ) AS pivoted
"""

BLOOD_PRESSURE_QUERY = """
    SELECT blood_pressure_group, [0] AS no_heart_disease, [1] AS heart_disease
    FROM (
        SELECT
            CASE
                WHEN trestbps < 120 THEN 'Normal'
                WHEN trestbps BETWEEN 120 AND 129 THEN 'Elevated'
                WHEN trestbps BETWEEN 130 AND 139 THEN 'High 1'
                ELSE 'High 2+'
            END AS blood_pressure_group,
            target,
            COUNT(*) AS patient_count
        FROM dbo.PatientInfo
        GROUP BY
            CASE
                WHEN trestbps < 120 THEN 'Normal'
                WHEN trestbps BETWEEN 120 AND 129 THEN 'Elevated'
                WHEN trestbps BETWEEN 130 AND 139 THEN 'High 1'
                ELSE 'High 2+'
            END,
            target
    ) AS grouped
    PIVOT (
        SUM(patient_count) FOR target IN ([0], [1])
    ) AS pivoted
"""

MAXIMUM_HEART_RATE_QUERY = """
    SELECT heart_rate_group, [0] AS no_heart_disease, [1] AS heart_disease
    FROM (
        SELECT
            CASE
                WHEN thalachh < 100 THEN 'Under 100'
                WHEN thalachh BETWEEN 100 AND 129 THEN '100-129'
                WHEN thalachh BETWEEN 130 AND 159 THEN '130-159'
                ELSE '160+'
            END AS heart_rate_group,
            target,
            COUNT(*) AS patient_count
        FROM dbo.PatientInfo
        GROUP BY
            CASE
                WHEN thalachh < 100 THEN 'Under 100'
                WHEN thalachh BETWEEN 100 AND 129 THEN '100-129'
                WHEN thalachh BETWEEN 130 AND 159 THEN '130-159'
                ELSE '160+'
            END,
            target
    ) AS grouped
    PIVOT (
        SUM(patient_count) FOR target IN ([0], [1])
    ) AS pivoted
"""

CHEST_PAIN_QUERY = """
    SELECT cp AS chest_pain_type, COUNT(*) AS patient_count
    FROM dbo.PatientInfo
    GROUP BY cp
    ORDER BY cp
"""


def execute_chart_query(query: str) -> list[dict]:
    with get_connection() as connection:
        cursor = connection.execute(query)
        columns = [column[0] for column in cursor.description]
        return [dict(zip(columns, row)) for row in cursor.fetchall()]


def chart_response(message: str, query: str) -> BaseResponse:
    try:
        rows = execute_chart_query(query)
    except pyodbc.Error:
        return BaseResponse(
            success=False,
            message="Unable to connect to the database",
            data=None,
        )

    return BaseResponse(success=True, message=message, data=rows)


@router.get("/HeartDiease", response_model=BaseResponse)
def heart_disease_chart() -> BaseResponse:
    return chart_response("Heart disease comparison retrieved", HEART_DISEASE_QUERY)


@router.get("/AgeDistribution", response_model=BaseResponse)
def age_distribution_chart() -> BaseResponse:
    return chart_response("Age distribution retrieved", AGE_DISTRIBUTION_QUERY)


@router.get("/cholesterolAnalysis", response_model=BaseResponse)
def cholesterol_analysis_chart() -> BaseResponse:
    return chart_response("Cholesterol analysis retrieved", CHOLESTEROL_QUERY)


@router.get("/BloodPressureAnalysis", response_model=BaseResponse)
def blood_pressure_analysis_chart() -> BaseResponse:
    return chart_response("Blood pressure analysis retrieved", BLOOD_PRESSURE_QUERY)


@router.get("/MaximumHeartRateAnalysis", response_model=BaseResponse)
def maximum_heart_rate_analysis_chart() -> BaseResponse:
    return chart_response("Maximum heart rate analysis retrieved", MAXIMUM_HEART_RATE_QUERY)


@router.get("/chestPainType", response_model=BaseResponse)
def chest_pain_type_chart() -> BaseResponse:
    return chart_response("Chest pain type analysis retrieved", CHEST_PAIN_QUERY)
