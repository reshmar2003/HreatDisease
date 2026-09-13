import pyodbc
from fastapi import APIRouter

from database import get_connection
from models.auth import LoginRequest
from models.responses import BaseResponse

router = APIRouter(prefix="/login", tags=["Login"])


@router.post("/login", response_model=BaseResponse)
def login(payload: LoginRequest) -> BaseResponse:
    query = """
        SELECT TOP 1 username
        FROM dbo.LoginInfo
        WHERE username = ? AND password = ?
    """

    try:
        with get_connection() as connection:
            row = connection.execute(query, payload.username, payload.password).fetchone()
    except pyodbc.Error:
        return BaseResponse(
            success=False,
            message="Unable to connect to the database",
            data=None,
        )

    if row is not None:
        return BaseResponse(
            success=True,
            message="Login successful",
            data={"username": row[0]},
        )

    return BaseResponse(
        success=False,
        message="Invalid username or password",
        data=None,
    )
