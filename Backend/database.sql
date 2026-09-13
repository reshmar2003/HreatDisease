USE [HeartDiseasePrediction]
GO

IF OBJECT_ID('dbo.LoginInfo', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.LoginInfo (
        username varchar(250) NOT NULL,
        password varchar(250) NOT NULL
    )
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.LoginInfo WHERE username = 'Reshma')
BEGIN
    INSERT INTO dbo.LoginInfo (username, password)
    VALUES ('Reshma', 'resh@123')
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.LoginInfo WHERE username = 'Ramani')
BEGIN
    INSERT INTO dbo.LoginInfo (username, password)
    VALUES ('Ramani', 'ramani@123')
END
GO

SELECT * FROM dbo.LoginInfo
GO

IF OBJECT_ID('dbo.PatientInfo', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.PatientInfo (
        Id int NOT NULL PRIMARY KEY,
        Name varchar(250) NOT NULL,
        age int NOT NULL,
        sex int NOT NULL,
        cp int NOT NULL,
        trestbps int NOT NULL,
        chol int NOT NULL,
        fbs int NOT NULL,
        restecg int NOT NULL,
        thalachh int NOT NULL,
        exang int NOT NULL,
        oldpeak DECIMAL(3,1) NOT NULL,
        slope int NOT NULL,
        ca int NOT NULL,
        thal int NOT NULL,
        target int NOT NULL
    )
END
GO

ALTER TABLE dbo.PatientInfo
ALTER COLUMN oldpeak DECIMAL(3,1) NOT NULL
GO
