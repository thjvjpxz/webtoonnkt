import cv2
from typing import List, Union
from .ocr import perform_ocr
from .ai_processing import process_with_ai
from .preprocessing import preprocess_image
from .utils import ai2norm, norm2ai, merge_box_groups, assign_ids_to_bounds, cv2pil
from ..config import GOOGLE_AI_API_KEY
from ..utils.rate_limiter import rate_limiter
import time

AVAILABLE_OCR = ["easyocr", "ocrspace", "rapidocr"]


def extract(
        image: Union[str], ocr: Union[str, List[str]] = "easyocr"
):
    """
    Trích xuất văn bản từ ảnh đã cho bằng cách sử dụng phương pháp OCR đã chỉ định và xử lý với AI.

    Args:
        image (str or numpy.ndarray): Đường dẫn đến tệp ảnh hoặc mảng numpy của ảnh.
        ocr (str or list): Phương pháp OCR để sử dụng. Có thể là "easyocr", "ocrspace", hoặc một danh sách chứa cả hai.

    Returns:
        dict: Dữ liệu đã xử lý chứa các văn bản đã trích xuất và vị trí của chúng.
    """

    if GOOGLE_AI_API_KEY is None:
        raise ValueError("GOOGLE_AI_API_KEY chưa được cập nhật")

    if isinstance(image, str):
        image = cv2.imread(image)
    processed_image = preprocess_image(image)
    height, width = processed_image.shape[:2]

    if isinstance(ocr, str):
        ocr = [ocr]
    ocr = list(filter(lambda x: x in AVAILABLE_OCR, ocr))

    if len(ocr) == 0:
        raise ValueError(
            f"Phương pháp OCR đã cung cấp không hợp lệ, Các phương pháp OCR có sẵn:{AVAILABLE_OCR}"
        )

    time_start = time.time()
    ocr_results = perform_ocr(processed_image, ocr)
    time_end = time.time()
    print(f"Thời gian xử lý OCR: {time_end - time_start} giây")

    if len(ocr_results) == 0:
        raise ValueError("Không tìm thấy văn bản trong ảnh.")

    ocr_results = norm2ai(ocr_results, height, width)
    ocr_bound_ids = assign_ids_to_bounds(ocr_results)

    # Hiển thị thông tin rate limit trước khi gọi AI
    remaining_ocr = rate_limiter.get_remaining_requests("gemini-2.0-flash")
    print(f"🤖 OCR AI requests remaining: {remaining_ocr}/1000")

    predicted_groups = process_with_ai(
        cv2pil(processed_image), ocr_bound_ids, GOOGLE_AI_API_KEY)

    results = merge_box_groups(predicted_groups, ocr_bound_ids)
    final_results = ai2norm(results, height, width)

    return final_results
