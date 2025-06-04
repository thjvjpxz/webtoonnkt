import { useEffect } from "react";

import { useAuth } from "@/contexts/AuthContext";

import { useState } from "react";
import { checkFollowComic, followComic, unfollowComic } from "@/services/comicDetailService";
import toast from "react-hot-toast";
import { ComicDetailResponse } from "@/types/comic";

export default function useComicDetail(comicDetailResponse: ComicDetailResponse) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [showAllChapters, setShowAllChapters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [followersCount, setFollowersCount] = useState(comicDetailResponse.followersCount);

  const { isAuthenticated } = useAuth();

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

    handleFollow,
    clearSearch,
    setShowAllChapters,
    setSearchTerm,
  };

}