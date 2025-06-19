import os
from pathlib import Path
from google.cloud import texttospeech as tts


def text_to_speech_v2(input_text: str, output_path: str):
    # 1. Khởi tạo client
    client = tts.TextToSpeechClient()

    # 2. Chọn nội dung cần chuyển
    synthesis_input = tts.SynthesisInput(text=input_text)

    # 3. Chọn giọng đọc
    voice = tts.VoiceSelectionParams(
        language_code="vi-VN",
        ssml_gender=tts.SsmlVoiceGender.NEUTRAL,
    )

    # 4. Chọn định dạng file đầu ra
    audio_config = tts.AudioConfig(
        audio_encoding=tts.AudioEncoding.LINEAR16
    )

    # 5. Gửi request và nhận response
    response = client.synthesize_speech(
        input=synthesis_input,
        voice=voice,
        audio_config=audio_config
    )

    # 6. Tạo thư mục nếu chưa tồn tại
    output_dir = Path(output_path).parent
    output_dir.mkdir(parents=True, exist_ok=True)

    # 7. Ghi file wav
    with open(output_path, "wb") as out:
        out.write(response.audio_content)
