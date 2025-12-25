import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    
    MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
    DB_NAME = "netflix_db"
    DEBUG = os.getenv('FLASK_ENV') == 'development'
    SECRET_KEY = os.getenv('SECRET_KEY')