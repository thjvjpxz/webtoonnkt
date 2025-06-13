import React from "react";
import { Badge } from "@/components/ui/badge";
import { getUsernameStyle, getLevelBadgeStyle } from "@/utils/user-style";
import { LevelResponse } from "@/types/level";

interface UserNameProps {
  username: string;
  level?: LevelResponse;
  showLevel?: boolean;
  className?: string;
  levelClassName?: string;
}

/**
 * Component hiển thị username với style dựa trên level
 * và tùy chọn hiển thị level badge
 */
export default function UserName({
  username,
  level,
  showLevel = true,
  className = "",
  levelClassName = "text-xs bg-white dark:bg-gray-800 border rounded",
}: UserNameProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span style={getUsernameStyle(level)}>
        {username}
      </span>
      {showLevel && level && level.name && (
        <Badge
          className={levelClassName}
          style={getLevelBadgeStyle(level.color)}
        >
          {level.name}
        </Badge>
      )}
    </span>
  );
} 