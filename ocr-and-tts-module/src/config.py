import os
from dotenv import load_dotenv
load_dotenv()

OCRSPACE_API_LIST = os.getenv('OCRSPACE_API_KEY', '').split(
    ',') if os.getenv('OCRSPACE_API_KEY') else []
GOOGLE_AI_API_KEY = os.getenv('GOOGLE_AI_API_KEY')
MAX_WORKERS = int(os.getenv('MAX_WORKERS', '4'))
GOOGLE_APPLICATION_CREDENTIALS = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
