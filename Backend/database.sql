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
