import { useState, useEffect, useCallback } from "react";
import { UserResponse } from "@/types/user";
import { LevelTypeResponse } from "@/types/level";
import { getAllLevelTypes } from "@/services/levelTypeService";
import { updateProfile } from "@/services/homeService";
import toast from "react-hot-toast";

export default function useEditProfile(userProfile: UserResponse | null) {
  const [levelTypes, setLevelTypes] = useState<LevelTypeResponse[]>([]);
  const [selectedLevelTypeId, setSelectedLevelTypeId] = useState<string>("");

  const [isLoadingLevelTypes, setIsLoadingLevelTypes] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form về trạng thái ban đầu
  const resetToInitialState = useCallback(() => {
    if (userProfile?.level?.levelType) {
      setSelectedLevelTypeId(userProfile.level.levelType.id || "");
    } else {
      setSelectedLevelTypeId("");
    }
    setErrors({});
  }, [userProfile]);

  // Set initial values khi userProfile thay đổi
  useEffect(() => {
    resetToInitialState();
  }, [resetToInitialState]);

  // Lấy danh sách level types
  const fetchLevelTypes = useCallback(async () => {
    setIsLoadingLevelTypes(true);
    try {
      const response = await getAllLevelTypes();
      if (response.status === 200 && response.data) {
        setLevelTypes(response.data);
      } else {
        toast.error("Không thể tải danh sách loại cấp độ");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi tải danh sách loại cấp độ");
      console.error('Lỗi fetch level types:', error);
    } finally {
      setIsLoadingLevelTypes(false);
    }
  }, []);

  // Xử lý thay đổi level type
  const handleLevelTypeChange = (levelTypeId: string) => {
    setSelectedLevelTypeId(levelTypeId);

    // Clear error khi user thay đổi
    if (errors.levelTypeId) {
      setErrors(prev => ({ ...prev, levelTypeId: "" }));
    }
  };

  // Validation form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedLevelTypeId.trim()) {
      newErrors.levelTypeId = "Vui lòng chọn loại cấp độ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Xử lý submit form
  const handleSubmit = async (onSuccess?: () => void) => {
    if (!validateForm()) return false;

    setIsSubmitting(true);
    try {
      const response = await updateProfile({ levelTypeId: selectedLevelTypeId });

      if (response.status === 200) {
        toast.success("Cập nhật thông tin thành công");
        resetToInitialState();
        onSuccess?.();
        return true;
      } else {
        toast.error(response.message || "Cập nhật thông tin thất bại");
        return false;
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi cập nhật thông tin");
      console.error('Lỗi update profile:', error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if there are changes from initial state
  const hasChanges = () => {
    if (!userProfile?.level?.levelType) return false;
    return selectedLevelTypeId !== userProfile.level.levelType.id;
  };

  return {
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
    validateForm,
    hasChanges
  };
} 