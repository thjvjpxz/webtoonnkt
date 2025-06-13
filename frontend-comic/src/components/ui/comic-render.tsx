import { CategoryResponse } from "@/types/category";

// Hàm render trạng thái comic với hiệu ứng đẹp
export const renderComicStatus = (status: string) => {
  switch (status.toUpperCase()) {
    case "COMPLETED":
    case "completed":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-emerald-500 text-white shadow-md hover:shadow-lg hover:bg-emerald-600 transition-all duration-300 hover:scale-105">
          Đã hoàn thành
        </span>
      );
    case "ONGOING":
    case "ongoing":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-yellow-500 text-white shadow-md hover:shadow-lg hover:bg-yellow-600 transition-all duration-300 hover:scale-105">
          Đang cập nhật
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-gray-500 text-white shadow-md hover:shadow-lg hover:bg-gray-600 transition-all duration-300 hover:scale-105">
          Không xác định
        </span>
      );
  }
};

// Hàm render thể loại với hiệu ứng đẹp
export const renderComicCategory = (category: CategoryResponse) => {
  return (
    <span
      key={category.id}
      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-500 text-white shadow-md hover:shadow-lg hover:bg-blue-600 transition-all duration-300 hover:scale-105"
    >
      {category.name}
    </span>
  );
};

// Hàm render tác giả với badge đang cập nhật
export const renderComicAuthor = (author: string | null) => {
  if (!author) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-orange-500 text-white shadow-md hover:shadow-lg hover:bg-orange-600 transition-all duration-300 hover:scale-105">
        Đang cập nhật
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-green-500 text-white shadow-md hover:shadow-lg hover:bg-green-600 transition-all duration-300 hover:scale-105">
      {author}
    </span>
  );
}

// Hàm render badge với hiệu ứng đẹp
export const renderBadge = (text: string | null) => {
  if (!text) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-orange-500 text-white shadow-md hover:shadow-lg hover:bg-orange-600 transition-all duration-300 hover:scale-105">
        Không có
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-green-500 text-white shadow-md hover:shadow-lg hover:bg-green-600 transition-all duration-300 hover:scale-105">
      {text}
    </span>
  );
}