"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ComicResponse } from "@/types/comic";
import { renderBadge, renderComicAuthor, renderComicCategory, renderComicStatus } from "@/utils/comic-render";
import { formatDate } from "@/utils/helpers";
import { chooseImageUrl } from "@/utils/string";
import Image from "next/image";
import {
  FiBook,
  FiCalendar,
  FiClock,
  FiEye,
  FiFileText,
  FiHash,
  FiHeart,
  FiTag,
  FiUser,
} from "react-icons/fi";

interface ViewComicModalProps {
  isOpen: boolean;
  comic: ComicResponse;
  onClose: () => void;
}

export default function ViewComicModal({ isOpen, comic, onClose }: ViewComicModalProps) {

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
              <FiBook className="h-5 w-5 text-primary" />
              Chi tiết truyện
            </DialogTitle>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] px-6 pb-6">
          <div className="space-y-6">
            {/* Thông tin cơ bản và ảnh bìa */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FiHash className="h-4 w-4 text-primary" />
                  Thông tin cơ bản
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Ảnh bìa truyện */}
                  <div className="w-full md:w-1/4">
                    <div className="relative w-48 h-72 rounded-lg overflow-hidden">
                      <Image
                        src={chooseImageUrl(comic.thumbUrl)}
                        alt={comic.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  {/* Thông tin truyện */}
                  <div className="w-full md:w-3/4 space-y-4">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground mb-2">
                        {comic.name}
                      </h2>
                      {comic.originName && (
                        <p className="text-muted-foreground">
                          <span className="font-medium">Tên gốc:</span> {comic.originName}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <FiUser className="h-4 w-4 text-muted-foreground" />
                        <div className="flex gap-2 items-center">
                          <span className="text-sm text-muted-foreground">Nhà xuất bản:</span>
                          {renderBadge(comic.publisherUserName)}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <FiUser className="h-4 w-4 text-muted-foreground" />
                        <div className="flex gap-2 items-center">
                          <span className="text-sm text-muted-foreground">Tác giả:</span>
                          {renderComicAuthor(comic.author)}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <FiHash className="h-4 w-4 text-muted-foreground" />
                        <div className="flex gap-2 items-center">
                          <span className="text-sm text-muted-foreground">Trạng thái:</span>
                          {renderComicStatus(comic.status)}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <FiEye className="h-4 w-4 text-muted-foreground" />
                        <div className="flex gap-2">
                          <span className="text-sm text-muted-foreground">Lượt xem:</span>
                          <p className="text-sm font-medium">{comic.viewsCount.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <FiHeart className="h-4 w-4 text-muted-foreground" />
                        <div className="flex gap-2">
                          <span className="text-sm text-muted-foreground">Lượt theo dõi:</span>
                          <p className="text-sm font-medium">{comic.followersCount.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <FiCalendar className="h-4 w-4 text-muted-foreground" />
                        <div className="flex gap-2">
                          <span className="text-sm text-muted-foreground">Ngày tạo:</span>
                          <p className="text-sm font-medium">{formatDate(comic.createdAt)}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <FiClock className="h-4 w-4 text-muted-foreground" />
                        <div className="flex gap-2">
                          <span className="text-sm text-muted-foreground">Cập nhật:</span>
                          <p className="text-sm font-medium">{formatDate(comic.updatedAt)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Thể loại */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FiTag className="h-4 w-4 text-primary" />
                  Thể loại
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {comic.categories.map(renderComicCategory)}
                </div>
              </CardContent>
            </Card>

            {/* Mô tả truyện */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FiFileText className="h-4 w-4 text-primary" />
                  Mô tả
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div
                    className="prose prose-sm max-w-none dark:prose-invert text-foreground text-justify leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: comic.description }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog >
  );
}