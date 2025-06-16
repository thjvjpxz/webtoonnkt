import os

OCRSPACE_API_KEY = os.getenv('OCRSPACE_API_KEY')
GOOGLE_AI_API_KEY = os.getenv('GOOGLE_AI_API_KEY')
MAX_WORKERS = int(os.getenv('MAX_WORKERS', '4'))
