import { LevelResponse } from "@/types/level";
import { getFirstColorFromGradient } from "@/utils/string";

/**
 * Tạo style object cho username dựa trên level của user
 * @param level - Level object của user (LevelResponse hoặc LevelInfo)
 * @returns CSS style object
 */
export function getUsernameStyle(level?: LevelResponse) {
  if (!level) {
    return {};
  }

  if (level.levelNumber === 1) {
    return {
      color: level.urlGif,
    };
  }

  return {
    color: "transparent",
    backgroundImage: `url(${level.urlGif})`,
    backgroundSize: "auto",
    backgroundPosition: "center",
    WebkitBackgroundClip: "text",
  };
}

/**
 * Tạo style object cho level badge
 * @param levelColor - Màu của level (có thể là linear-gradient)
 * @returns CSS style object
 */
export function getLevelBadgeStyle(levelColor?: string) {
  if (!levelColor) {
    return {};
  }

  if (levelColor.startsWith('linear-gradient')) {
    return {
      background: levelColor,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      borderColor: getFirstColorFromGradient(levelColor),
    };
  }

  return {
    color: levelColor,
    borderColor: levelColor,
  };
} 