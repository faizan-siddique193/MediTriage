import psycopg2
from dotenv import load_dotenv
import os

# Load environment variables from .env
load_dotenv()

# Fetch variables
DATABASE_URL = os.getenv("DATABASE_URL")

# Connect to the database
# Note: This will raise an error if DATABASE_URL is not set or password is placeholder.
connection = None
if DATABASE_URL and 'YOUR-PASSWORD' not in DATABASE_URL:
    connection = psycopg2.connect(DATABASE_URL)
else:
    # Do not attempt to connect when placeholder is present
    print('DATABASE_URL not configured or contains placeholder. Set a real DATABASE_URL to connect.')
