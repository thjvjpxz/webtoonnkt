import { register } from "@/services/authService";
import { RegisterRequest } from "@/types/auth";
import { useState } from "react";
import toast from "react-hot-toast";

export default function useRegister(onClose: () => void) {
  const [formData, setFormData] = useState<RegisterRequest>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = "Vui lòng nhập tên đăng nhập";
    } else if (formData.username.length < 3) {
      newErrors.username = "Tên đăng nhập phải có ít nhất 3 ký tự";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = "Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await register(formData);

      if (response.status === 200) {
        // Đóng modal và chuyển hướng đến trang verify
        onClose();
        toast.success("Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.");

        // Reset form
        setFormData({ username: "", email: "", password: "", confirmPassword: "" });
        setErrors({});
      } else {
        toast.error(response.message || "Đăng ký thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      setErrors({ general: error instanceof Error ? error.message : "Đăng ký thất bại. Vui lòng thử lại." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ username: "", email: "", password: "", confirmPassword: "" });
    setErrors({});
    setShowPassword(false);
    onClose();
  };

  return {
    errors,
    isLoading,
    formData,
    showPassword,

    handleClose,
    handleSubmit,
    handleInputChange,
    setShowPassword,
  };
}