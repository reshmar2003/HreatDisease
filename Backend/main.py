from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.card import router as card_router
from api.login import router as login_router
from config import CORS_ORIGINS
from models.responses import BaseResponse


app = FastAPI(title="Heart Disease Prediction API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(login_router)
app.include_router(card_router)


@app.get("/", response_model=BaseResponse)
def health_check() -> BaseResponse:
    return BaseResponse(
        success=True,
        message="Heart Disease Prediction API is running",
        data=None,
    )


