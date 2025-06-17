import numpy as np
import easyocr
import cv2
import base64
import requests
from rapidocr_onnxruntime import RapidOCR

def perform_ocr(image: np.ndarray, methods: list[str] = ["easyocr"], api_key: dict[str, str] = None) -> list[dict]:
    """Thực hiện OCR bằng cách sử dụng các phương pháp đã chỉ định."""
    results = []
    for method in methods:
        if method == "easyocr":
            results += detect_text_easy(image)
        elif method == "ocrspace":
            results += detect_text_ocrspace(image, api_key.get("ocrspace"))
        elif method == "rapidocr":
            results += detect_text_rapidocr(image)
    return results

def detect_text_ocrspace(image: np.ndarray, api_key: str) -> list[dict]:
    """Phát hiện văn bản bằng OCRSpace API."""
    try:
        # Chuyển đổi numpy array thành bytes
        success, encoded_image = cv2.imencode('.jpg', image)
        if not success:
            return []
        
        # Chuyển đổi thành base64 với header phù hợp
        image_base64 = base64.b64encode(encoded_image.tobytes()).decode('utf-8')
        base64_with_header = f"data:image/jpeg;base64,{image_base64}"
        
        # Chuẩn bị payload cho API request
        payload = {
            'base64Image': base64_with_header,  # Sử dụng base64Image thay vì base64_string
            'language': 'vnm',  # Tiếng Việt
            'OCREngine': 2,     # Engine 2 tốt hơn cho tiếng Việt
            'scale': True,      # Tự động scale ảnh
            'detectOrientation': True,  # Tự động xoay ảnh
            'isOverlayRequired': True   # Cần overlay để lấy tọa độ
        }
        
        # Gửi request đến OCRSpace API
        response = requests.post(
            'https://api.ocr.space/parse/image',
            data=payload,
            headers={'apikey': api_key}
        )
        
        if response.status_code != 200:
            print(f"Lỗi HTTP {response.status_code}: {response.text}")
            return []
        
        result = response.json()
        
        # Xử lý kết quả
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
        
        return data
        
    except Exception as e:
        print(f"Lỗi khi sử dụng OCRSpace: {e}")
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