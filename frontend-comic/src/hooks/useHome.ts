import { getComicHome } from "@/services/homeService";
import { CategoryResponse } from "@/types/category";
import { ComicHome, ComicLastUpdate, PopulerToday } from "@/types/home";
import { useEffect, useState } from "react";

export default function useHome() {
  const [comicHome, setComicHome] = useState<ComicHome | null>(null);
  const [populerToday, setPopulerToday] = useState<PopulerToday[]>([]);
  const [populerWeek, setPopulerWeek] = useState<PopulerToday[]>([]);
  const [populerMonth, setPopulerMonth] = useState<PopulerToday[]>([]);
  const [populerAll, setPopulerAll] = useState<PopulerToday[]>([]);
  const [comicLastUpdate, setComicLastUpdate] = useState<ComicLastUpdate[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComicHome = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await getComicHome();
        if (response.status === 200) {
          setComicHome(response.data || null);
          setPopulerToday(response.data?.populerToday || []);
          setPopulerWeek(response.data?.populerWeek || []);
          setPopulerMonth(response.data?.populerMonth || []);
          setPopulerAll(response.data?.populerAll || []);
          setComicLastUpdate(response.data?.comicLastUpdate || []);
          setCategories(response.data?.populerCategories || []);
        } else {
          setError(response.message || 'Có lỗi xảy ra khi tải dữ liệu');
        }
      } catch (err) {
        setError('Không thể kết nối đến server');
        console.error('Lỗi khi fetch home data:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchComicHome();
  }, []);

  return {
    comicHome,
    populerToday,
    populerWeek,
    populerMonth,
    populerAll,
    comicLastUpdate,
    categories,
    isLoading,
    error,
  }
}