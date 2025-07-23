"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Mail, CheckCircle, ArrowLeft } from "lucide-react";
import { forgotPassword } from "@/services/authService";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useState } from "react";

interface ForgotPasswordForm {
  email: string;
}

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToLogin: () => void;
}

export default function ForgotPasswordModal({
  isOpen,
  onClose,
  onBackToLogin,
}: ForgotPasswordModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<ForgotPasswordForm>();

  const handleClose = () => {
    reset();
    setIsSuccess(false);
    setSubmittedEmail("");
    onClose();
  };

  const onSubmit = async (data: ForgotPasswordForm) => {
    setIsLoading(true);

    try {
      const result = await forgotPassword(data.email);

      if (result.status === 200) {
        setSubmittedEmail(data.email);
        setIsSuccess(true);
        toast.success("Email đặt lại mật khẩu đã được gửi!");
      } else {
        setError("email", {
          type: "manual",
          message: result.message || "Email không tồn tại trong hệ thống.",
        });
        toast.error(result.message || "Đã xảy ra lỗi. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi quên mật khẩu:", error);
      toast.error("Đã xảy ra lỗi trong quá trình xử lý. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = () => {
    setIsSuccess(false);
    setSubmittedEmail("");
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
        }
      }}
    >
      <DialogContent
        className="sm:max-w-md"
        onPointerDownOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader className="relative">
          <DialogTitle className="text-center text-xl font-semibold">
            {isSuccess ? "Email đã được gửi!" : "Quên mật khẩu"}
          </DialogTitle>
        </DialogHeader>

        {isSuccess ? (
          <div className="space-y-4">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
              <p className="text-sm text-muted-foreground">
                Chúng tôi đã gửi liên kết đặt lại mật khẩu đến email của bạn.
              </p>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                Hướng dẫn:
              </h3>
              <div className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                <p>
                  1. Kiểm tra hộp thư đến của email:{" "}
                  <span className="font-medium">{submittedEmail}</span>
                </p>
                <p>2. Nhấp vào liên kết trong email để đặt lại mật khẩu</p>
                <p>3. Nếu không thấy email, hãy kiểm tra thư mục spam</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button onClick={onBackToLogin} variant="outline" className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại đăng nhập
              </Button>
              <Button onClick={handleResendEmail} className="w-full">
                Gửi lại email
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="text-center mb-4">
              <Mail className="h-16 w-16 mx-auto mb-4 text-primary" />
              <p className="text-sm text-muted-foreground">
                Nhập email của bạn để nhận liên kết đặt lại mật khẩu
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Nhập email của bạn"
                disabled={isLoading}
                {...register("email", {
                  required: "Email là bắt buộc",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Email không hợp lệ",
                  },
                })}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <LoadingSpinner className="h-4 w-4 mr-2" />
                  Đang gửi...
                </>
              ) : (
                "Gửi email đặt lại mật khẩu"
              )}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={onBackToLogin}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                disabled={isLoading}
              >
                ← Quay lại đăng nhập
              </button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
} 