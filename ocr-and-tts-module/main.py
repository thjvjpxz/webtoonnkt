import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from functools import partial
from concurrent.futures import ThreadPoolExecutor, as_completed
import os
from fastapi import FastAPI, HTTPException, Depends, Security
from pydantic import BaseModel
from enum import Enum
import requests
from typing import List
from fastapi.staticfiles import StaticFiles
from fastapi.security import APIKeyHeader
from src.utils.rate_limiter import rate_limiter
from src.tts import text_to_speech, text_to_speech_v2
from src.tts.prompts import tts_prompt_template
from src.ocr import extract, get_image_size
from src.config import MAX_WORKERS, GOOGLE_APPLICATION_CREDENTIALS

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = GOOGLE_APPLICATION_CREDENTIALS


class OcrRequest(BaseModel):
    image_url: str
    id: str
    use_ai: bool = False


class TypeBubble(Enum):
    DIALOGUE = "dialogue"
    THOUGHT = "thought"
    NARRATION = "narration"
    SOUND_EFFECT = "sound_effect"
    BACKGROUND = "background"


class OcrItem(BaseModel):
    min_y: int
    min_x: int
    max_y: int
    max_x: int
    text: str
    panel_id: str
    type: TypeBubble
    model_used: str


class OcrResponse(BaseModel):
    id: str
    items: list[OcrItem]
    path_audio: str = ""
    has_bubble: bool = False


app = FastAPI()

# Cấu hình phục vụ file tĩnh từ thư mục public
app.mount("/public", StaticFiles(directory="public"), name="public")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_KEY = os.getenv("API_KEY")
API_KEY_NAME = "X-API-KEY"
GEMINI_API_KEY = os.getenv("GOOGLE_AI_API_KEY")

api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)

if API_KEY is None:
    API_KEY = "kimthi123123"


async def get_api_key(api_key: str = Security(api_key_header)):
    if api_key == API_KEY:
        return api_key
    raise HTTPException(status_code=401, detail="Invalid API key")


def has_valid_text(ocr_items: List[OcrItem]) -> bool:
    """
    Kiểm tra xem có text hợp lệ để tạo TTS hay không

    Args:
        ocr_items: Danh sách OCR items

    Returns:
        bool: True nếu có text hợp lệ, False nếu không
    """
    if not ocr_items:
        return False

    for item in ocr_items:
        if not item.text:
            continue

        text = item.text.strip()

        if not text:
            continue

        if text in ["[]", "{}", "null", "None"]:
            continue

        if all(c in " \n\t\r.,!?;:-()[]{}\"'" for c in text):
            continue

        if len(text) < 2:
            continue

        return True

    return False


@app.post("/multi-image-ocr", response_model=List[OcrResponse], dependencies=[Depends(get_api_key)])
async def multi_image_ocr(images: list[OcrRequest]):
    """
    API trích xuất văn bản từ nhiều ảnh comic sử dụng đa luồng (bỏ chunking)

    Args:
        request: Object chứa danh sách các ảnh cần xử lý

    Returns:
        List[OcrResponse]: Danh sách kết quả OCR từ các ảnh
    """
    try:
        import time
        start_time = time.time()
        # Hàm xử lý 1 ảnh an toàn
        process_func = partial(process_single_image_safe)

        results = []

        # Khởi executor với tối đa MAX_WORKERS luồng
        with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
            # Submit tất cả ảnh cùng lúc
            future_to_image = {
                executor.submit(process_func, img.image_url, img.id, img.use_ai): img
                for img in images
            }

            for future in as_completed(future_to_image):
                img = future_to_image[future]
                try:
                    res = future.result()  # OcrResponse cho ảnh đó
                    results.append(res)
                except Exception as e:
                    print(f"Lỗi xử lý ảnh {img.id}: {e}")
                    results.append(OcrResponse(id=img.id, items=[]))

        # Sắp xếp kết quả đúng theo thứ tự input (TTS đã được xử lý trong thread)
        id_to_res = {r.id: r for r in results if r is not None}
        ordered = [id_to_res.get(img.id, OcrResponse(id=img.id, items=[], path_audio=""))
                   for img in images]

        end_time = time.time()
        print(f"Thời gian xử lý batch OCR: {end_time - start_time:.2f} giây")
        return ordered

    except Exception as e:
        print(f"Lỗi xử lý batch OCR: {e}")
        raise HTTPException(status_code=500, detail=f"Lỗi batch OCR: {e}")


def process_single_image_safe(image_url: str, id: str, use_ai: bool) -> OcrResponse:
    """
    Hàm wrapper an toàn cho xử lý đa luồng - bao gồm cả OCR và TTS

    Args:
        image_url: URL của ảnh cần xử lý
        id: ID của ảnh

    Returns:
        OcrResponse: Kết quả OCR và TTS hoặc None nếu có lỗi
    """
    try:
        # Xử lý OCR trước
        result = process_single_image(image_url, id)

        if use_ai:
            # Tạo TTS ngay sau khi OCR xong nếu có items hợp lệ
            if result.items and has_valid_text(result.items):
                try:
                    os.makedirs("public/tts", exist_ok=True)
                    prompt = create_tts_prompt(result.items)
                    path_audio = f"public/tts/{result.id}"
                    result.has_bubble = True
                    if GEMINI_API_KEY:
                        # Hiển thị thông tin rate limit trước khi gọi TTS
                        remaining_tts = rate_limiter.get_remaining_requests(
                            "gemini-2.5-flash-preview-tts")
                        print(f"🎤 TTS requests remaining: {remaining_tts}/10")

                        text_to_speech(prompt, GEMINI_API_KEY, path_audio)
                        result.path_audio = f"{path_audio}.wav"
                        print(f"✅ Hoàn thành OCR + TTS cho ảnh {id}")
                    else:
                        print(
                            f"⚠️ Không có GEMINI_API_KEY để tạo TTS cho {id}")
                except Exception as e:
                    print(f"❌ Lỗi tạo TTS cho {id}: {str(e)}")
                    result.path_audio = ""
            elif result.items:
                print(f"⏭️ Bỏ qua TTS cho ảnh {id} - không có text hợp lệ")
        else:
            if result.items and has_valid_text(result.items):
                path_audio = f"public/tts/{result.id}.wav"
                text_to_speech_v2(normalize(result.items), path_audio)
                result.path_audio = path_audio
                result.has_bubble = True

        return result
    except Exception as e:
        print(f"❌ Lỗi xử lý ảnh {id}: {str(e)}")
        return OcrResponse(id=id, items=[], path_audio="")


def process_single_image(image_url: str, id: str) -> OcrResponse:

    temp_path = f"temp_image_{id}.jpg"
    try:
        resp = requests.get(image_url)
        resp.raise_for_status()
        with open(temp_path, 'wb') as f:
            f.write(resp.content)

        _, height, size_bytes = get_image_size(temp_path)
        ocr_model = "ocrspace"
        if height > 1500 and size_bytes >= 1024 * 1024:
            ocr_model = "easyocr"

        ocr_results = extract(temp_path, ocr=ocr_model)

        items: list[OcrItem] = []
        for result in ocr_results:
            text_box = result.get("text_box", [])
            if len(text_box) >= 4:
                min_y, min_x, max_y, max_x = map(int, text_box[:4])
                # Xác định loại bubble
                bubble_type = TypeBubble.DIALOGUE
                t = result.get("type", "").lower()
                if t == "thought":
                    bubble_type = TypeBubble.THOUGHT
                elif t == "narration":
                    bubble_type = TypeBubble.NARRATION
                elif t == "sound_effect":
                    bubble_type = TypeBubble.SOUND_EFFECT
                elif t == "background":
                    bubble_type = TypeBubble.BACKGROUND

                items.append(
                    OcrItem(
                        min_y=min_y, min_x=min_x,
                        max_y=max_y, max_x=max_x,
                        text=result.get("text"),
                        panel_id=result.get("panel_id"),
                        type=bubble_type,
                        model_used=ocr_model
                    )
                )

        return OcrResponse(id=id, items=items, path_audio="")
    except requests.RequestException as e:
        raise RuntimeError(f"Lỗi khi tải ảnh: {str(e)}")
    except Exception as e:
        raise RuntimeError(f"Lỗi xử lý OCR: {str(e)}")
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)


def normalize(ocr_items: List[OcrItem]) -> str:
    formatted_content = ""
    current_panel = None

    for item in ocr_items:
        if not item.text or not item.text.strip():
            continue

        # Thêm separator giữa các panel
        if current_panel != item.panel_id:
            if current_panel is not None:
                formatted_content += "\n\n"

        # Chỉ lấy nội dung text thuần túy, không thêm prefix
        text = item.text.strip()
        formatted_content += f"{text}\n"

    return formatted_content


def create_tts_prompt(ocr_items: List[OcrItem]) -> str:
    """
    Tạo prompt TTS từ danh sách OCR items

    Args:
        ocr_items: Danh sách các item OCR
        character_name: Tên nhân vật chính
        story_context: Bối cảnh câu chuyện

    Returns:
        str: Prompt đã được format cho TTS
    """
    formatted_content = normalize(ocr_items)
    # Tạo prompt cuối cùng
    prompt = tts_prompt_template.format(
        formatted_content=formatted_content
    )

    return prompt


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
