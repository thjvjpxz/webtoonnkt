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

