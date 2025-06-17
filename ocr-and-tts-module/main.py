from src.ocr.config import MAX_WORKERS
from src.ocr import extract, get_image_size
from src.tts.prompts import tts_prompt_template
from src.tts import text_to_speech
from fastapi.security import APIKeyHeader
from fastapi.staticfiles import StaticFiles
from typing import List
import requests
from enum import Enum
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException, Depends, Security
import os
from concurrent.futures import ThreadPoolExecutor, as_completed
from functools import partial
from fastapi.middleware.cors import CORSMiddleware
import uvicorn


class OcrRequest(BaseModel):
    image_url: str
    id: str


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


@app.post("/ocr", response_model=OcrResponse, dependencies=[Depends(get_api_key)])
async def ocr(request: OcrRequest):
    """
    API trích xuất văn bản từ ảnh comic

    Args:
        request: Object chứa URL của ảnh cần xử lý

    Returns:
        List[OcrResponse]: Danh sách các vùng văn bản được phát hiện
    """
    try:
        # Sử dụng cùng logic với multi-image để có TTS
        return process_single_image_safe(request.image_url, request.id)
    except Exception as e:
        print(f"Lỗi xử lý OCR: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Lỗi xử lý OCR: {str(e)}")


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
                executor.submit(process_func, img.image_url, img.id): img
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


def process_single_image_safe(image_url: str, id: str) -> OcrResponse:
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

        # Tạo TTS ngay sau khi OCR xong nếu có items hợp lệ
        if result.items and has_valid_text(result.items):
            try:
                os.makedirs("public/tts", exist_ok=True)
                prompt = create_tts_prompt(result.items)
                path_audio = f"public/tts/{result.id}"
                result.has_bubble = True
                if GEMINI_API_KEY:
                    text_to_speech(prompt, GEMINI_API_KEY, path_audio)
                    result.path_audio = f"{path_audio}.wav"
                    print(f"✅ Hoàn thành OCR + TTS cho ảnh {id}")
                else:
                    print(f"⚠️ Không có GEMINI_API_KEY để tạo TTS cho {id}")
            except Exception as e:
                print(f"❌ Lỗi tạo TTS cho {id}: {str(e)}")
                result.path_audio = ""
        elif result.items:
            print(f"⏭️ Bỏ qua TTS cho ảnh {id} - không có text hợp lệ")

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
        ocr_model = "rapidocr"
        if height > 1500 and size_bytes >= 1024 * 1024:
            ocr_model = "easyocr"
        elif height > 1000:
            ocr_model = "ocrspace"

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
    # Sắp xếp items theo panel_id và type
    type_priority = {
        TypeBubble.NARRATION: 1,
        TypeBubble.DIALOGUE: 2,
        TypeBubble.THOUGHT: 3,
        TypeBubble.SOUND_EFFECT: 4,
        TypeBubble.BACKGROUND: 5
    }

    # Sắp xếp theo panel_id trước, sau đó theo type priority
    sorted_items = sorted(ocr_items, key=lambda x: (
        x.panel_id, type_priority.get(x.type, 6)))

    # Format nội dung
    formatted_content = ""
    current_panel = None

    for item in sorted_items:
        if not item.text or not item.text.strip():
            continue

        # Thêm separator giữa các panel
        if current_panel != item.panel_id:
            if current_panel is not None:
                formatted_content += "\n\n"

        # Chỉ lấy nội dung text thuần túy, không thêm prefix
        text = item.text.strip()
        formatted_content += f"{text}\n"

    # Tạo prompt cuối cùng
    prompt = tts_prompt_template.format(
        formatted_content=formatted_content
    )

    return prompt


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
