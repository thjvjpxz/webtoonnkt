import numpy as np
import easyocr
import cv2
import base64
import requests
from rapidocr_onnxruntime import RapidOCR
import time
from ..config import OCRSPACE_API_LIST


def perform_ocr(image: np.ndarray, methods: list[str] = ["easyocr"]) -> list[dict]:
    """Thực hiện OCR bằng cách sử dụng các phương pháp đã chỉ định."""
    results = []
    for method in methods:
        if method == "easyocr":
            results += detect_text_easy(image)
        elif method == "ocrspace":
            results += detect_text_ocrspace(image)
        elif method == "rapidocr":
            results += detect_text_rapidocr(image)
    return results


def detect_text_ocrspace(image: np.ndarray, max_retries: int = 3, retry_delay: float = 0) -> list[dict]:
    """
    Phát hiện văn bản bằng OCRSpace API với rotation của multiple API keys.

    Args:
        image: Numpy array của ảnh cần OCR
        api_keys: Danh sách các API keys để rotation
        max_retries: Số lần retry tối đa cho mỗi API key (default: 3)
        retry_delay: Thời gian delay giữa các lần retry (seconds, default: 1.0)

    Returns:
        list[dict]: Danh sách các text được phát hiện với format thống nhất
    """
    api_keys = OCRSPACE_API_LIST

    # Chuyển đổi numpy array thành base64
    try:
        success, encoded_image = cv2.imencode('.jpg', image)
        if not success:
            print("Lỗi: Không thể encode ảnh")
            return []

        image_base64 = base64.b64encode(
            encoded_image.tobytes()).decode('utf-8')
        base64_with_header = f"data:image/jpeg;base64,{image_base64}"
    except Exception as e:
        print(f"Lỗi khi chuyển đổi ảnh: {e}")
        return []

    # Chuẩn bị payload cho API request
    payload = {
        'base64Image': base64_with_header,
        'language': 'vnm',  # Tiếng Việt
        'OCREngine': 2,     # Engine 2 tốt hơn cho tiếng Việt
        'scale': True,      # Tự động scale ảnh
        'detectOrientation': True,  # Tự động xoay ảnh
        'isOverlayRequired': True   # Cần overlay để lấy tọa độ
    }

    # Thử từng API key với retry logic
    total_keys = len(api_keys)
    key_index = 0

    for attempt in range(total_keys * max_retries):
        current_api_key = api_keys[key_index]

        try:
            print(
                f"Đang thử API key {key_index + 1}/{total_keys}, lần thử {(attempt // total_keys) + 1}")

            # Gửi request đến OCRSpace API
            response = requests.post(
                'https://api.ocr.space/parse/image',
                data=payload,
                headers={'apikey': current_api_key},
            )

            # Kiểm tra HTTP status code
            if response.status_code == 200:
                result = response.json()

                # Xử lý kết quả thành công
                data = []
                if result and 'ParsedResults' in result:
                    for parsed_result in result['ParsedResults']:
                        if 'TextOverlay' in parsed_result and parsed_result['TextOverlay']:
                            lines = parsed_result['TextOverlay']['Lines']

                            for line in lines:
                                if 'Words' in line:
                                    for word in line['Words']:
                                        # Lấy tọa độ bounding box
                                        left = word['Left']
                                        top = word['Top']
                                        width = word['Width']
                                        height = word['Height']

                                        # Chuyển đổi sang format thống nhất [ymin, xmin, ymax, xmax]
                                        ymin = top
                                        xmin = left
                                        ymax = top + height
                                        xmax = left + width

                                        # Thêm vào kết quả
                                        data.append({
                                            "text_box": [ymin, xmin, ymax, xmax],
                                            "text": word['WordText'].strip(),
                                            "confidence": 1.0  # OCRSpace không trả về confidence score
                                        })

                print(
                    f"OCR thành công với API key {key_index + 1}, phát hiện {len(data)} text regions")
                return data

            elif response.status_code == 403:
                # Rate limit hoặc unauthorized
                try:
                    error_data = response.json()
                    error_message = error_data.get(
                        'ErrorMessage', [response.text])
                except:
                    error_message = [response.text]

                error_details = ' | '.join(error_message) if isinstance(
                    error_message, list) else str(error_message)
                print(f"Lỗi 403 với API key {key_index + 1}: {error_details}")

                # Kiểm tra nếu là rate limit, chuyển sang key tiếp theo
                if any('180 number of times within 3600 seconds' in str(msg) for msg in error_message):
                    print(
                        f"API key {key_index + 1} đã đạt rate limit, chuyển sang key tiếp theo")
                    key_index = (key_index + 1) % total_keys
                    time.sleep(retry_delay)
                    continue
                else:
                    # Lỗi 403 khác (có thể key không hợp lệ), thử key tiếp theo
                    print(
                        f"API key {key_index + 1} có thể không hợp lệ, chuyển sang key tiếp theo")
                    key_index = (key_index + 1) % total_keys
                    time.sleep(retry_delay)
                    continue

            else:
                # Lỗi HTTP khác
                print(
                    f"Lỗi HTTP {response.status_code} với API key {key_index + 1}: {response.text}")
                key_index = (key_index + 1) % total_keys
                time.sleep(retry_delay)
                continue

        except requests.exceptions.Timeout:
            print(f"Timeout khi gọi API với key {key_index + 1}")
            key_index = (key_index + 1) % total_keys
            time.sleep(retry_delay)
            continue

        except requests.exceptions.ConnectionError:
            print(f"Lỗi kết nối với API key {key_index + 1}")
            key_index = (key_index + 1) % total_keys
            time.sleep(retry_delay)
            continue

        except Exception as e:
            print(
                f"Lỗi không xác định khi sử dụng API key {key_index + 1}: {e}")
            key_index = (key_index + 1) % total_keys
            time.sleep(retry_delay)
            continue

    print(
        f"Đã thử hết {total_keys * max_retries} lần với tất cả API keys, không thể thực hiện OCR")
    return []


def detect_text_easy(image: np.ndarray) -> list[dict]:
    """Phát hiện văn bản bằng EasyOCR."""
    # Implementation of EasyOCR

    reader = easyocr.Reader(["vi"])

    result_preprocessed = reader.readtext(
        image,
        paragraph=False,
    )

    # Process the combined results
    data = []
    for detection in result_preprocessed:
        box, text, confidence = detection
        xmin, ymin = map(int, box[0])
        xmax, ymax = map(int, box[2])
        data.append(
            {
                "text_box": [ymin, xmin, ymax, xmax],
                "text": text,
                "confidence": confidence
            }
        )
    return data


def detect_text_rapidocr(image: np.ndarray) -> list[dict]:
    """Phát hiện văn bản bằng RapidOCR."""
    try:
        ocr = RapidOCR()
        result, _ = ocr(image)

        data = []
        if result:
            for detection in result:
                box_points, text, confidence = detection

                x_coords = [point[0] for point in box_points]
                y_coords = [point[1] for point in box_points]

                xmin = int(min(x_coords))
                xmax = int(max(x_coords))
                ymin = int(min(y_coords))
                ymax = int(max(y_coords))

                data.append({
                    "text_box": [ymin, xmin, ymax, xmax],
                    "text": text.strip(),
                    "confidence": confidence
                })

        return data

    except Exception as e:
        print(f"Lỗi khi sử dụng RapidOCR: {e}")
        return []
