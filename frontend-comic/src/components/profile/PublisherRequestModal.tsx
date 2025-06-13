import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { sendRequestPublisher } from "@/services/homeService";
import { FiSend, FiCheck, FiX, FiAlertCircle } from "react-icons/fi";
import toast from "react-hot-toast";

interface PublisherRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PublisherRequestModal({
  isOpen,
  onClose,
}: PublisherRequestModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSendRequest = async () => {
    try {
      setIsLoading(true);
      const response = await sendRequestPublisher();

      if (response.status === 200 && response.message) {
        setIsSuccess(true);
        toast.success(response.message);

        // Tự động đóng modal sau 2 giây
        setTimeout(() => {
          onClose();
          setIsSuccess(false);
        }, 2000);
      } else {
        toast.error(response.message || "Đã xảy ra lỗi khi gửi yêu cầu. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu publisher:", error);
      toast.error("Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      setIsSuccess(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isSuccess ? (
              <>
                <FiCheck className="w-5 h-5 text-green-500" />
                Gửi yêu cầu thành công
              </>
            ) : (
              <>
                <FiSend className="w-5 h-5 text-primary" />
                Yêu cầu làm Publisher
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-left">
            {isSuccess ? (
              <div className="space-y-2">
                <p className="text-green-600 dark:text-green-400">
                  Yêu cầu của bạn đã được gửi thành công!
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Chúng tôi sẽ xem xét và phản hồi trong thời gian sớm nhất.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <p>
                  Bạn có muốn gửi yêu cầu trở thành Publisher không?
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <FiAlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-700 dark:text-blue-300">
                      <p className="font-medium mb-1">Lưu ý:</p>
                      <ul className="space-y-1 text-xs">
                        <li>• Publisher có thể đăng tải và quản lý truyện tranh</li>
                        <li>• Yêu cầu sẽ được admin xem xét và phê duyệt</li>
                        <li>• Quá trình xét duyệt có thể mất 1-3 ngày làm việc</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>

        {!isSuccess && (
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              <FiX className="w-4 h-4 mr-2" />
              Hủy bỏ
            </Button>
            <Button
              onClick={handleSendRequest}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Đang gửi...
                </>
              ) : (
                <>
                  <FiSend className="w-4 h-4 mr-2" />
                  Gửi yêu cầu
                </>
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
} 