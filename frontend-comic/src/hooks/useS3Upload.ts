import { useState, useCallback, useEffect } from 'react';
import { s3Service } from '@/services/s3Service';
import { S3UploadParams, S3UploadResponse, S3UploadProgress } from '@/types/s3';
import toast from 'react-hot-toast';

interface UseS3UploadOptions {
  autoToast?: boolean; // Tự động hiển thị toast khi upload thành công/thất bại
  maxFileSize?: number; // Kích thước file tối đa (bytes)
  allowedTypes?: string[]; // Các loại file được phép
}

export function useS3Upload(options: UseS3UploadOptions = {}) {
  const { autoToast = true, maxFileSize, allowedTypes } = options;

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<S3UploadProgress | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Tự động khởi tạo S3 khi hook được mount
  useEffect(() => {
    try {
      s3Service.initialize();
      setIsInitialized(true);
    } catch (error) {
      console.error('Lỗi khi khởi tạo S3:', error);
      if (autoToast) {
        toast.error('Lỗi khi khởi tạo S3. Vui lòng kiểm tra config.');
      }
    }

  }, [autoToast]);

  // Validate file trước khi upload
  const validateFile = useCallback((file: File): string | null => {
    // Kiểm tra kích thước file
    if (maxFileSize && file.size > maxFileSize) {
      return `File quá lớn. Kích thước tối đa: ${(maxFileSize / 1024 / 1024).toFixed(1)}MB`;
    }

    // Kiểm tra loại file
    if (allowedTypes && allowedTypes.length > 0) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const isAllowed = allowedTypes.some(type => {
        if (type.startsWith('.')) {
          return type.toLowerCase() === `.${fileExtension}`;
        }
        return file.type.includes(type);
      });

      if (!isAllowed) {
        return `Loại file không được hỗ trợ. Chỉ chấp nhận: ${allowedTypes.join(', ')}`;
      }
    }

    return null;
  }, [maxFileSize, allowedTypes]);

  // Upload single file
  const uploadFile = useCallback(async (params: S3UploadParams): Promise<S3UploadResponse> => {
    if (!isInitialized) {
      const error = 'S3 chưa được khởi tạo';
      if (autoToast) {
        toast.error(error);
      }
      return { success: false, error };
    }

    // Validate file
    const validationError = validateFile(params.file);
    if (validationError) {
      if (autoToast) {
        toast.error(validationError);
      }
      return { success: false, error: validationError };
    }

    setIsUploading(true);
    setUploadProgress(null);

    try {
      const result = await s3Service.uploadFile(params, (progress) => {
        setUploadProgress(progress);
      });

      if (result.success) {
        if (autoToast) {
          toast.success('Upload file thành công!');
        }
      } else {
        if (autoToast) {
          toast.error(result.error || 'Upload file thất bại');
        }
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi upload';
      if (autoToast) {
        toast.error(errorMessage);
      }
      return { success: false, error: errorMessage };
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  }, [isInitialized, validateFile, autoToast]);

  // Upload multiple files
  const uploadMultipleFiles = useCallback(async (
    files: S3UploadParams[],
    onProgressCallback?: (fileIndex: number, result: S3UploadResponse) => void
  ): Promise<S3UploadResponse[]> => {
    if (!isInitialized) {
      const error = 'S3 chưa được khởi tạo';
      if (autoToast) {
        toast.error(error);
      }
      return files.map(() => ({ success: false, error }));
    }

    // Validate tất cả files
    for (let i = 0; i < files.length; i++) {
      const validationError = validateFile(files[i].file);
      if (validationError) {
        if (autoToast) {
          toast.error(`File ${i + 1}: ${validationError}`);
        }
        return files.map(() => ({ success: false, error: validationError }));
      }
    }

    setIsUploading(true);

    try {
      const results = await s3Service.uploadMultipleFiles(files, (fileIndex, result) => {
        if (onProgressCallback) {
          onProgressCallback(fileIndex, result);
        }
      });

      const successCount = results.filter(r => r.success).length;
      const totalCount = results.length;

      if (autoToast) {
        if (successCount === totalCount) {
          toast.success(`Upload thành công ${successCount}/${totalCount} files`);
        } else {
          toast.error(`Upload thành công ${successCount}/${totalCount} files`);
        }
      }

      return results;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi upload';
      if (autoToast) {
        toast.error(errorMessage);
      }
      return files.map(() => ({ success: false, error: errorMessage }));
    } finally {
      setIsUploading(false);
    }
  }, [isInitialized, validateFile, autoToast]);

  // Lấy URL từ key
  const getPublicUrl = useCallback((key: string): string | null => {
    if (!isInitialized) {
      console.error('S3 chưa được khởi tạo');
      return null;
    }
    try {
      return s3Service.getPublicUrl(key);
    } catch (error) {
      console.error('Lỗi khi lấy URL:', error);
      return null;
    }
  }, [isInitialized]);

  // Reset S3 service
  const resetS3 = useCallback(() => {
    s3Service.reset();
    setIsInitialized(false);
    setIsUploading(false);
    setUploadProgress(null);
  }, []);

  return {
    // State
    isUploading,
    uploadProgress,
    isInitialized,

    // Actions
    uploadFile,
    uploadMultipleFiles,
    getPublicUrl,
    resetS3,
    validateFile,
  };
} 