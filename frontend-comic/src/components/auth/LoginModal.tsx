"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FiUser, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
  onLogin: (username: string, password: string) => void;
}

export default function LoginModal({
  isOpen,
  onClose,
  onSwitchToRegister,
  onLogin,
}: LoginModalProps) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Xóa error khi user bắt đầu nhập
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = "Vui lòng nhập tên đăng nhập";
    }

    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onLogin(formData.username, formData.password);
      onClose();
      // Reset form
      setFormData({ username: "", password: "" });
    } catch (error) {
      setErrors({ general: "Đăng nhập thất bại. Vui lòng thử lại." + error });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (isLoading) return; // Không cho phép đóng khi đang loading
    setFormData({ username: "", password: "" });
    setErrors({});
    setShowPassword(false);
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        // Chỉ xử lý khi muốn đóng modal (open = false)
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
            Đăng nhập
          </DialogTitle>
          {/* Close Button */}
          {/* <Button
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-6 w-6 p-0 hover:bg-muted"
            onClick={handleClose}
            disabled={isLoading}
          >
            <FiX className="h-4 w-4" />
          </Button> */}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Field */}
          <div className="space-y-2">
            <Label htmlFor="username">Tên đăng nhập</Label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="username"
                type="text"
                placeholder="Nhập tên đăng nhập"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                className={`pl-10 ${errors.username ? "border-destructive" : ""}`}
                disabled={isLoading}
              />
            </div>
            {errors.username && (
              <p className="text-sm text-destructive">{errors.username}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu</Label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className={`pl-10 pr-10 ${errors.password ? "border-destructive" : ""}`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                disabled={isLoading}
              >
                {showPassword ? (
                  <FiEyeOff className="w-4 h-4" />
                ) : (
                  <FiEye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password}</p>
            )}
          </div>

          {/* General Error */}
          {errors.general && (
            <p className="text-sm text-destructive text-center">{errors.general}</p>
          )}

          {/* Forgot Password */}
          <div className="text-right">
            <button
              type="button"
              className="text-sm text-primary hover:underline"
              disabled={isLoading}
            >
              Quên mật khẩu?
            </button>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>

          {/* Switch to Register */}
          <div className="text-center text-sm text-muted-foreground">
            Chưa có tài khoản?{" "}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-primary hover:underline font-medium cursor-pointer"
              disabled={isLoading}
            >
              Đăng ký ngay
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 