"use client";

import { useState, useEffect } from "react";
import { FiX, FiCalendar, FiClock } from "react-icons/fi";
import { VipPackage, VipPackageCreateUpdate } from "@/types/vipPackage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface VipPackageModalProps {
  vipPackage: VipPackage | null;
  onClose: () => void;
  onSave: (vipPackage: VipPackageCreateUpdate) => void;
}

export default function VipPackageModal({
  vipPackage,
  onClose,
  onSave,
}: VipPackageModalProps) {
  const [formData, setFormData] = useState<VipPackageCreateUpdate>({
    name: "",
    description: "",
    originalPrice: 0,
    discountedPrice: 0,
    discountStartDate: "",
    discountEndDate: "",
    durationDays: 30,
  });

  const [errors, setErrors] = useState({
    name: "",
    originalPrice: "",
    durationDays: "",
    discountedPrice: "",
    discountStartDate: "",
    discountEndDate: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("00:00");

  // Nếu đang sửa, điền dữ liệu vào form
  useEffect(() => {
    if (vipPackage) {
      setFormData({
        name: vipPackage.name,
        description: vipPackage.description,
        originalPrice: vipPackage.originalPrice,
        discountedPrice: vipPackage.discountedPrice,
        discountStartDate: vipPackage.discountStartDate ?
          new Date(vipPackage.discountStartDate).toISOString().split('T')[0] : "",
        discountEndDate: vipPackage.discountEndDate ?
          new Date(vipPackage.discountEndDate).toISOString().split('T')[0] : "",
        durationDays: vipPackage.durationDays,

      });
    } else {
      // Reset form khi tạo mới
      setFormData({
        name: "",
        description: "",
        originalPrice: 0,
        discountedPrice: 0,
        discountStartDate: "",
        discountEndDate: "",
        durationDays: 30,

      });
    }
    setErrors({
      name: "",
      originalPrice: "",
      durationDays: "",
      discountedPrice: "",
      discountStartDate: "",
      discountEndDate: "",
    });

    // Cập nhật thời gian từ dữ liệu VIP package
    if (vipPackage) {
      const startDate = vipPackage.discountStartDate ? new Date(vipPackage.discountStartDate) : null;
      const endDate = vipPackage.discountEndDate ? new Date(vipPackage.discountEndDate) : null;

      setStartTime(startDate ? format(startDate, "HH:mm") : "00:00");
      setEndTime(endDate ? format(endDate, "HH:mm") : "00:00");
    } else {
      setStartTime("00:00");
      setEndTime("00:00");
    }
  }, [vipPackage]);

  // Xử lý thay đổi input
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value ? Number(value) : 0) : value,
    }));

    // Xóa lỗi khi người dùng bắt đầu nhập
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };



  // Xử lý chọn ngày bắt đầu
  const handleStartDateSelect = (date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({
        ...prev,
        discountStartDate: format(date, "yyyy-MM-dd"),
      }));
      setShowStartCalendar(false);
    }
  };

  // Xử lý chọn ngày kết thúc
  const handleEndDateSelect = (date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({
        ...prev,
        discountEndDate: format(date, "yyyy-MM-dd"),
      }));
      setShowEndCalendar(false);
    }
  };

  // Xử lý thay đổi giờ bắt đầu
  const handleStartTimeChange = (time: string) => {
    setStartTime(time);
  };

  // Xử lý thay đổi giờ kết thúc
  const handleEndTimeChange = (time: string) => {
    setEndTime(time);
  };

  // Đóng calendar khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.calendar-container')) {
        setShowStartCalendar(false);
        setShowEndCalendar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Xác thực form
  const validateForm = () => {
    let valid = true;
    const newErrors = {
      name: "",
      originalPrice: "",
      durationDays: "",
      discountedPrice: "",
      discountStartDate: "",
      discountEndDate: "",
    };

    // Kiểm tra tên gói VIP
    if (!formData.name.trim()) {
      newErrors.name = "Tên gói VIP không được để trống";
      valid = false;
    }

    // Kiểm tra giá gốc
    if (formData.originalPrice <= 0) {
      newErrors.originalPrice = "Giá gốc phải lớn hơn 0";
      valid = false;
    }

    // Kiểm tra số ngày
    if (formData.durationDays <= 0) {
      newErrors.durationDays = "Số ngày phải lớn hơn 0";
      valid = false;
    }

    // Kiểm tra giá giảm (nếu có)
    if (formData.discountedPrice && formData.discountedPrice > 100) {
      newErrors.discountedPrice = "Phần trăm giảm giá không được vượt quá 100%";
      valid = false;
    }

    if (formData.discountedPrice && formData.discountedPrice < 0) {
      newErrors.discountedPrice = "Phần trăm giảm giá không được âm";
      valid = false;
    }

    // Kiểm tra ngày bắt đầu và kết thúc giảm giá
    if (formData.discountStartDate && formData.discountEndDate) {
      // Tạo datetime từ ngày và giờ
      const [startHours, startMinutes] = startTime.split(":");
      const startDate = new Date(formData.discountStartDate);
      startDate.setHours(parseInt(startHours), parseInt(startMinutes));

      const [endHours, endMinutes] = endTime.split(":");
      const endDate = new Date(formData.discountEndDate);
      endDate.setHours(parseInt(endHours), parseInt(endMinutes));

      if (endDate <= startDate) {
        newErrors.discountEndDate = "Ngày và giờ kết thúc phải sau ngày và giờ bắt đầu";
        valid = false;
      }
    }

    // Nếu có ngày bắt đầu thì phải có ngày kết thúc và ngược lại
    if (formData.discountStartDate && !formData.discountEndDate) {
      newErrors.discountEndDate = "Vui lòng nhập ngày kết thúc giảm giá";
      valid = false;
    }

    if (formData.discountEndDate && !formData.discountStartDate) {
      newErrors.discountStartDate = "Vui lòng nhập ngày bắt đầu giảm giá";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // Xử lý lưu
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);
      try {
        // Kết hợp ngày và giờ thành datetime string
        let startDateTime = "";
        let endDateTime = "";

        if (formData.discountStartDate) {
          const [hours, minutes] = startTime.split(":");
          const startDate = new Date(formData.discountStartDate);
          startDate.setHours(parseInt(hours), parseInt(minutes));
          startDateTime = startDate.toISOString();
        }

        if (formData.discountEndDate) {
          const [hours, minutes] = endTime.split(":");
          const endDate = new Date(formData.discountEndDate);
          endDate.setHours(parseInt(hours), parseInt(minutes));
          endDateTime = endDate.toISOString();
        }

        const submitData = {
          ...formData,
          discountStartDate: startDateTime,
          discountEndDate: endDateTime,
        };
        await onSave(submitData);
      } catch (error) {
        console.error("Lỗi khi lưu gói VIP:", error);
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded shadow-lg w-full max-w-2xl border border-border max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">
            {vipPackage ? "Sửa gói VIP" : "Thêm gói VIP mới"}
          </h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Tên gói VIP */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="name" className="text-foreground">
              Tên gói VIP <span className="text-destructive">*</span>
            </Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? "border-destructive" : ""}
              placeholder="Nhập tên gói VIP"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Mô tả */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="description" className="text-foreground">
              Mô tả
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              rows={3}
              placeholder="Nhập mô tả gói VIP"
              className="resize-none"
            />
          </div>

          {/* Giá gốc và số ngày */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="originalPrice" className="text-foreground">
                Giá gốc (Linh thạch) <span className="text-destructive">*</span>
              </Label>
              <Input
                type="number"
                id="originalPrice"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleChange}
                className={errors.originalPrice ? "border-destructive" : ""}
                placeholder="0"
                min="0"
              />
              {errors.originalPrice && (
                <p className="mt-1 text-sm text-destructive">{errors.originalPrice}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="durationDays" className="text-foreground">
                Thời hạn (ngày) <span className="text-destructive">*</span>
              </Label>
              <Input
                type="number"
                id="durationDays"
                name="durationDays"
                value={formData.durationDays}
                onChange={handleChange}
                className={errors.durationDays ? "border-destructive" : ""}
                placeholder="30"
                min="1"
              />
              {errors.durationDays && (
                <p className="mt-1 text-sm text-destructive">{errors.durationDays}</p>
              )}
            </div>
          </div>

          {/* Giảm giá */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="discountedPrice" className="text-foreground">
              Phần trăm giảm giá (%)
            </Label>
            <Input
              type="number"
              id="discountedPrice"
              name="discountedPrice"
              value={formData.discountedPrice}
              onChange={handleChange}
              className={errors.discountedPrice ? "border-destructive" : ""}
              placeholder="0"
              min="0"
              max="100"
            />
            {errors.discountedPrice && (
              <p className="mt-1 text-sm text-destructive">{errors.discountedPrice}</p>
            )}
          </div>

          {/* Ngày bắt đầu và kết thúc giảm giá */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Ngày bắt đầu giảm giá */}
            <div className="flex flex-col gap-2">
              <Label className="text-foreground">
                Ngày và giờ bắt đầu giảm giá
              </Label>
              <div className="space-y-2">
                {/* Nút chọn ngày */}
                <div className="relative">
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.discountStartDate && "text-muted-foreground",
                      errors.discountStartDate && "border-destructive"
                    )}
                    onClick={() => setShowStartCalendar(!showStartCalendar)}
                  >
                    <FiCalendar className="mr-2 h-4 w-4" />
                    {formData.discountStartDate
                      ? format(new Date(formData.discountStartDate), "dd/MM/yyyy", { locale: vi })
                      : "Chọn ngày"
                    }
                  </Button>

                  {/* Calendar dropdown */}
                  {showStartCalendar && (
                    <div className="calendar-container absolute top-full left-0 z-50 mt-1 bg-background border border-border rounded-md shadow-lg">
                      <Calendar
                        mode="single"
                        selected={formData.discountStartDate ? new Date(formData.discountStartDate) : undefined}
                        onSelect={handleStartDateSelect}
                        initialFocus
                      />
                    </div>
                  )}
                </div>

                {/* Input thời gian */}
                <div className="flex items-center gap-2">
                  <FiClock className="h-4 w-4 text-muted-foreground" />
                  <Input
                    type="time"
                    value={startTime}
                    onChange={(e) => handleStartTimeChange(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              {errors.discountStartDate && (
                <p className="mt-1 text-sm text-destructive">{errors.discountStartDate}</p>
              )}
            </div>

            {/* Ngày kết thúc giảm giá */}
            <div className="flex flex-col gap-2">
              <Label className="text-foreground">
                Ngày và giờ kết thúc giảm giá
              </Label>
              <div className="space-y-2">
                {/* Nút chọn ngày */}
                <div className="relative">
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.discountEndDate && "text-muted-foreground",
                      errors.discountEndDate && "border-destructive"
                    )}
                    onClick={() => setShowEndCalendar(!showEndCalendar)}
                  >
                    <FiCalendar className="mr-2 h-4 w-4" />
                    {formData.discountEndDate
                      ? format(new Date(formData.discountEndDate), "dd/MM/yyyy", { locale: vi })
                      : "Chọn ngày"
                    }
                  </Button>

                  {/* Calendar dropdown */}
                  {showEndCalendar && (
                    <div className="calendar-container absolute top-full left-0 z-50 mt-1 bg-background border border-border rounded-md shadow-lg">
                      <Calendar
                        mode="single"
                        selected={formData.discountEndDate ? new Date(formData.discountEndDate) : undefined}
                        onSelect={handleEndDateSelect}
                        initialFocus
                      />
                    </div>
                  )}
                </div>

                {/* Input thời gian */}
                <div className="flex items-center gap-2">
                  <FiClock className="h-4 w-4 text-muted-foreground" />
                  <Input
                    type="time"
                    value={endTime}
                    onChange={(e) => handleEndTimeChange(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              {errors.discountEndDate && (
                <p className="mt-1 text-sm text-destructive">{errors.discountEndDate}</p>
              )}
            </div>
          </div>



          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isSubmitting ? "Đang xử lý..." : (vipPackage ? "Cập nhật" : "Thêm mới")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 