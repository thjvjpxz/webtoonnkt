from typing import List, Dict, Union
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont
import os


def get_image_size(image_path: str) -> tuple[int, int, int]:
    """Lấy kích thước của ảnh. Đơn vị: pixel, kích thước file: bytes"""
    img = cv2.imread(image_path)
    height, width = img.shape[:2]
    size_bytes = os.path.getsize(image_path)
    return width, height, size_bytes


def cv2pil(image: np.ndarray) -> Image.Image:
    """Chuyển đổi ảnh OpenCV đã xử lý thành ảnh PIL."""
    return Image.fromarray(image)


def ai2norm(bounds, height, width):
    """Chuyển đổi tọa độ bounds hỗ trợ AI thành tọa độ ảnh bình thường"""
    for bound in bounds:
        box = bound["text_box"]
        x_min, y_min = int((box[1] / 1000) *
                           width), int((box[0] / 1000) * height)
        x_max, y_max = int((box[3] / 1000) *
                           width), int((box[2] / 1000) * height)
        bound["text_box"] = [y_min, x_min, y_max, x_max]
    return bounds


def norm2ai(bounds, height, width):
    """Chuyển đổi tọa độ ảnh bình thường thành tọa độ bounds hỗ trợ AI"""
    for bound in bounds:
        box = bound["text_box"]
        x_min, y_min = int((box[1] / width) *
                           1000), int((box[0] / height) * 1000)
        x_max, y_max = int((box[3] / width) *
                           1000), int((box[2] / height) * 1000)
        bound["text_box"] = [y_min, x_min, y_max, x_max]
    return bounds


def assign_ids_to_bounds(bounds):
    """Gán ID duy nhất cho các bounds"""
    return [{**bound, "id": str(i)} for i, bound in enumerate(bounds)]


def merge_box_groups(groups, bounds_with_ids):
    """Gộp các bounds thành các bong bóng văn bản, dựa trên phản hồi từ AI"""
    id_to_bound = {bound["id"]: bound for bound in bounds_with_ids}
    merged = []
    for group in groups.get("groups", []):
        box_ids = group.get("box_ids", [])
        text = group.get("cleaned_text", "")
        panel_id = group.get("panel_id", "")

        relevant_boxes = [
            id_to_bound[id]["text_box"] for id in box_ids if id in id_to_bound
        ]

        if relevant_boxes:
            ymin = min(box[0] for box in relevant_boxes)
            xmin = min(box[1] for box in relevant_boxes)
            ymax = max(box[2] for box in relevant_boxes)
            xmax = max(box[3] for box in relevant_boxes)
            merged.append(
                {
                    "text_box": [ymin, xmin, ymax, xmax],
                    "text": text,
                    "panel_id": panel_id,
                    "type": group.get("type", ""),
                }
            )
    return merged


def _get_vietnamese_font(font_size: int = 20) -> ImageFont.ImageFont:
    """
    Lấy font hỗ trợ tiếng Việt.

    Args:
        font_size (int): Kích thước font.

    Returns:
        ImageFont.ImageFont: Font object hỗ trợ tiếng Việt.
    """
    # Danh sách các font có thể hỗ trợ tiếng Việt trên Windows
    vietnamese_fonts = "arial.ttf"

    # Thư mục font trên Windows
    font_dirs = [
        "C:/Windows/Fonts/",
        "/System/Library/Fonts/",  # macOS
        "/usr/share/fonts/",       # Linux
        "/usr/local/share/fonts/"  # Linux
    ]

    # Thử tìm font hỗ trợ tiếng Việt
    for font_dir in font_dirs:
        if os.path.exists(font_dir):
            font_path = os.path.join(font_dir, vietnamese_fonts)
            if os.path.exists(font_path):
                try:
                    return ImageFont.truetype(font_path, font_size)
                except:
                    continue

    # Nếu không tìm thấy font, sử dụng font mặc định
    try:
        return ImageFont.load_default()
    except:
        return ImageFont.load_default()


def _wrap_text_pil(text: str, max_width: int, font: ImageFont.ImageFont) -> List[str]:
    """
    Chia văn bản thành nhiều dòng để phù hợp với chiều rộng tối đa sử dụng PIL.

    Args:
        text (str): Văn bản cần chia.
        max_width (int): Chiều rộng tối đa tính bằng pixel.
        font (ImageFont.ImageFont): Font object.

    Returns:
        List[str]: Danh sách các dòng văn bản.
    """
    if not text:
        return []

    words = text.split()
    if not words:
        return []

    lines = []
    current_line = ""

    # Tạo một draw object tạm để đo kích thước
    temp_img = Image.new('RGB', (1, 1))
    temp_draw = ImageDraw.Draw(temp_img)

    for word in words:
        # Thử thêm từ vào dòng hiện tại
        test_line = current_line + (" " if current_line else "") + word
        bbox = temp_draw.textbbox((0, 0), test_line, font=font)
        test_width = bbox[2] - bbox[0]

        if test_width <= max_width:
            current_line = test_line
        else:
            # Nếu dòng hiện tại không rỗng, lưu nó và bắt đầu dòng mới
            if current_line:
                lines.append(current_line)
                current_line = word
            else:
                # Nếu từ đơn lẻ quá dài, cắt nó
                lines.append(word)

    # Thêm dòng cuối cùng nếu có
    if current_line:
        lines.append(current_line)

    return lines


def _draw_text_on_image(img: np.ndarray, text_lines: List[str], x: int, y: int,
                        font: ImageFont.ImageFont, text_color: tuple, bg_color: tuple) -> np.ndarray:
    """
    Vẽ văn bản tiếng Việt lên ảnh sử dụng PIL.

    Args:
        img (np.ndarray): Ảnh OpenCV.
        text_lines (List[str]): Danh sách các dòng văn bản.
        x (int): Tọa độ x bắt đầu.
        y (int): Tọa độ y bắt đầu.
        font (ImageFont.ImageFont): Font object.
        text_color (tuple): Màu chữ (R, G, B).
        bg_color (tuple): Màu nền (R, G, B).

    Returns:
        np.ndarray: Ảnh đã được vẽ văn bản.
    """
    # Chuyển đổi ảnh OpenCV (BGR) sang PIL (RGB)
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    pil_img = Image.fromarray(img_rgb)
    draw = ImageDraw.Draw(pil_img)

    # Tính toán kích thước văn bản
    line_height = 0
    max_line_width = 0

    for line in text_lines:
        bbox = draw.textbbox((0, 0), line, font=font)
        line_width = bbox[2] - bbox[0]
        current_line_height = bbox[3] - bbox[1]
        max_line_width = max(max_line_width, line_width)
        line_height = max(line_height, current_line_height)

    # Vẽ nền cho văn bản
    padding = 5
    bg_x1 = max(0, x - padding)
    bg_y1 = max(0, y - padding)
    bg_x2 = min(pil_img.width, x + max_line_width + padding)
    bg_y2 = min(pil_img.height, y + len(text_lines)
                * (line_height + 2) + padding)

    draw.rectangle([bg_x1, bg_y1, bg_x2, bg_y2], fill=bg_color)

    # Vẽ từng dòng văn bản
    for i, line in enumerate(text_lines):
        line_y = y + i * (line_height + 2)
        draw.text((x, line_y), line, font=font, fill=text_color)

    # Chuyển đổi lại sang OpenCV (BGR)
    img_bgr = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)
    return img_bgr


def draw_bounding_boxes(
    image: Union[str, np.ndarray],
    bounding_boxes: List[Dict],
    color: tuple = (0, 255, 0),
    thickness: int = 2,
    show_text: bool = True,
    font_size: int = 20,
    max_text_width_ratio: float = 0.8
) -> np.ndarray:
    """
    Vẽ khung bounding box trên ảnh với hỗ trợ xuống dòng và tiếng Việt.

    Args:
        image (str or numpy.ndarray): Đường dẫn đến tệp ảnh hoặc mảng numpy của ảnh.
        bounding_boxes (List[Dict]): Danh sách các bounding box với định dạng:
            [{"text_box": [ymin, xmin, ymax, xmax], "text": "văn bản", ...}, ...]
        color (tuple): Màu của khung (B, G, R). Mặc định là xanh lá (0, 255, 0).
        thickness (int): Độ dày của khung. Mặc định là 2.
        show_text (bool): Có hiển thị văn bản trên khung hay không. Mặc định là True.
        font_size (int): Kích thước font chữ. Mặc định là 20.
        max_text_width_ratio (float): Tỷ lệ chiều rộng tối đa của văn bản so với chiều rộng ảnh. Mặc định là 0.8.

    Returns:
        numpy.ndarray: Ảnh đã được vẽ bounding box.
    """
    # Đọc ảnh nếu đầu vào là đường dẫn
    if isinstance(image, str):
        img = cv2.imread(image)
        if img is None:
            raise ValueError(f"Không thể đọc ảnh từ đường dẫn: {image}")
    else:
        img = image.copy()

    img_height, img_width = img.shape[:2]
    max_text_width = int(img_width * max_text_width_ratio)

    # Lấy font hỗ trợ tiếng Việt
    font = _get_vietnamese_font(font_size)

    # Vẽ từng bounding box
    for i, box_data in enumerate(bounding_boxes):
        if "text_box" not in box_data:
            continue

        text_box = box_data["text_box"]
        ymin, xmin, ymax, xmax = text_box

        # Vẽ khung chữ nhật
        cv2.rectangle(img, (xmin, ymin), (xmax, ymax), color, thickness)

        # Hiển thị văn bản nếu được yêu cầu
        if show_text and "text" in box_data and box_data["text"]:
            text = box_data["text"]

            # Chia văn bản thành nhiều dòng
            text_lines = _wrap_text_pil(text, max_text_width, font)

            if not text_lines:
                continue

            # Xác định vị trí bắt đầu vẽ văn bản
            text_start_x = max(xmin, 0)
            # Đặt văn bản phía trên bounding box
            text_start_y = max(ymin - 50, 30)

            # Đảm bảo văn bản không vượt quá biên của ảnh
            if text_start_x + max_text_width > img_width:
                text_start_x = max(0, img_width - max_text_width - 10)

            # Xác định màu nền và màu chữ (chuyển đổi từ BGR sang RGB)
            bg_color_rgb = (255, 255, 255) if sum(color) > 384 else (0, 0, 0)
            text_color_rgb = (0, 0, 0) if bg_color_rgb == (
                255, 255, 255) else (255, 255, 255)

            # Vẽ văn bản sử dụng PIL
            img = _draw_text_on_image(img, text_lines, text_start_x, text_start_y,
                                      font, text_color_rgb, bg_color_rgb)

    return img
