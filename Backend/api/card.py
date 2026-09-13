import pyodbc
from fastapi import APIRouter

from database import get_connection
from models.responses import BaseResponse

router = APIRouter(prefix="/card", tags=["Card"])


def get_patient_count(where_clause: str = "") -> int:
    query = f"SELECT COUNT(*) FROM dbo.PatientInfo {where_clause}"

    with get_connection() as connection:
        return int(connection.execute(query).fetchone()[0])


def count_response(message: str, where_clause: str = "") -> BaseResponse:
    try:
        count = get_patient_count(where_clause)
    except pyodbc.Error:
        return BaseResponse(
            success=False,
            message="Unable to connect to the database",
            data=None,
        )

    return BaseResponse(
        success=True,
        message=message,
        data={"count": count},
    )


@router.get("/totalPatient", response_model=BaseResponse)
def total_patients() -> BaseResponse:
    return count_response("Total patient count retrieved")


@router.get("/NoHeartDieases", response_model=BaseResponse)
def patients_without_heart_disease() -> BaseResponse:
    return count_response(
        "Patients without heart disease count retrieved",
        "WHERE target = 0",
    )


@router.get("/HeartDieases", response_model=BaseResponse)
def patients_with_heart_disease() -> BaseResponse:
    return count_response(
        "Patients with heart disease count retrieved",
        "WHERE target = 1",
    )
