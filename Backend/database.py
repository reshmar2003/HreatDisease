import pyodbc

from config import DATABASE_CONNECTION_STRING


def get_connection() -> pyodbc.Connection:
    return pyodbc.connect(DATABASE_CONNECTION_STRING)
