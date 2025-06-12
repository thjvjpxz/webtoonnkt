
export interface VipPackage {
  id: string;
  name: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  discountStartDate: string;
  discountEndDate: string;
  durationDays: number;
  isActive: boolean; // còn bán hay không
  createdAt: string;
  updatedAt: string;
  currentPrice: number;
  onDiscount: boolean;
}

export interface VipPackageCreateUpdate {
  name: string; // bắt buộc
  description: string; // không bắt buộc
  originalPrice: number; // bắt buộc
  discountedPrice: number; // không bắt buộc. Đây là percentage của originalPrice
  discountStartDate: string; // không bắt buộc
  discountEndDate: string; // không bắt buộc
  durationDays: number; // bắt buộc
}