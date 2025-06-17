import os
import ocr
import time
import cv2


def main():
    print("🚀 Bắt đầu test ComiQ...")

    example_images_dir = "examples/test"
    if os.path.exists(example_images_dir):
        image_files = [f for f in os.listdir(example_images_dir)
                       if f.lower().endswith(('.png', '.jpg', '.jpeg'))]

        if image_files:
            image_path = os.path.join(example_images_dir, image_files[0])

            width, height, _ = ocr.get_image_size(image_path)

            try:
                time_start = time.time()
                result_google = ocr.extract(image_path, ocr="ocrspace")
                time_end = time.time()
                print(f"Thời gian xử lý: {time_end - time_start} giây")
                print(f"Kích thước ảnh: {width}x{height}")

                for result in result_google:
                    print(result)

                img_new = ocr.draw_bounding_boxes(
                    image_path, result_google, show_text=False)
                cv2.imwrite(f"examples/output/{image_files[0]}", img_new)

            except Exception as e:
                print(f"❌ Lỗi khi xử lý: {str(e)}")
        else:
            print("⚠️  Không tìm thấy ảnh mẫu trong thư mục examples/images")
            print("💡 Bạn có thể thêm ảnh comic vào thư mục đó để test")
    else:
        print("⚠️  Thư mục examples/images không tồn tại")
        print("💡 Bạn có thể tạo thư mục và thêm ảnh comic để test")

    print("\n✨ Hoàn thành test ComiQ!")


if __name__ == "__main__":
    main()
