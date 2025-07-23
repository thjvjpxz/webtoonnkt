'use client'

import { useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FiEdit3 } from "react-icons/fi";
import { UserResponse } from "@/types/user";
import useEditProfile from "@/hooks/useEditProfile";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserResponse;
  onProfileUpdated: () => void;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  userProfile,
  onProfileUpdated
}: EditProfileModalProps) {
  const {
    // Data
    levelTypes,
    selectedLevelTypeId,

    // Loading states
    isLoadingLevelTypes,
    isSubmitting,

    // Error state
    errors,

    // Actions
    fetchLevelTypes,
    handleLevelTypeChange,
    handleSubmit,
    resetToInitialState,
    hasChanges
  } = useEditProfile(userProfile);

  // Lấy danh sách level types khi modal mở
  useEffect(() => {
    if (isOpen) {
      fetchLevelTypes();
    }
  }, [isOpen, fetchLevelTypes]);

  // Xử lý submit form
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit(() => {
      onProfileUpdated();
      onClose();
    });
  };

  // Reset form và đóng modal
  const handleClose = () => {
    resetToInitialState();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FiEdit3 className="w-5 h-5" />
            Chỉnh sửa thông tin
          </DialogTitle>
          <DialogDescription>
            Thay đổi loại cấp độ của bạn
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Thông tin hiện tại */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="font-medium mb-2">Thông tin hiện tại:</h4>
            <div className="space-y-1 text-sm">
              <p><span className="text-gray-600 dark:text-gray-400">Tên:</span> {userProfile.username}</p>
              <p><span className="text-gray-600 dark:text-gray-400">Cấp độ:</span> {userProfile.level?.name}</p>
              <p><span className="text-gray-600 dark:text-gray-400">Loại:</span> {userProfile.level?.levelType?.name}</p>
            </div>
          </div>

          {/* Chọn loại cấp độ */}
          <div className="space-y-2">
            <Label htmlFor="levelType">
              Loại cấp độ <span className="text-destructive">*</span>
            </Label>
            <Select
              value={selectedLevelTypeId}
              onValueChange={handleLevelTypeChange}
              disabled={isLoadingLevelTypes || isSubmitting}
            >
              <SelectTrigger className={`w-full ${errors.levelTypeId ? "border-destructive" : ""}`}>
                <SelectValue
                  placeholder={isLoadingLevelTypes ? "Đang tải..." : "Chọn loại cấp độ"}
                />
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
              <p className="text-sm text-destructive">{errors.levelTypeId}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !selectedLevelTypeId || !hasChanges()}
              className="flex-1"
            >
              {isSubmitting ? "Đang cập nhật..." : "Cập nhật"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 