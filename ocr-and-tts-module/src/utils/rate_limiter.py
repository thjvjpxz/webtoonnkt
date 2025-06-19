import time
import threading
from typing import Dict, Optional
from datetime import datetime, timedelta


class RateLimiter:
    """
    Quản lý rate limiting đơn giản cho Gemini models
    Dựa trên thông số:
    - Gemini 2.0 Flash: 1000 RPM
    - Gemini 2.5 Flash Preview TTS: 10 RPM
    """
    
    def __init__(self):
        self._locks = {}
        self._request_times = {}
        
        # Cấu hình rate limits (requests per minute)
        self._limits = {
            "gemini-2.0-flash": 1000,  # 1000 RPM
            "gemini-2.5-flash-preview-tts": 10  # 10 RPM
        }
        
        # Khởi tạo locks và request_times cho mỗi model
        for model in self._limits.keys():
            self._locks[model] = threading.Lock()
            self._request_times[model] = []
    
    def wait_if_needed(self, model_name: str) -> None:
        """
        Chờ nếu cần thiết để tránh vượt rate limit
        
        Args:
            model_name: Tên model ("gemini-2.0-flash" hoặc "gemini-2.5-flash-preview-tts")
        """
        if model_name not in self._limits:
            return
        
        with self._locks[model_name]:
            now = datetime.now()
            minute_ago = now - timedelta(minutes=1)
            
            # Loại bỏ các request cũ hơn 1 phút
            self._request_times[model_name] = [
                req_time for req_time in self._request_times[model_name]
                if req_time > minute_ago
            ]
            
            # Kiểm tra nếu đã đạt limit
            if len(self._request_times[model_name]) >= self._limits[model_name]:
                # Tính thời gian cần chờ
                oldest_request = min(self._request_times[model_name])
                wait_time = 60 - (now - oldest_request).total_seconds()
                
                if wait_time > 0:
                    print(f"⏳ Rate limit reached for {model_name}. Waiting {wait_time:.1f}s...")
                    time.sleep(wait_time)
                    
                    # Cập nhật lại thời gian sau khi chờ
                    now = datetime.now()
                    minute_ago = now - timedelta(minutes=1)
                    self._request_times[model_name] = [
                        req_time for req_time in self._request_times[model_name]
                        if req_time > minute_ago
                    ]
            
            # Ghi nhận request mới
            self._request_times[model_name].append(now)
    
    def get_remaining_requests(self, model_name: str) -> int:
        """
        Lấy số request còn lại trong phút hiện tại
        
        Args:
            model_name: Tên model
            
        Returns:
            int: Số request còn lại
        """
        if model_name not in self._limits:
            return float('inf')
        
        with self._locks[model_name]:
            now = datetime.now()
            minute_ago = now - timedelta(minutes=1)
            
            # Loại bỏ các request cũ hơn 1 phút
            self._request_times[model_name] = [
                req_time for req_time in self._request_times[model_name]
                if req_time > minute_ago
            ]
            
            return max(0, self._limits[model_name] - len(self._request_times[model_name]))


# Global rate limiter instance
rate_limiter = RateLimiter() 