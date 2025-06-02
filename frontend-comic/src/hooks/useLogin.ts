import { login } from "@/services/authService";
import { LoginRequest } from "@/types/auth";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function useLogin(onClose: () => void) {
  const { login: authLogin } = useAuth();
  const [formData, setFormData] = useState<LoginRequest>({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
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
    if (isLoading) return; // Không cho phép đóng khi đang loading
    setFormData({ username: "", password: "" });
    setErrors({});
    setShowPassword(false);
    onClose();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await login(formData);
      if (response.status === 200 && response.data) {
        // Lưu thông tin user vào AuthContext
        authLogin(response.data);
        toast.success("Đăng nhập thành công!");
        // Đóng modal sau khi đăng nhập thành công
        handleClose();
      } else {
        toast.error(response.message || "Đã xảy ra lỗi");
      }
    } catch (error: unknown) {
      console.log(error);
      toast.error(error instanceof Error ? error.message : "Đã xảy ra lỗi");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    errors,
    handleLogin,
    handleInputChange,
    handleClose,
    showPassword,
    toggleShowPassword,
    formData,
  }
}