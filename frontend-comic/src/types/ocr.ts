export interface OcrRequest {
  id: string
  image_url: string
}

export enum TypeBubble {
  DIALOGUE = 'dialogue',
  THOUGHT = 'thought',
  NARRATION = 'narration',
  SOUND_EFFECT = 'sound_effect',
  BACKGROUND_TEXT = 'background_text',
}

export interface OcrItem {
  min_y: number
  min_x: number
  max_y: number
  max_x: number
  text: string
  panel_id: string
  type: TypeBubble
  model_used: string
}

export interface OcrResponse {
  id: string
  items: OcrItem[]
}

export interface OcrAndTtsRequest {
  id: string
  ocr_items: string
}