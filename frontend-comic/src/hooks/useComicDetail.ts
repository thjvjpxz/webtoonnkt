import { useEffect } from "react";

import { useAuth } from "@/contexts/AuthContext";

import { useState } from "react";
import { checkFollowComic, followComic, unfollowComic } from "@/services/comicDetailService";
import { buyChapter } from "@/services/homeService";
import toast from "react-hot-toast";
import { ComicDetailResponse } from "@/types/comic";

export default function useComicDetail(comicDetailResponse: ComicDetailResponse) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [showAllChapters, setShowAllChapters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [followersCount, setFollowersCount] = useState(comicDetailResponse.followersCount);
  const [buyingChapters, setBuyingChapters] = useState<Set<string>>(new Set());

  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;

    const checkFollow = async () => {
      const response = await checkFollowComic(comicDetailResponse.id);
      if (response.status === 200) {
        setIsFollowing(response.data || false);
      } else {
        toast.error(response.message || "Lỗi khi kiểm tra theo dõi truyện");
      }
    }

    checkFollow();
  }, [isAuthenticated, comicDetailResponse.id]);

  useEffect(() => {
    setFollowersCount(comicDetailResponse.followersCount);
  }, [comicDetailResponse.followersCount]);

  const sortedChapters = [...comicDetailResponse.chapters].sort((a, b) => b.chapterNumber - a.chapterNumber);

  const filteredChapters = sortedChapters.filter(chapter => {
    if (!searchTerm.trim()) return true;

    const searchLower = searchTerm.toLowerCase().trim();
    const chapterNumberMatch = chapter.chapterNumber.toString().includes(searchLower);

    return chapterNumberMatch;
  });

  const displayedChapters = searchTerm.trim()
    ? filteredChapters
    : showAllChapters
      ? filteredChapters
      : filteredChapters.slice(0, 5);

  const handleFollow = async () => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để theo dõi truyện");
      return;
    }
    if (isFollowing) {
      const response = await unfollowComic(comicDetailResponse.id);
      if (response.status === 200) {
        toast.success("Đã bỏ theo dõi truyện");
        setIsFollowing(false);
        setFollowersCount(prev => Math.max(0, prev - 1));
      } else {
        toast.error(response.message || "Lỗi khi bỏ theo dõi truyện");
      }
    } else {
      const response = await followComic(comicDetailResponse.id);
      if (response.status === 200) {
        toast.success("Đã theo dõi truyện");
        setIsFollowing(true);
        setFollowersCount(prev => prev + 1);
      } else {
        toast.error(response.message || "Lỗi khi theo dõi truyện");
      }
    }
  };

  const handleBuyChapter = async (chapterId: string) => {
    if (!isAuthenticated || !user) {
      toast.error("Vui lòng đăng nhập để mua chương");
      return;
    }

    // Tìm chapter để kiểm tra hasPurchased
    const chapter = comicDetailResponse.chapters.find(ch => ch.id === chapterId);
    if (chapter?.hasPurchased) {
      toast.error("Bạn đã sở hữu chương này");
      return;
    }

    if (buyingChapters.has(chapterId)) {
      return; // Đang trong quá trình mua
    }

    setBuyingChapters(prev => new Set(prev).add(chapterId));

    try {
      const response = await buyChapter(chapterId);
      if (response.status === 200) {
        toast.success("Mua chương thành công!");

        // Cập nhật hasPurchased trong chapter
        if (chapter) {
          chapter.hasPurchased = true;
        }
      } else {
        toast.error(response.message || "Lỗi khi mua chương");
      }
    } catch (error) {
      console.error("Error buying chapter:", error);
      toast.error("Có lỗi xảy ra khi mua chương");
    } finally {
      setBuyingChapters(prev => {
        const newSet = new Set(prev);
        newSet.delete(chapterId);
        return newSet;
      });
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  return {
    isFollowing,
    showAllChapters,
    searchTerm,
    sortedChapters,
    filteredChapters,
    displayedChapters,
    followersCount,
    buyingChapters,

    handleFollow,
    handleBuyChapter,
    clearSearch,
    setShowAllChapters,
    setSearchTerm,
  };

}