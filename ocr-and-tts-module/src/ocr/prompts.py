comic_prompt = '''
Analyze the comic image, the provided OCR text locations, and the AI text extraction result carefully. Your task is to group the OCR-detected word boxes into coherent text bubbles or captions within comic panels, while also cleaning and correcting OCR errors. Pay special attention to the necessity of including background text and sound effects.

Key Instructions:

1. Word Grouping and Text Cleaning:
   - Group individual word boxes (identified by their IDs) into complete text bubbles or captions.
   - **Language Filter: Only process and return Vietnamese text. Completely ignore and exclude any text in other languages (English, Chinese, Japanese, etc.).**
   - **Before any further processing, replace all newline characters (`\n`) in the OCR text with a single space.** Then clean and correct the text to accurately represent the text in the image.
   - Fix common OCR errors such as misrecognized characters, incorrectly split or joined words, misinterpreted punctuation, and case errors.

2. Panel and Bubble Identification:
   - Assign a unique panel number to each group.
   - Within each panel, assign a unique text bubble or caption number.

3. Text Reconstruction:
   - Provide the complete, cleaned, and corrected text for each group as it should appear in the image.
   - Ensure the text is coherent, grammatically correct, and matches the content visible in the comic.
   - **Do not include any newline characters** in your output; all lines should be joined into a single string.

4. Spatial and Visual Analysis:
   - Use the spatial relationships between word boxes to determine groupings.
   - Consider the visual layout of the comic, including panel borders and bubble shapes.

5. **STRICT Advertisement and Promotional Content Exclusion:**
   - **COMPLETELY EXCLUDE ALL ADVERTISEMENT AND PROMOTIONAL TEXT** including but not limited to:
     * Any text containing website URLs or domain names (e.g., "TRUYENQQQ.COM", "BAOTANGTRUYENVIP.COM", "TOPTRUYENG8.INFO")
     * Promotional messages like "TRUY CẬP NGAY...", "HÃY NHẤN VÀO...", "SANG WEB NHÓM DỊCH..."
     * Support requests like "ĐỂ ỦNG HỘ NHÓM DỊCH", "ỦNG HỘ WEB CÓ KINH PHÍ"
     * Game advertisements like "CHƠI GAME CÙNG...", "NHẬN NGAY... VND"
     * Update notifications like "CẬP NHẬT CHƯƠNG MỚI SỚM NHẤT"
     * Copyright notices like "TRUYỆN ĐĂNG TẠI...", "CÁC WEB KHÁC ĐỀU LÀ ĂN CẮP"
     * Translation group credits like "TRUYỆN ĐƯỢC THỰC HIỆN BỞI..."
     * Any text encouraging clicks on ads like "NHẤN VÀO QUẢNG CÁO"
     * Publisher information, watermarks, or promotional overlays
     * Social media handles, promotional links, or brand logos
   - **ZERO TOLERANCE POLICY: If text contains ANY promotional, advertising, or website-related content, exclude it entirely.**
   - **RED FLAGS: Automatically exclude any text containing:**
     * Website domains (.com, .info, .net, etc.)
     * Words like "TRUY CẬP", "ỦNG HỘ", "QUẢNG CÁO", "WEB", "TRANG", "NHÓM DỊCH"
     * Monetary amounts with "VND" or currency symbols
     * Phrases about "reading early" or "latest chapters"
   - Focus ONLY on actual story content: character dialogue, thoughts, narration, and essential story elements.

6. Selective Inclusion of Background Text and Sound Effects:
   - Include background text (signs, posters, etc.) ONLY if it is crucial for understanding the story or context of the comic.
   - Include sound effects ONLY if they are integral to the narrative or significantly impact the scene's interpretation.
   - If background text or sound effects are purely decorative or do not add meaningful information to the story, DO NOT include them in the groupings.
   - When in doubt, err on the side of exclusion for background text and sound effects.

7. Text Types and Styles:
   - Dialogue: Usually in speech bubbles with a pointer to the speaker.
   - Thoughts: Often in cloud-like bubbles or italicized text.
   - Narration: Typically in rectangular boxes, often at the top or bottom of panels.
   - Sound Effects (if crucial): Can be stylized, vary in size, and placed near the source of the sound.
   - Background Text (if crucial): Signs, posters, or other environmental text within the comic world that impacts the story.

8. Accuracy Priority:
   - Prioritize accuracy in grouping, text reconstruction, and error correction.
   - If uncertain about a correction or inclusion, provide your best judgment but flag it in the notes.

OCR Text Locations:
```json
{0}
```

Output Format:
{{
  "groups": [
    {{
      "panel_id": "1",
      "text_bubble_id": "1-1",
      "box_ids": ["1", "2", "3"],
      "original_text": """The OCR output before cleaning""",
      "cleaned_text": """The corrected and cleaned text""",
      "type": "dialogue|thought|narration|sound_effect|background",
      "style": "normal|emphasized|angled|split",
      "notes": "Justification for inclusion if background or sound effect, any significant corrections or uncertainties|none"
    }},
    ...
  ]
}}

Additional Guidelines:
- Respect panel boundaries: Never group text from different panels.
- Maintain bubble integrity: Each group should correspond to a single text bubble, caption, or crucial sound effect/background text element.
- Use context clues to resolve ambiguities in text order, bubble assignment, or OCR errors.
- **ABSOLUTE RULE: Exclude ALL promotional, advertising, website, and branding content without exception.**
- **Language Requirement: Only process Vietnamese text. Ignore all text in other languages (English, Chinese, Japanese, Korean, etc.).**
- For included sound effects or background text, describe their significance to the story in the "notes" field.
- If you make significant corrections to the OCR text, briefly explain your reasoning in the "notes" field.
- Be particularly selective with sound effects and background text. Only include them if they are necessary for understanding the comic's narrative or context.
- **FINAL CHECK: Before including any text, ask yourself: "Is this part of the actual comic story, or is it promotional/advertising content?" If there's any doubt, exclude it.**

Analyze the image and OCR data thoroughly to produce accurate and contextually appropriate groupings with cleaned and corrected text that reflects ONLY the comic's essential narrative elements. 
**CRITICAL: Completely ignore and exclude any advertisement text, promotional content, brand logos, website URLs, or publisher information.**
**IMPORTANT: This comic is in Vietnamese. Only process and return Vietnamese text. Completely ignore any text in other languages (English, Chinese, Japanese, Korean, etc.).**
**ZERO TOLERANCE: Any text that promotes websites, asks for support, mentions money/VND, or contains promotional language must be completely excluded.**
If sound effects and background text are purely decorative or do not add meaningful information, exclude them from your groupings.
Return only valid JSON. Never emit raw newlines inside string values—use \\n escapes instead.
'''

