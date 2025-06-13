"use client";

import { useState, useEffect, useRef } from "react";
import { Role, UserCreateUpdate, UserResponse } from "@/types/user";
import { LevelTypeResponse, LevelResponse } from "@/types/level";
import { FiImage, FiLoader, FiEye, FiEyeOff } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { chooseImageUrl, formatRole } from "@/utils/string";

interface UserModalProps {
  user: UserResponse | null;
  roles: Role[];
  levelTypes: LevelTypeResponse[];
  levels: LevelResponse[];
  isLoadingLevels: boolean;
  isOpen: boolean;
  onClose: () => void;
  fetchLevelsByType: (levelTypeId: string) => Promise<void>;
  onSave: (userData: UserCreateUpdate, file?: File) => Promise<void>;
}

export default function UserModal({
  user,
  roles,
  levelTypes,
  levels,
  isOpen,
  onClose,
  onSave,
  fetchLevelsByType,
  isLoadingLevels,
}: UserModalProps) {
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
      setFormData({
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
      setPreviewImage(null);
      setSelectedLevelTypeId("");
      setSelectedFile(null);
    }

    setErrors({
      username: "",
      email: "",
      password: "",
      roleId: "",
      levelTypeId: "",
      levelId: "",
    });
    setShowPassword(false);
  }, [user]);

  const handleChange = (name: string, value: string | boolean | number) => {
    if (name === "levelTypeId") {
      setSelectedLevelTypeId(value as string);
      fetchLevelsByType(value as string);
      setFormData((prev) => ({
        ...prev,
        levelId: undefined,
      }));
      setErrors((prev) => ({ ...prev, levelId: "" }));
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {user ? "Cập nhật người dùng" : "Thêm người dùng mới"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Ảnh đại diện */}
          <div>
            <Label className="text-sm font-medium">Ảnh đại diện</Label>
            <Card
              className={`border-2 border-dashed transition-colors cursor-pointer ${isDragging
                ? "border-green-400 bg-green-50 dark:border-green-600 dark:bg-green-900/20"
                : "border-gray-300 dark:border-gray-600"
                }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <CardContent className="p-4">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                />
                <div className="flex flex-col items-center justify-center">
                  {previewImage ? (
                    <div className="relative w-32 h-32 mb-3 rounded-full overflow-hidden">
                      <Image
                        src={chooseImageUrl(previewImage)}
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
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleUploadClick}
                  >
                    Chọn ảnh
                  </Button>
                  <p className="mt-2 text-xs text-muted-foreground">
                    hoặc kéo và thả ảnh vào đây
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tên người dùng */}
            <div className="space-y-2">
              <Label htmlFor="username">
                Tên người dùng <span className="text-red-500">*</span>
              </Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => handleChange("username", e.target.value)}
                className={errors.username ? "border-red-500" : ""}
              />
              {errors.username && (
                <p className="text-sm text-red-500">{errors.username}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Mật khẩu */}
            <div className="space-y-2">
              <Label htmlFor="password">
                Mật khẩu {!user && <span className="text-red-500">*</span>}
                {user && <span className="text-xs text-muted-foreground ml-1">(để trống nếu không thay đổi)</span>}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </Button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Vai trò */}
            <div className="space-y-2">
              <Label htmlFor="roleId">
                Vai trò <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.roleId} onValueChange={(value) => handleChange("roleId", value)}>
                <SelectTrigger className={errors.roleId ? "border-red-500" : ""}>
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {formatRole(role.name)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.roleId && (
                <p className="text-sm text-red-500">{errors.roleId}</p>
              )}
            </div>

            {/* Số dư */}
            <div className="space-y-2">
              <Label htmlFor="balance">Số dư</Label>
              <Input
                id="balance"
                type="number"
                min="0"
                value={formData.balance}
                onChange={(e) => handleChange("balance", Number(e.target.value))}
              />
            </div>

            {/* Loại Level */}
            <div className="space-y-2">
              <Label htmlFor="levelTypeId">Loại Level</Label>
              <Select value={selectedLevelTypeId} onValueChange={(value) => handleChange("levelTypeId", value)}>
                <SelectTrigger className={errors.levelTypeId ? "border-red-500" : ""}>
                  <SelectValue placeholder="Chọn loại level" />
                </SelectTrigger>
                <SelectContent>
                  {levelTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.levelTypeId && (
                <p className="text-sm text-red-500">{errors.levelTypeId}</p>
              )}
            </div>

            {/* Level */}
            <div className="space-y-2">
              <Label htmlFor="levelId">
                Level {isLoadingLevels && <FiLoader className="inline animate-spin ml-1" />}
                {!selectedLevelTypeId && !user?.level?.id && <span className="text-xs text-muted-foreground ml-1">(Chọn loại level trước)</span>}
              </Label>
              <Select
                value={formData.levelId || ""}
                onValueChange={(value) => handleChange("levelId", value)}
                disabled={!selectedLevelTypeId || isLoadingLevels}
              >
                <SelectTrigger className={errors.levelId ? "border-red-500" : ""}>
                  <SelectValue placeholder={isLoadingLevels ? "Đang tải..." : "Chọn level"} />
                </SelectTrigger>
                <SelectContent>
                  {levels.map((level) => (
                    <SelectItem key={level.id} value={level.id}>
                      {level.name} (Lv. {level.levelNumber})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.levelId && (
                <p className="text-sm text-red-500">{errors.levelId}</p>
              )}
            </div>

            {/* VIP */}
            <div className="flex items-center space-x-3">
              <Switch
                id="vip"
                checked={formData.vip}
                onCheckedChange={(checked) => handleChange("vip", checked)}
              />
              <Label htmlFor="vip">VIP</Label>
            </div>

            {/* Kích hoạt */}
            <div className="flex items-center space-x-3">
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => handleChange("active", checked)}
              />
              <Label htmlFor="active">Kích hoạt</Label>
            </div>
          </div>
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang xử lý..." : (user ? "Cập nhật" : "Thêm mới")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 