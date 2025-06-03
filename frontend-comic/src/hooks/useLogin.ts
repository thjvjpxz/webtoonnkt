import { LoginRequest } from "@/types/auth";
import { useState } from "react";
import { useAuthState } from "@/hooks/useAuthState";

export default function useLogin(onClose: () => void) {
  const { login, isSubmitting } = useAuthState();
  const [formData, setFormData] = useState<LoginRequest>({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  }

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

  const handleInputChange = (field: keyof LoginRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Xóa error khi user bắt đầu nhập
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleClose = () => {
    if (isSubmitting) return; // Không cho phép đóng khi đang loading
    setFormData({ username: "", password: "" });
    setErrors({});
    setShowPassword(false);
    onClose();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const success = await login(formData);
    if (success) {
      handleClose();
    }
  };

  return {
    isLoading: isSubmitting,
    errors,
    handleLogin,
    handleInputChange,
    handleClose,
    showPassword,
    toggleShowPassword,
    formData,
  }
}