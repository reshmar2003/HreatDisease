import os
from typing import Any, Optional

import pyodbc
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


class LoginRequest(BaseModel):
    username: str
    password: str


class BaseResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Any] = None


app = FastAPI(title="Heart Disease Prediction API")

DATABASE_CONNECTION_STRING = os.getenv(
    "DATABASE_CONNECTION_STRING",
    "DRIVER={ODBC Driver 17 for SQL Server};"
    "SERVER=Reshma\\SQLEXPRESS;"
    "DATABASE=HeartDiseasePrediction;"
    "Trusted_Connection=yes;"
    "Persist Security Info=False;"
    "Pooling=False;"
    "MultipleActiveResultSets=False;"
    "Encrypt=no;"
    "TrustServerCertificate=yes;"
    "Application Name=Heart Disease Prediction API;"
    "Connection Timeout=30;",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", response_model=BaseResponse)
def health_check() -> BaseResponse:
    return BaseResponse(
        success=True,
        message="Heart Disease Prediction API is running",
        data=None,
    )


@app.post("/login/login", response_model=BaseResponse)
def login(payload: LoginRequest) -> BaseResponse:
    query = """
        SELECT TOP 1 username
        FROM dbo.LoginInfo
        WHERE username = ? AND password = ?
    """

    try:
        with pyodbc.connect(DATABASE_CONNECTION_STRING) as connection:
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
