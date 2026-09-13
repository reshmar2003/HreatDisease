import os


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

CORS_ORIGINS = ["http://localhost:5173", "http://127.0.0.1:5173"]
