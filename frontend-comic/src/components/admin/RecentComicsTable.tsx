import React from "react";
import Image from "next/image";
import { FiEdit, FiTrash2, FiEye } from "react-icons/fi";
import { ComicData } from "@/types/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const RecentComicsTable = ({ comics }: { comics: ComicData[] }) => {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "published":
        return "default";
      case "draft":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "published":
        return "Đã xuất bản";
      case "draft":
        return "Bản nháp";
      default:
        return "Đang xét duyệt";
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "published":
        return "status-success";
      case "draft":
        return "status-warning";
      default:
        return "status-info";
    }
  };

  return (
    <Card className="shadow-medium border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="border-b border-border/50">
        <CardTitle className="text-foreground flex items-center gap-2">
          <FiEye className="text-primary" size={20} />
          Truyện mới cập nhật
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-muted/30">
                <TableHead className="font-semibold text-foreground">Truyện</TableHead>
                <TableHead className="font-semibold text-foreground">Tác giả</TableHead>
                <TableHead className="font-semibold text-foreground">Lượt xem</TableHead>
                <TableHead className="font-semibold text-foreground">Trạng thái</TableHead>
                <TableHead className="font-semibold text-foreground">Cập nhật</TableHead>
                <TableHead className="font-semibold text-foreground text-center">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comics.map((comic) => (
                <TableRow
                  key={comic.id}
                  className="border-border/50 hover:bg-muted/20 transition-colors duration-200"
                >
                  <TableCell className="py-4">
                    <div className="flex items-center">
                      <div className="h-12 w-12 flex-shrink-0 mr-4">
                        <Image
                          src={comic.coverImage}
                          alt={comic.title}
                          width={48}
                          height={48}
                          className="rounded-lg object-cover shadow-soft border border-border/30"
                        />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground text-sm">
                          {comic.title}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground font-medium">
                    {comic.author}
                  </TableCell>
                  <TableCell className="text-muted-foreground font-medium">
                    <span className="inline-flex items-center gap-1">
                      <FiEye size={14} className="text-primary" />
                      {comic.views.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(comic.status)}`}>
                      {getStatusText(comic.status)}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground font-medium">
                    {comic.lastUpdated}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-primary hover:bg-primary/10 hover:text-primary"
                      >
                        <FiEdit size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      >
                        <FiTrash2 size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentComicsTable;
