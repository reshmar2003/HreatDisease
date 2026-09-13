import pyodbc
from fastapi import APIRouter
from pydantic import BaseModel, Field

from database import get_connection
from models.responses import BaseResponse

router = APIRouter(prefix="/card", tags=["Card"])


class PatientListRequest(BaseModel):
    pageno: int = Field(ge=1)
    pagecount: int = Field(ge=1, le=100)


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


@router.post("/patientList", response_model=BaseResponse)
def patient_list(request: PatientListRequest) -> BaseResponse:
    offset = (request.pageno - 1) * request.pagecount
    query = """
        SELECT Name AS name, age, sex, target
        FROM dbo.PatientInfo
        ORDER BY Id
        OFFSET ? ROWS FETCH NEXT ? ROWS ONLY
    """

    try:
        with get_connection() as connection:
            cursor = connection.execute(query, offset, request.pagecount)
            columns = [column[0] for column in cursor.description]
            patients = [dict(zip(columns, row)) for row in cursor.fetchall()]
            total = int(connection.execute("SELECT COUNT(*) FROM dbo.PatientInfo").fetchone()[0])
    except pyodbc.Error:
        return BaseResponse(
            success=False,
            message="Unable to connect to the database",
            data=None,
        )

    return BaseResponse(
        success=True,
        message="Patient list retrieved",
        data={
            "patients": patients,
            "total": total,
            "pageno": request.pageno,
            "pagecount": request.pagecount,
        },
    )
