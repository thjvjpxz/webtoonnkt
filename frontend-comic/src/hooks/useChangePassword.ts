import { useState } from "react";
import { ChangePasswordRequest } from "@/types/home";
import { changePassword } from "@/services/homeService";
import toast from "react-hot-toast";

export default function useChangePassword() {
  const [formData, setFormData] = useState<ChangePasswordRequest>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Xử lý thay đổi input
  const handleInputChange = (field: keyof ChangePasswordRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Xóa lỗi khi người dùng bắt đầu nhập
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  // Toggle hiển thị mật khẩu
  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  // Validation form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.oldPassword.trim()) {
      newErrors.oldPassword = "Vui lòng nhập mật khẩu hiện tại";
    }

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = "Vui lòng nhập mật khẩu mới";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Mật khẩu mới phải có ít nhất 6 ký tự";
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu mới";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    if (formData.oldPassword === formData.newPassword && formData.oldPassword.trim()) {
      newErrors.newPassword = "Mật khẩu mới phải khác mật khẩu hiện tại";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Xử lý submit form
  const handleSubmit = async (onSuccess?: () => void) => {
    if (!validateForm()) return false;

    setIsLoading(true);
    try {
      const response = await changePassword(formData);

      if (response.status === 200) {
        toast.success("Đổi mật khẩu thành công");
        resetForm();
        onSuccess?.();
        return true;
      } else {
        toast.error(response.message || "Đổi mật khẩu thất bại");
        if (response.message?.includes("mật khẩu hiện tại") || response.message?.includes("old password")) {
          setErrors({ oldPassword: "Mật khẩu hiện tại không đúng" });
        }
        return false;
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi đổi mật khẩu");
      console.error('Lỗi đổi mật khẩu:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      oldPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    setErrors({});
    setShowPasswords({
      oldPassword: false,
      newPassword: false,
      confirmPassword: false
    });
  };

  return {
    formData,
    showPasswords,
    errors,
    isLoading,
    handleInputChange,
    togglePasswordVisibility,
    handleSubmit,
    resetForm,
    validateForm
  };
} 