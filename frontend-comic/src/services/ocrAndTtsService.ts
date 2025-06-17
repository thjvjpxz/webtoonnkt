import { OcrAndTtsRequest, OcrRequest, OcrResponse } from "@/types/ocr";
import axios from "axios";
import { fetchApi } from "./api";

const OCR_BASE_URL = process.env.NEXT_PUBLIC_OCR_BASE_URL;
const OCR_API_KEY = process.env.NEXT_PUBLIC_OCR_API_KEY;

const axiosInstance = axios.create({
  baseURL: OCR_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': OCR_API_KEY,
  },
});

export const ocrService = {
  multiImageOcr: async (images: OcrRequest[]) => {
    const url = `/multi-image-ocr`
    const response = await axiosInstance.post<OcrResponse[]>(url, images);
    return response.data;
  }
}

export const ttsService = {
  ocrAndTts: async (ocrAndTtsRequest: OcrAndTtsRequest[]) => {
    const url = `/ocr-tts`
    const response = await fetchApi<null>(url, {
      method: 'POST',
      data: ocrAndTtsRequest,
    })
    return response;
  }
}