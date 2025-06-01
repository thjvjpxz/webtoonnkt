"use client";

import { useState, useEffect, useRef } from "react";
import { UserCreateUpdate, UserModalProps } from "@/types/user";
import { LevelTypeResponse, LevelResponse } from "@/types/level";
import { FiX, FiImage, FiLoader } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface ExtendedUserModalProps extends UserModalProps {
  levelTypes: LevelTypeResponse[];
  levels: LevelResponse[];
  fetchLevelsByType: (levelTypeId: string) => Promise<void>;
  isLoadingLevels: boolean;
}

export default function UserModal({
  user,
  roles,
  levelTypes,
  levels,
  onClose,
  onSave,
  fetchLevelsByType,
  isLoadingLevels,
}: ExtendedUserModalProps) {
  const [formData, setFormData] = useState<UserCreateUpdate>({
    username: "",
    email: "",
    password: "",
    imgUrl: "",
    vip: false,
    active: true,
    roleId: "",
    balance: 0,
    levelId: undefined,
  });

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    roleId: "",
    levelTypeId: "",
    levelId: "",
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedLevelTypeId, setSelectedLevelTypeId] = useState<string>("");

  useEffect(() => {
    if (user) {
      const currentLevelTypeId = user.level?.levelType?.id || "";
      setFormData({
        username: user.username || "",
        email: user.email || "",
        password: "",
        imgUrl: user.imgUrl || "",
        vip: user.vip || false,
        active: user.active || false,
        roleId: user.role?.id || "",
        balance: user.balance || 0,
        levelId: user.level?.id || undefined,
      });
      setPreviewImage(user.imgUrl || "");
      setSelectedLevelTypeId(currentLevelTypeId);
    } else {
      setFormData((prev) => ({
        ...prev,
        levelId: undefined,
      }));
      setSelectedLevelTypeId("");
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (name === "levelTypeId") {
      setSelectedLevelTypeId(value);
      fetchLevelsByType(value);
      setFormData((prev) => ({
        ...prev,
        levelId: undefined,
      }));
      setErrors((prev) => ({ ...prev, levelId: "" }));
    } else if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    if (name in errors) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {
      username: "",
      email: "",
      password: "",
      roleId: "",
      levelTypeId: "",
      levelId: "",
    };

    let isValid = true;

    if (!formData.username.trim()) {
      newErrors.username = "Tên người dùng không được để trống";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email không được để trống";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
      isValid = false;
    }

    if (!user && !formData.password?.trim()) {
      newErrors.password = "Mật khẩu không được để trống";
      isValid = false;
    } else if (!user && formData.password && formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
      isValid = false;
    } else if (user && formData.password && formData.password.length > 0 && formData.password.length < 6) {
      newErrors.password = "Mật khẩu mới phải có ít nhất 6 ký tự";
      isValid = false;
    }

    if (!formData.roleId) {
      newErrors.roleId = "Vui lòng chọn vai trò";
      isValid = false;
    }

    if (selectedLevelTypeId && !formData.levelId) {
      newErrors.levelId = "Vui lòng chọn level";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const submittedData = { ...formData };
      if (user && !submittedData.password) {
        delete submittedData.password;
      }

      await onSave(submittedData, selectedFile || undefined);
    } catch (error) {
      console.error("Lỗi khi lưu người dùng:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl p-6 dark:bg-gray-800 dark:border dark:border-gray-700 my-8 mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            {user ? "Cập nhật người dùng" : "Thêm người dùng mới"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer"
            aria-label="Đóng"
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                  Ảnh đại diện
                </label>
                <div
                  className={`border-2 border-dashed rounded-lg p-4 transition-colors ${isDragging
                    ? "border-green-400 bg-green-50 dark:border-green-600 dark:bg-green-900/20"
                    : "border-gray-300 dark:border-gray-600"
                    }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    id="avatar"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                  />
                  <div className="flex flex-col items-center justify-center">
                    {previewImage ? (
                      <div className="relative w-32 h-32 mb-3 rounded-full overflow-hidden">
                        <Image
                          src={previewImage}
                          alt="Avatar Preview"
                          fill
                          sizes="128px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-32 h-32 mb-3 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 dark:bg-gray-700">
                        <FiImage size={40} />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={handleUploadClick}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md text-sm font-medium transition dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
                    >
                      Chọn ảnh
                    </button>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      hoặc kéo và thả ảnh vào đây
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300"
              >
                Tên người dùng <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.username ? "border-rose-500" : "border-gray-300"
                  }`}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-rose-500">{errors.username}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300"
              >
                Email <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.email ? "border-rose-500" : "border-gray-300"
                  }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-rose-500">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300"
              >
                Mật khẩu {!user && <span className="text-rose-500">*</span>}
                {user && <span className="text-xs text-gray-500 ml-1">(để trống nếu không thay đổi)</span>}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.password ? "border-rose-500" : "border-gray-300"
                    }`}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Ẩn" : "Hiện"}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-rose-500">{errors.password}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="roleId"
                className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300"
              >
                Vai trò <span className="text-rose-500">*</span>
              </label>
              <select
                id="roleId"
                name="roleId"
                value={formData.roleId}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.roleId ? "border-rose-500" : "border-gray-300"
                  }`}
              >
                <option value="">Chọn vai trò</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
              {errors.roleId && (
                <p className="mt-1 text-sm text-rose-500">{errors.roleId}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="balance"
                className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300"
              >
                Số dư
              </label>
              <input
                type="number"
                id="balance"
                name="balance"
                min="0"
                value={formData.balance}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="levelTypeId"
                className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300"
              >
                Loại Level
              </label>
              <select
                id="levelTypeId"
                name="levelTypeId"
                value={selectedLevelTypeId}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.levelTypeId ? "border-rose-500" : "border-gray-300"
                  }`}
              >
                <option value="">Chọn loại level</option>
                {levelTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
              {errors.levelTypeId && (
                <p className="mt-1 text-sm text-rose-500">{errors.levelTypeId}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="levelId"
                className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300"
              >
                Level {isLoadingLevels && <FiLoader className="inline animate-spin ml-1" />}
                {!selectedLevelTypeId && !user?.level?.id && <span className="text-xs text-gray-500 ml-1">(Chọn loại level trước)</span>}
              </label>
              <select
                id="levelId"
                name="levelId"
                value={formData.levelId || ""}
                onChange={handleChange}
                disabled={!selectedLevelTypeId || isLoadingLevels}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed ${errors.levelId ? "border-rose-500" : "border-gray-300"
                  }`}
              >
                <option value="">{isLoadingLevels ? "Đang tải..." : "Chọn level"}</option>
                {levels.map((level) => (
                  <option key={level.id} value={level.id}>
                    {level.name} (Lv. {level.levelNumber})
                  </option>
                ))}
              </select>
              {errors.levelId && (
                <p className="mt-1 text-sm text-rose-500">{errors.levelId}</p>
              )}
            </div>

            <div className="mt-[22px] flex items-center">
              <label htmlFor="vip" className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="vip"
                  name="vip"
                  checked={formData.vip}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">VIP</span>
              </label>
            </div>

            <div className="mt-[22px] flex items-center">
              <label htmlFor="active" className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="active"
                  name="active"
                  checked={formData.active}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">Kích hoạt</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="border-border hover:bg-muted"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isSubmitting ? "Đang xử lý..." : (user ? "Cập nhật" : "Thêm mới")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 