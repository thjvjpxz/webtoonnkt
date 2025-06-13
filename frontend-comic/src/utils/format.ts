// Utility functions để format dữ liệu hiển thị

/**
 * Format số với dấu phân cách hàng nghìn
 * @param num - Số cần format
 * @returns Chuỗi đã được format
 */
export function formatNumber(num: number): string {
  if (num === 0) return '0';

  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }

  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Format tiền tệ VNĐ
 * @param amount - Số tiền cần format
 * @returns Chuỗi tiền tệ đã được format
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format phần trăm
 * @param value - Giá trị phần trăm
 * @param decimals - Số chữ số thập phân (mặc định 1)
 * @returns Chuỗi phần trăm đã được format
 */
export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format số với dấu + hoặc - để hiển thị tăng giảm
 * @param value - Giá trị cần format
 * @param decimals - Số chữ số thập phân (mặc định 1)
 * @returns Chuỗi với dấu + hoặc -
 */
export function formatChange(value: number, decimals = 1): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}%`;
}

/**
 * Format số ngắn gọn (K, M, B)
 * @param num - Số cần format
 * @param decimals - Số chữ số thập phân (mặc định 1)
 * @returns Chuỗi đã được format ngắn gọn
 */
export function formatCompactNumber(num: number, decimals = 1): string {
  if (num === 0) return '0';

  const units = [
    { value: 1e9, suffix: 'B' },
    { value: 1e6, suffix: 'M' },
    { value: 1e3, suffix: 'K' }
  ];

  for (const unit of units) {
    if (num >= unit.value) {
      const formatted = (num / unit.value).toFixed(decimals);
      return formatted.replace(/\.0+$/, '') + unit.suffix;
    }
  }

  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Format ngày tháng
 */
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format ngày tháng ngắn gọn
 */
export function formatShortDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('vi-VN', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  });
}

/**
 * Format thời gian relative (vd: 2 giờ trước)
 */
export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInMs = now.getTime() - dateObj.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) {
    return 'Vừa xong';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} phút trước`;
  } else if (diffInHours < 24) {
    return `${diffInHours} giờ trước`;
  } else if (diffInDays < 7) {
    return `${diffInDays} ngày trước`;
  } else {
    return formatShortDate(dateObj);
  }
} 