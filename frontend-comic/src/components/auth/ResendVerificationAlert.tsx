"use client";

import { Button } from "@/components/ui/button";
import { FiMail } from "react-icons/fi";
import { useState, useEffect } from "react";

interface ResendVerificationAlertProps {
  isResending: boolean;
  onResend: () => void;
  className?: string;
  cooldownSeconds?: number; // Thời gian đếm ngược (mặc định 60 giây)
}

export default function ResendVerificationAlert({
  isResending,
  onResend,
  className = "",
  cooldownSeconds = 60,
}: ResendVerificationAlertProps) {
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResend = () => {
    onResend();
    setCountdown(cooldownSeconds); // Bắt đầu đếm ngược sau khi gửi
  };

  const isDisabled = isResending || countdown > 0;

  return (
    <div className={`bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 space-y-3 ${className}`}>
      <div className="flex items-start space-x-3">
        <FiMail className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            Tài khoản của bạn chưa được kích hoạt. Vui lòng kiểm tra email để xác thực tài khoản.
          </p>
          <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
            Không nhận được email? Hãy kiểm tra thư mục spam hoặc gửi lại email xác thực.
          </p>
        </div>
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleResend}
        disabled={isDisabled}
        className="w-full border-yellow-300 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200 hover:bg-yellow-100 dark:hover:bg-yellow-900/30"
      >
        {isResending
          ? "Đang gửi..."
          : countdown > 0
            ? `Gửi lại sau ${countdown}s`
            : "Gửi lại email xác thực"
        }
      </Button>
    </div>
  );
} 