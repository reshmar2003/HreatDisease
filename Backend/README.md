# Heart Disease Prediction API

## Run locally

```powershell
cd Backend
python -m pip install -r requirements.txt
python -m uvicorn main:app --reload
```

The login endpoint is `POST http://localhost:8000/login/login`.

Patient summary endpoints:

- `GET http://localhost:8000/card/totalPatient`
- `GET http://localhost:8000/card/NoHeartDieases` for `target = 0`
- `GET http://localhost:8000/card/HeartDieases` for `target = 1`

Each card endpoint returns a base response with the count in `data.count`.

The backend connects to the local SQL Server instance `Reshma\SQLEXPRESS` and database `HeartDiseasePrediction` using Windows authentication. It looks up credentials in `dbo.LoginInfo` with `username` and `password` columns. The supplied schema and seed records are in [database.sql](database.sql). Set `DATABASE_CONNECTION_STRING` to override the default connection string.

The Microsoft ODBC Driver 17 for SQL Server must be installed on the machine running the backend.

Example payload:

```json
{
  "username": "Reshma",
  "password": "resh@123"
}
```
