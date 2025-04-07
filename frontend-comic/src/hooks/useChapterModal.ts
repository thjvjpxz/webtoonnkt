import { useState, useEffect } from "react";
import { useChapter } from "@/hooks/useChapter";
import { Chapter, ChapterCreateUpdate, ChapterStatus, DetailChapterCreateUpdate } from "@/types/chapter";
import { ComicResponse } from "@/types/comic";
import { toast } from "react-hot-toast";

export const useChapterModal = (
  isOpen: boolean,
  chapter: Chapter | null,
  comicOptions: ComicResponse[],
  onSubmit: (chapterData: ChapterCreateUpdate, images: File[]) => void
) => {
  const isEditMode = !!chapter;
  const [title, setTitle] = useState("");
  const [chapterNumber, setChapterNumber] = useState<string>("");
  const [comicId, setComicId] = useState<string>("");
  const [status, setStatus] = useState<ChapterStatus>(ChapterStatus.FREE);
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [deletedImageUrls, setDeletedImageUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<'file' | 'link'>('file');
  const [imageLink, setImageLink] = useState<string>('');
  const [imageLinkList, setImageLinkList] = useState<string[]>([]);

  // Tái sử dụng hook
  const {
    comicSearchTerm,
    setComicSearchTerm,
    isComicDropdownOpen,
    setIsComicDropdownOpen,
    isLoadingComics,
    handleComicDropdownScroll,
    handleSelectComic: selectComic
  } = useChapter();

  // Lọc truyện theo từ khóa tìm kiếm
  const filteredComicOptions = comicOptions.filter(comic =>
    comic.name.toLowerCase().includes(comicSearchTerm.toLowerCase())
  );

  // Reset form khi modal đóng
  useEffect(() => {
    if (isOpen) {
      if (chapter) {
        setTitle(chapter.title);
        setChapterNumber(chapter.chapterNumber.toString());
        setStatus(chapter.status !== undefined ? chapter.status : ChapterStatus.FREE);

        // Set comic ID
        const comic = comicOptions.find(comic => comic.name === chapter.comicName);
        if (comic) setComicId(comic.id.toString());

        // Load chapter images if in edit mode and chapter has images
        if (chapter.detailChapters && chapter.detailChapters.length > 0) {
          const sortedDetails = [...chapter.detailChapters].sort((a, b) => a.orderNumber - b.orderNumber);
          const urls = sortedDetails.map(detail => detail.imgUrl);
          setPreviewUrls(urls);
          setExistingImageUrls(urls); // Lưu lại URLs của ảnh đã có
          // Không set images vì chúng ta không có file, chỉ có URL
        }
        setDeletedImageUrls([]);
      } else {
        // Reset form for new chapter
        setTitle("");
        setChapterNumber("");
        setComicId("");
        setStatus(ChapterStatus.FREE);
        setImages([]);
        setPreviewUrls([]);
        setExistingImageUrls([]);
        setDeletedImageUrls([]);
      }
    } else {
      // Reset image states when modal closes
      setImages([]);
      setPreviewUrls([]);
      setExistingImageUrls([]);
      setDeletedImageUrls([]);
    }
  }, [isOpen, chapter, comicOptions]);

  // Tạo phiên bản riêng của handleSelectComic cho component này
  const handleSelectComic = (id: string) => {
    setComicId(id);
    selectComic(id); // Gọi hàm từ hook
  };

  // Xử lý tải lên hình ảnh
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const newFiles = Array.from(e.target.files);
    setImages(prev => [...prev, ...newFiles]);

    // Tạo preview URLs
    const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  // Xóa hình ảnh đã chọn
  const handleRemoveImage = (index: number) => {
    // Lấy URL của ảnh sắp xóa để kiểm tra
    const urlToRemove = previewUrls[index];

    // Kiểm tra xem đây có phải là ảnh đã tồn tại hay không
    const isExistingImage = existingImageUrls.includes(urlToRemove);

    if (isExistingImage) {
      // Nếu là ảnh đã tồn tại, thêm vào danh sách ảnh đã xóa
      setDeletedImageUrls(prev => [...prev, urlToRemove]);
    }

    // Xóa file từ mảng images (nếu có)
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    // Xóa URL preview
    const newPreviewUrls = [...previewUrls];
    // Nếu là URL blob (được tạo bởi URL.createObjectURL), cần revoke để tránh memory leak
    if (urlToRemove.startsWith('blob:')) {
      URL.revokeObjectURL(urlToRemove);
    }
    newPreviewUrls.splice(index, 1);
    setPreviewUrls(newPreviewUrls);

    // Nếu URL nằm trong existingImageUrls, cũng cần xóa khỏi mảng này
    if (existingImageUrls.includes(urlToRemove)) {
      const newExistingUrls = [...existingImageUrls];
      const existingIndex = newExistingUrls.indexOf(urlToRemove);
      if (existingIndex !== -1) {
        newExistingUrls.splice(existingIndex, 1);
        setExistingImageUrls(newExistingUrls);
      }
    }
  };

  // Xử lý kéo thả để đổi vị trí ảnh
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    // Thêm dữ liệu để hỗ trợ Firefox (cần thiết cho drag API)
    e.dataTransfer.setData('text/plain', index.toString());
    // Thêm hiệu ứng cho element đang kéo
    e.currentTarget.classList.add('opacity-50');
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDropTargetIndex(index);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-green-50', 'dark:bg-green-900/20');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('bg-green-50', 'dark:bg-green-900/20');
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-green-50', 'dark:bg-green-900/20');

    if (draggedIndex === null) return;

    // Di chuyển ảnh và URL preview
    const newImages = [...images];
    const newPreviewUrls = [...previewUrls];

    // Lưu lại item bị kéo
    const draggedImage = newImages[draggedIndex];
    const draggedPreview = newPreviewUrls[draggedIndex];

    // Xóa item bị kéo khỏi mảng
    newImages.splice(draggedIndex, 1);
    newPreviewUrls.splice(draggedIndex, 1);

    // Chèn lại vào vị trí mới
    newImages.splice(targetIndex, 0, draggedImage);
    newPreviewUrls.splice(targetIndex, 0, draggedPreview);

    // Cập nhật state
    setImages(newImages);
    setPreviewUrls(newPreviewUrls);
    setDraggedIndex(null);
    setDropTargetIndex(null);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('opacity-50');
    setDraggedIndex(null);
    setDropTargetIndex(null);
  };

  // Function kiểm tra URL hợp lệ
  const isValidImageUrl = (url: string): boolean => {
    return url.trim() !== '' &&
      (url.startsWith('http://') || url.startsWith('https://')) &&
      /\.(jpg|jpeg|png|webp|gif|bmp)(\?.*)?$/i.test(url);
  };

  // Xử lý thêm link ảnh
  const handleAddImageLink = () => {
    if (!imageLink || !isValidImageUrl(imageLink)) return;

    setImageLinkList(prev => [...prev, imageLink]);
    setPreviewUrls(prev => [...prev, imageLink]);
    setImageLink('');
  };

  // Xử lý xóa link ảnh
  const handleRemoveImageLink = (index: number) => {
    // Tìm vị trí tương ứng trong previewUrls
    const linkToRemove = imageLinkList[index];
    const previewIndex = previewUrls.findIndex(url => url === linkToRemove);

    // Xóa khỏi cả hai danh sách
    setImageLinkList(prev => prev.filter((_, i) => i !== index));

    if (previewIndex !== -1) {
      handleRemoveImage(previewIndex);
    }
  };

  // Thêm hàm kiểm tra các link hợp lệ
  const hasValidImageLinks = (text: string): boolean => {
    if (!text.trim()) return false;

    const links = text.split('\n').filter(link => link.trim() !== '');
    return links.some(link => isValidImageUrl(link.trim()));
  };

  // Xử lý thêm nhiều link ảnh
  const handleAddMultipleImageLinks = () => {
    if (!imageLink.trim()) return;

    const links = imageLink
      .split('\n')
      .map(link => link.trim())
      .filter(link => link !== '' && isValidImageUrl(link));

    if (links.length === 0) return;

    // Thêm các link hợp lệ vào danh sách
    setImageLinkList(prev => [...prev, ...links]);
    setPreviewUrls(prev => [...prev, ...links]);
    setImageLink(''); // Xóa textarea sau khi thêm
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate data
    if (!title.trim()) {
      toast.error("Vui lòng nhập tiêu đề chương");
      return;
    }

    if (!chapterNumber || parseFloat(chapterNumber) < 0) {
      toast.error("Vui lòng nhập số chương hợp lệ");
      return;
    }

    if (!comicId) {
      toast.error("Vui lòng chọn truyện");
      return;
    }

    if (status === undefined || status === null) {
      toast.error("Vui lòng chọn trạng thái");
      return;
    }

    // Nếu đang chỉnh sửa, không cần validate có ảnh hay không
    if (!isEditMode && images.length === 0) {
      toast.error("Vui lòng thêm ít nhất một ảnh");
      return;
    }

    setIsSubmitting(true);
    setIsUploading(true);

    // Tạo formData theo type ChapterCreateUpdate
    const chapterData: ChapterCreateUpdate = {
      title: title.trim(),
      chapterNumber: parseFloat(chapterNumber),
      comicId,
      status,
    };

    // Thêm id nếu đang ở chế độ chỉnh sửa
    if (isEditMode && chapter?.id) {
      chapterData.id = chapter.id;

      // Tạo danh sách chi tiết mới để gửi lên server
      const imageDetails: DetailChapterCreateUpdate[] = [];

      // Thêm ảnh còn hiển thị (không bị xóa)
      previewUrls.forEach((url, index) => {
        const isNewImage = url.startsWith('blob:') || !existingImageUrls.includes(url);

        imageDetails.push({
          imgUrl: url,
          orderNumber: index + 1, // orderNumber bắt đầu từ 1
          newImage: isNewImage,
          hasRemove: false // Không xóa
        });
      });

      // Thêm ảnh đã bị xóa với isDelete = true
      deletedImageUrls.forEach(url => {
        // Chỉ thêm các URL không bắt đầu bằng 'blob:' (là ảnh đã tồn tại trên server)
        if (!url.startsWith('blob:')) {
          imageDetails.push({
            imgUrl: url,
            orderNumber: 0, // Số thứ tự không quan trọng vì ảnh sẽ bị xóa
            newImage: false, // Không phải ảnh mới
            hasRemove: true // Đánh dấu xóa
          });
        }
      });

      // Gán danh sách chi tiết vào chapterData để gửi lên server
      chapterData.detailChapters = imageDetails;
    }

    try {
      await onSubmit(chapterData, images);
      // Sau khi xử lý xong thì reset form hoặc đóng modal
      setIsUploading(false);
      setIsSubmitting(false);
    } catch (error) {
      // Xử lý lỗi
      console.error("Error submitting chapter:", error);
      setIsUploading(false);
      setIsSubmitting(false);
    }
  };

  return {
    // States
    title,
    chapterNumber,
    comicId,
    status,
    images,
    previewUrls,
    isUploading,
    draggedIndex,
    dropTargetIndex,
    existingImageUrls,
    deletedImageUrls,
    isSubmitting,

    // Comic dropdown related
    comicSearchTerm,
    isComicDropdownOpen,
    isLoadingComics,
    filteredComicOptions,

    // Setters
    setTitle,
    setChapterNumber,
    setComicId,
    setStatus,
    setComicSearchTerm,
    setIsComicDropdownOpen,

    // Handlers
    handleSelectComic,
    handleImageChange,
    handleRemoveImage,
    handleDragStart,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
    handleSubmit,
    handleComicDropdownScroll,

    // Utils
    isEditMode,

    // New states
    uploadMethod,
    setUploadMethod,
    imageLink,
    setImageLink,
    imageLinkList,
    handleAddImageLink,
    handleRemoveImageLink,
    isValidImageUrl,
    hasValidImageLinks,
    handleAddMultipleImageLinks
  };
}; 