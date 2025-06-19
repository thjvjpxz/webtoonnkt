import json
from PIL import Image
from typing import Dict, List
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold, GenerationConfig
from .prompts import comic_prompt
import re
from datetime import datetime
from ..utils.rate_limiter import rate_limiter


def process_with_ai(
    image: Image, ocr_results: Dict[str, List[Dict]], api_key: str
) -> Dict:
    """Process OCR results with AI."""
    # Chờ nếu cần thiết để tránh rate limit
    rate_limiter.wait_if_needed("gemini-2.0-flash")
    
    model = configure_genai(api_key)
    prompt = comic_prompt.format(ocr_results)
    response = model.generate_content([image, prompt])
    text = response.text

    try:
        # Làm sạch quote marks
        cleaned = re.sub(r"(?<=: )'|'(?=,|\n|\})", '"', text)
        cleaned = re.sub(r'(?<!\\)""', '"', cleaned)

        decoder = json.JSONDecoder(strict=False)
        data = decoder.decode(cleaned)
        return data
    except json.JSONDecodeError as e:
        # write to file log with timestamp
        with open('log.txt', 'a') as f:
            f.write(
                f"{datetime.now().strftime('%Y-%m-%d %H:%M:%S')} - Lỗi parse JSON từ AI response: {str(e)}. Original text: {text}\n\n")
        raise ValueError(
            f"Lỗi parse JSON từ AI response: {str(e)}. Original text: {text[:200]}...") from e


def configure_genai(api_key: str) -> genai.GenerativeModel:
    """Configure and return a GenerativeModel instance."""

    safety_ratings = {
        HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
        HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
        HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
        HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
    }
    genai.configure(api_key=api_key)
    return genai.GenerativeModel(
        model_name="gemini-2.0-flash",
        generation_config=GenerationConfig(
            response_mime_type="application/json", temperature=0, top_k=1, top_p=0
        ),
        safety_settings=safety_ratings,
    )
