import os
from mysql import connector
from dotenv import load_dotenv

# load the env from the .env
load_dotenv()

def get_db_connection():
    try:
        return connector.connect(
            host=os.getenv("DB_HOST"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            database=os.getenv("DB_NAME"),
            port=os.getenv("DB_PORT")
        )
    except connector.Error as err:
        raise Exception(f"Database connection failed: {err}")