'use client'

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { updateAvatar } from "@/services/homeService";
import { getUserFromLocalStorage } from "@/utils/authUtils";
import { chooseImageUrl } from "@/utils/string";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { FiImage, FiUpload, FiX } from "react-icons/fi";

interface ChangeAvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatar?: string;
  onAvatarUpdated: () => void;
}

export default function ChangeAvatarModal({
  isOpen,
  onClose,
  currentAvatar,
  onAvatarUpdated
}: ChangeAvatarModalProps) {

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Xử lý chọn file
  const handleFileSelect = useCallback((file: File) => {
    // Kiểm tra loại file
    if (!file.type.startsWith('image/')) {
      setError('Vui lòng chọn file ảnh hợp lệ (JPG, PNG, GIF, WebP)');
      return;
    }

    // Kiểm tra kích thước file (tối đa 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Kích thước file không được vượt quá 5MB');
      return;
    }

    setError(null);
    setSelectedFile(file);

    // Tạo preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }, []);

  // Xử lý click vào input file
  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  // Xử lý thay đổi input file
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // Xử lý drag & drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  // Xóa file đã chọn
  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Xử lý upload
  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      setError(null);

      const response = await updateAvatar(selectedFile);

      if (response.status === 200 && response.message) {
        onAvatarUpdated();
        handleClose();
        const userData = getUserFromLocalStorage();
        if (userData) {
          userData.imgUrl = response.data;
          localStorage.setItem("user", JSON.stringify(userData));
          window.location.reload();
        }
      } else {
        setError(response.message || 'Có lỗi xảy ra khi cập nhật ảnh đại diện');
      }
    } catch (error) {
      setError('Có lỗi xảy ra khi cập nhật ảnh đại diện');
      console.error('Lỗi upload avatar:', error);
    } finally {
      setIsUploading(false);
    }
  };

  // Đóng modal và reset state
  const handleClose = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsDragging(false);
    setError(null);
    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FiImage className="w-5 h-5" />
            Đổi ảnh đại diện
          </DialogTitle>
          <DialogDescription>
            Chọn ảnh mới cho hồ sơ của bạn
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Ảnh hiện tại */}
          {currentAvatar && !selectedFile && (
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Ảnh hiện tại:</p>
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                <Image
                  src={chooseImageUrl(currentAvatar)}
                  alt="Avatar hiện tại"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Preview ảnh mới */}
          {selectedFile && previewUrl && (
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Ảnh mới:</p>
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-primary">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={handleRemoveFile}
                className="mt-2 text-sm text-red-600 hover:text-red-700 flex items-center gap-1 mx-auto"
                disabled={isUploading}
              >
                <FiX className="w-4 h-4" />
                Xóa ảnh
              </button>
            </div>
          )}

          {/* Upload area */}
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${isDragging
              ? 'border-primary bg-primary/5'
              : selectedFile
                ? 'border-green-300 bg-green-50 dark:bg-green-900/10'
                : 'border-gray-300 dark:border-gray-600 hover:border-primary hover:bg-primary/5'
              }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              className="hidden"
              disabled={isUploading}
            />

            {selectedFile ? (
              <div className="text-green-600 dark:text-green-400">
                <FiUpload className="w-8 h-8 mx-auto mb-2" />
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <div className="text-gray-600 dark:text-gray-400">
                <FiUpload className="w-8 h-8 mx-auto mb-2" />
                <p className="font-medium mb-1">
                  {isDragging ? 'Thả ảnh vào đây' : 'Kéo thả ảnh hoặc click để chọn'}
                </p>
                <p className="text-sm">
                  Hỗ trợ JPG, PNG, GIF, WebP (tối đa 5MB)
                </p>
              </div>
            )}

            {!selectedFile && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleFileInputClick}
                disabled={isUploading}
                className="mt-3"
              >
                Chọn ảnh
              </Button>
            )}
          </div>

          {/* Error message */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isUploading}
              className="flex-1"
            >
              Hủy
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="flex-1"
            >
              {isUploading ? "Đang cập nhật..." : "Cập nhật"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 