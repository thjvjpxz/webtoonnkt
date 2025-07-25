export const generateSlug = (title: string) => {
  if (!title) return "";

  return title
    .toLowerCase()
    .normalize("NFD") // Chuẩn hóa Unicode
    .replace(/[\u0300-\u036f]/g, "") // Loại bỏ dấu
    .replace(/đ/g, "d") // Thay thế đ thường
    .replace(/[^a-z0-9]/g, "-") // Thay các ký tự không phải a-z0-9 bằng dấu gạch
    .replace(/-+/g, "-") // Gộp nhiều dấu gạch liên tiếp
    .replace(/^-|-$/g, ""); // Xóa dấu gạch ở đầu và cuối
};

export const getFirstColorFromGradient = (gradient: string) => {
  if (!gradient || typeof gradient !== "string") {
    return "#000000"; // Màu mặc định nếu input không hợp lệ
  }

  // Tìm tất cả mã màu hex (#RRGGBB hoặc #RGB) trong chuỗi
  const hexColorMatch = gradient.match(/#[0-9a-fA-F]{3,6}/);

  // Trả về mã màu đầu tiên hoặc màu mặc định
  return hexColorMatch ? hexColorMatch[0] : "#000000";
}

/**
 * Format role string thành định dạng readable
 * @param role - Role string
 * @returns Role string đã được format
 */
export const formatRole = (role: string) => {
  if (role === "ADMIN") {
    return "Quản trị viên";
  } else if (role === "READER") {
    return "Độc giả";
  } else if (role === "PUBLISHER") {
    return "Nhà xuất bản";
  }
  return role;
}

/**
 * Chọn URL ảnh từ CDN
 * @param url - URL ảnh
 * @returns URL ảnh đã được chọn
 */
export const chooseImageUrl = (url: string | undefined) => {
  // Kiểm tra URL hợp lệ
  if (!url || typeof url !== 'string') {
    return '/images/placeholder.svg';
  }

  return url;
}