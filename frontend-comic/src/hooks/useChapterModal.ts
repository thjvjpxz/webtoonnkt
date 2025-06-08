import { useState, useEffect } from "react";
import { useChapter } from "@/hooks/useChapter";
import { Chapter, ChapterCreateUpdate, ChapterStatus, DetailChapterCreateUpdate } from "@/types/chapter";
import { ComicResponse } from "@/types/comic";
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
  comicOptions: ComicResponse[],
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

  // Xử lý tải lên hình ảnh với sắp xếp theo tên file
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const newFiles = Array.from(e.target.files);

    // Sắp xếp file theo tên trước khi thêm vào state
    const sortedFiles = sortFilesByName(newFiles);

    setImages(prev => {
      const combinedFiles = [...prev, ...sortedFiles];
      // Sắp xếp lại toàn bộ danh sách file
      return sortFilesByName(combinedFiles);
    });

    // Tạo preview URLs theo thứ tự đã sắp xếp
    const newPreviewUrls = sortedFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => {
      const combinedUrls = [...prev, ...newPreviewUrls];
      // Sắp xếp lại preview URLs theo thứ tự file đã sắp xếp
      const allFiles = sortFilesByName([...images, ...sortedFiles]);
      const sortedUrls: string[] = [];

      allFiles.forEach(file => {
        const existingIndex = images.findIndex(img => img.name === file.name);
        if (existingIndex !== -1) {
          // File đã tồn tại, lấy URL từ preview cũ
          sortedUrls.push(prev[existingIndex]);
        } else {
          // File mới, lấy URL từ newPreviewUrls
          const newIndex = sortedFiles.findIndex(newFile => newFile.name === file.name);
          if (newIndex !== -1) {
            sortedUrls.push(newPreviewUrls[newIndex]);
          }
        }
      });

      return sortedUrls;
    });
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
      // Thử tạo đối tượng URL để kiểm tra tính hợp lệ
      new URL(url);

      // Kiểm tra định dạng ảnh nếu URL hợp lệ
      return url.trim() !== '' &&
        (url.startsWith('http://') || url.startsWith('https://')) &&
        /\.(jpg|jpeg|png|webp|gif|bmp)(\?.*)?$/i.test(url);
    } catch (error) {
      // URL không hợp lệ
      console.error("URL không hợp lệ:", url);
      console.error(error);
      return false;
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

    try {
      const links = imageLink
        .split('\n')
        .map(link => link.trim())
        .filter(link => {
          try {
            // Kiểm tra URL có hợp lệ
            if (link === '') return false;
            new URL(link);
            return isValidImageUrl(link);
          } catch (error) {
            console.error("URL không hợp lệ trong danh sách:", link);
            console.error(error);
            return false;
          }
        });

      if (links.length === 0) {
        toast.error("Không có URL hợp lệ nào được thêm");
        return;
      }

      // Thêm các link hợp lệ vào danh sách preview
      setPreviewUrls(prev => [...prev, ...links]);
      setImageLink(''); // Xóa textarea sau khi thêm
      toast.success(`Đã thêm ${links.length} hình ảnh`);
    } catch (error) {
      console.error("Lỗi khi xử lý URL hình ảnh:", error);
      toast.error("Có lỗi xảy ra khi xử lý URL hình ảnh");
    }
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate data
    if (!title.trim()) {
      toast.error("Vui lòng nhập tiêu đề chapter");
      return;
    }

    if (!chapterNumber || parseFloat(chapterNumber) < 0) {
      toast.error("Vui lòng nhập số chapter hợp lệ");
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
      toast.error("Vui lòng nhập giá hợp lệ cho chapter trả phí");
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
      price,
      detailChapters: []
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
    setUploadMethod,
    imageLink,
    setImageLink,
    hasValidImageLinks,
    handleAddMultipleImageLinks
  };
}; 