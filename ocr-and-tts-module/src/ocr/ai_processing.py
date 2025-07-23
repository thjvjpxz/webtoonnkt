import json
from PIL import Image
from typing import Dict, List
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold, GenerationConfig
from .prompts import comic_prompt
import re
from datetime import datetime
from ..utils.rate_limiter import rate_limiter
import demjson3


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
        # Thử parse bằng demjson3 trước
        return demjson3.decode(text)
    except Exception as e1:
        try:
            # Fallback sang JSON chuẩn sau khi làm sạch
            cleaned = clean_json_text(text)
            decoder = json.JSONDecoder(strict=False)
            return decoder.decode(cleaned)
        except json.JSONDecodeError as e2:
            with open('log.txt', 'a', encoding='utf-8') as f:
                f.write(
                    f"{datetime.now().strftime('%Y-%m-%d %H:%M:%S')} - "
                    f"Lỗi parse JSON từ AI (demjson3: {str(e1)} | stdjson: {str(e2)}). "
                    f"Original text: {text}\n\n")
            raise ValueError(
                f"Lỗi parse JSON từ AI (demjson3 + fallback thất bại). Text đầu ra: {text[:200]}...") from e2


def clean_json_text(text: str) -> str:
    """Làm sạch và escape các ký tự đặc biệt trong JSON text."""
    # Loại bỏ BOM hoặc các ký tự không hợp lệ
    text = text.strip().lstrip("\ufeff")

    # Thay thế các cặp nháy đơn thành nháy kép khi bao quanh key hoặc value
    text = re.sub(r"(?<=[:\[,{\s])'([^']*?)'", r'"\1"', text)

    # Chuyển 'None' hoặc None thành null
    text = re.sub(r"\bNone\b", "null", text)

    # Escape dấu \ không hợp lệ (trừ khi đi kèm escape hợp lệ như \n, \t, \")
    text = re.sub(r'\\(?!["\\/bfnrt])', r'\\\\', text)

    # Thay thế các lỗi chuỗi nháy kép liên tiếp không hợp lệ
    text = re.sub(r'""+', '"', text)

    return text


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
