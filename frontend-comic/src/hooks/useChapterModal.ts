import { useState, useEffect } from "react";
import { useChapter } from "@/hooks/useChapter";
import { Chapter, ChapterCreateUpdate, ChapterStatus, DetailChapterCreateUpdate } from "@/types/chapter";
import { toast } from "react-hot-toast";
import { constructImageUrl } from "@/utils/helpers";

// Hàm sắp xếp file theo tên (page_1.jpg, page_2.jpg, ...)
const sortFilesByName = (files: File[]): File[] => {
  return [...files].sort((a, b) => {
    // Trích xuất số từ tên file (ví dụ: page_1.jpg -> 1)
    const getNumberFromFileName = (fileName: string): number => {
      const match = fileName.match(/(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    };

    const numA = getNumberFromFileName(a.name);
    const numB = getNumberFromFileName(b.name);

    // Sắp xếp theo số, nếu không có số thì sắp xếp theo tên
    if (numA !== numB) {
      return numA - numB;
    }

    return a.name.localeCompare(b.name);
  });
};

export const useChapterModal = (
  isOpen: boolean,
  chapter: Chapter | null,
  onSubmit: (chapterData: ChapterCreateUpdate, images: File[]) => void
) => {
  const isEditMode = !!chapter;
  const [title, setTitle] = useState("");
  const [chapterNumber, setChapterNumber] = useState<string>("");
  const [comicId, setComicId] = useState<string>("");
  const [status, setStatus] = useState<ChapterStatus>(ChapterStatus.FREE);
  const [price, setPrice] = useState<number | undefined>(undefined);
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [deletedImageUrls, setDeletedImageUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<'file' | 'link'>('file');
  const [imageLink, setImageLink] = useState<string>('');

  const {
    comicOptions,
    comicSearchTerm,
    setComicSearchTerm,
    isComicDropdownOpen,
    setIsComicDropdownOpen,
    isLoadingComics,
    handleComicDropdownScroll,
    handleSelectComic: selectComic,
    filteredComicOptions
  } = useChapter();

  /**
   * Xử lý chuyển đổi chế độ upload
   * @param method - Chế độ upload
   */
  const handleUploadMethodChange = (method: 'file' | 'link') => {
    if (method === uploadMethod) return;

    if (method === 'file') {
      // Chuyển sang file mode: clear tất cả URL links, chỉ giữ file URLs và existing images
      setPreviewUrls(prev => prev.filter(url => url.startsWith('blob:') || existingImageUrls.includes(url)));
      setImageLink('');
    } else {
      // Chuyển sang link mode: clear tất cả files và file URLs, chỉ giữ existing images
      setImages([]);
      setPreviewUrls(prev => {
        // Revoke blob URLs để tránh memory leak
        prev.forEach(url => {
          if (url.startsWith('blob:')) {
            URL.revokeObjectURL(url);
          }
        });
        // Chỉ giữ existing images
        return prev.filter(url => existingImageUrls.includes(url));
      });
    }

    setUploadMethod(method);
  };

  useEffect(() => {
    if (isOpen && chapter) {
      setTitle(chapter.title);
      setChapterNumber(chapter.chapterNumber.toString());
      setStatus(chapter.status !== undefined ? chapter.status : ChapterStatus.FREE);
      setPrice(chapter.price);

      // Set comic ID
      const comic = comicOptions.find(comic => comic.name === chapter.comicName);
      if (comic) setComicId(comic.id.toString());

      // Load chapter images if in edit mode and chapter has images
      if (chapter.detailChapters && chapter.detailChapters.length > 0) {
        const sortedDetails = [...chapter.detailChapters].sort((a, b) => a.orderNumber - b.orderNumber);
        const urls = sortedDetails.map(detail => {
          // Đảm bảo URL là hợp lệ trước khi thêm vào danh sách
          try {
            const url = constructImageUrl(chapter, detail.imgUrl);
            new URL(url); // Kiểm tra URL hợp lệ
            return url;
          } catch (error) {
            console.error("URL không hợp lệ từ database:", detail.imgUrl);
            console.error(error);
            return null;
          }
        }).filter(url => url !== null) as string[];

        setImageLink(urls.join('\n'));

        setPreviewUrls(urls);
        setExistingImageUrls(urls);
      }
      setDeletedImageUrls([]);
    } else {
      // Reset form for new chapter
      setTitle("");
      setChapterNumber("");
      setComicId("");
      setStatus(ChapterStatus.FREE);
      setPrice(undefined);
      setImages([]);
      setPreviewUrls([]);
      setExistingImageUrls([]);
      setDeletedImageUrls([]);
      setUploadMethod('file'); // Reset về upload file
      setImageLink(''); // Clear image link
    }
  }, [isOpen, chapter, comicOptions]);

  // Tạo phiên bản riêng của handleSelectComic cho component này
  const handleSelectComic = (id: string) => {
    setComicId(id);
    selectComic(id); // Gọi hàm từ hook
  };

  // Xử lý tải lên hình ảnh với sắp xếp theo tên file
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const newFiles = Array.from(e.target.files);

    // Sắp xếp file theo tên trước khi thêm vào state
    const sortedFiles = sortFilesByName(newFiles);

    // Thêm file mới vào danh sách file hiện tại
    setImages(prev => {
      const combinedFiles = [...prev, ...sortedFiles];
      // Sắp xếp lại toàn bộ danh sách file
      return sortFilesByName(combinedFiles);
    });

    // Tạo preview URLs cho file mới
    const newPreviewUrls = sortedFiles.map(file => URL.createObjectURL(file));

    // Thêm URL preview mới vào danh sách hiện tại (chỉ cho file mode)
    setPreviewUrls(prev => {
      // Chỉ giữ lại URLs từ files hoặc existing images, loại bỏ external URLs
      const fileUrls = prev.filter(url => url.startsWith('blob:') || existingImageUrls.includes(url));
      return [...fileUrls, ...newPreviewUrls];
    });

    // Clear image link nếu đang ở file mode
    setImageLink('');

    // Reset input file sau khi xử lý
    if (e.target) {
      e.target.value = '';
    }
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

  // Function kiểm tra URL hợp lệ
  const isValidImageUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };



  // Xử lý tự động khi thay đổi nội dung textarea link
  const handleImageLinkChange = (value: string) => {
    setImageLink(value);

    // Tự động xử lý links khi có nội dung
    if (value.trim()) {
      const inputLinks = value
        .split('\n')
        .map(link => link.trim())
        .filter(link => link !== '');

      const validLinks = inputLinks.filter(link => isValidImageUrl(link));

      // Chỉ cập nhật preview nếu có link hợp lệ, giữ nguyên thứ tự của links
      if (validLinks.length > 0) {
        setPreviewUrls(validLinks);
        setImages([]); // Clear files khi chuyển sang URL mode
      }
    } else {
      // Clear preview khi textarea trống (chỉ clear link URLs, giữ existing images)
      setPreviewUrls(prev => prev.filter(url => existingImageUrls.includes(url)));
    }
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

    // Validate price nếu chapter là trả phí
    if (status === ChapterStatus.FEE && (!price || price <= 0)) {
      toast.error("Vui lòng nhập giá hợp lệ cho chương trả phí");
      return;
    }

    // Validate có ảnh nếu không phải chế độ edit và chưa có preview nào
    if (!isEditMode && previewUrls.length === 0) {
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
      price,
      detailChapters: [],
      isFileUploaded: uploadMethod === 'file' && images.length > 0
    };

    // Tạo danh sách chi tiết cho tất cả các ảnh (cả create và update)
    const imageDetails: DetailChapterCreateUpdate[] = [];

    // Trường hợp upload file
    previewUrls.forEach((url, index) => {
      imageDetails.push({
        imgUrl: url,
        orderNumber: index + 1
      });
    });


    // Gán danh sách chi tiết vào chapterData
    chapterData.detailChapters = imageDetails;

    // Thêm id nếu đang ở chế độ chỉnh sửa
    if (isEditMode && chapter?.id) {
      chapterData.id = chapter.id;
    }

    try {
      await onSubmit(chapterData, images);
      setIsUploading(false);
      setIsSubmitting(false);
    } catch (error) {
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
    price,
    images,
    previewUrls,
    isUploading,
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
    setPrice,
    setComicSearchTerm,
    setIsComicDropdownOpen,

    // Handlers
    handleSelectComic,
    handleImageChange,
    handleRemoveImage,
    handleSubmit,
    handleComicDropdownScroll,

    // Utils
    isEditMode,

    // Upload method states
    uploadMethod,
    setUploadMethod: handleUploadMethodChange,
    imageLink,
    setImageLink: handleImageLinkChange
  };
}; 