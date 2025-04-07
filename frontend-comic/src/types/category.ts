export type CategoryModalProps = {
  category: CategoryResponse | null;
  onClose: () => void;
  onSave: (category: CategoryCreateUpdate) => void;
};

export type DeleteConfirmModalProps = {
  categoryName: string;
  onClose: () => void;
  onConfirm: () => void;
};

// Định nghĩa kiểu dữ liệu cho thể loại
export type CategoryResponse = {
  id: string;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

// Định nghĩa kiểu dữ liệu cho việc tạo/cập nhật thể loại
export type CategoryCreateUpdate = {
  name: string;
  slug: string;
  description?: string;
};