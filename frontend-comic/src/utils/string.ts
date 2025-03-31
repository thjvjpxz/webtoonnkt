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
