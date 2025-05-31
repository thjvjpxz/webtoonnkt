"use client";

import DashboardLayout from "@/components/admin/DashboardLayout";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiSearch,
  FiAlertCircle,
  FiAward,
  FiLayers,
} from "react-icons/fi";
import Pagination from "@/components/admin/Pagination";
import LevelModal from "@/components/admin/levels/LevelModal";
import LevelTypeModal from "@/components/admin/levels/LevelTypeModal";
import { formatDate } from "@/utils/helpers";
import { useLevel } from "@/hooks/useLevel";
import DeleteLevelModal from "@/components/admin/levels/DeleteLevelModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";

export default function Levels() {
  const {
    // Trạng thái chung
    activeTab,
    setActiveTab,
    isLoading,
    error,

    // Trạng thái level
    levels,
    levelCurrentPage,
    setLevelCurrentPage,
    levelTotalPages,
    levelSearchTerm,
    setLevelSearchTerm,
    setIsLevelModalOpen,

    // Trạng thái level type
    levelTypes,
    filteredLevelTypes,
    levelTypeSearchTerm,
    setLevelTypeSearchTerm,
    setIsLevelTypeModalOpen,

    // Modal states
    isLevelModalOpen,
    isLevelTypeModalOpen,
    isDeleteModalOpen,
    currentLevel,
    currentLevelType,
    deleteItemType,
    deleteItemName,
    setIsDeleteModalOpen,

    // Xử lý API
    fetchLevels,
    fetchLevelTypes,

    // Xử lý hành động
    handleLevelSearch,
    handleLevelTypeSearch,
    handleOpenAddLevelModal,
    handleOpenEditLevelModal,
    handleOpenDeleteLevelModal,
    handleOpenAddLevelTypeModal,
    handleOpenEditLevelTypeModal,
    handleOpenDeleteLevelTypeModal,
    handleSubmitLevel,
    handleSubmitLevelType,
    handleDelete,
  } = useLevel();

  return (
    <DashboardLayout title="Quản lý Level và Loại Level">
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "level" | "levelType")} className="mb-6">
        <TabsList className="grid w-full grid-cols-2 bg-muted/50">
          <TabsTrigger
            value="level"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <FiAward className="mr-2" size={16} />
            Quản lý Level
          </TabsTrigger>
          <TabsTrigger
            value="levelType"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <FiLayers className="mr-2" size={16} />
            Quản lý Loại Level
          </TabsTrigger>
        </TabsList>

        {/* Tab Level */}
        <TabsContent value="level" className="space-y-6">
          {/* Search and Add Button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <form onSubmit={handleLevelSearch} className="relative">
              <Input
                type="text"
                placeholder="Tìm kiếm level..."
                value={levelSearchTerm}
                onChange={(e) => setLevelSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-80 border-border focus:border-primary"
              />
              <FiSearch className="h-5 w-5 text-primary absolute left-3 top-2.5" />
              <button type="submit" className="hidden">
                Tìm kiếm
              </button>
            </form>

            <Button
              onClick={handleOpenAddLevelModal}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              aria-label="Thêm level mới"
              title="Thêm level mới"
            >
              <FiPlus className="mr-2" size={18} />
              Thêm level mới
            </Button>
          </div>

          {/* Levels Table */}
          <Card className="shadow-medium border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="border-b border-border/50">
              <CardTitle className="text-foreground flex items-center gap-2">
                <FiAward className="text-primary" size={20} />
                Danh sách level
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-8 flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : error ? (
                <div className="p-8 text-center flex flex-col items-center">
                  <FiAlertCircle size={40} className="mb-2 text-destructive" />
                  <p className="text-destructive">{error}</p>
                  <Button
                    onClick={fetchLevels}
                    className="mt-4 bg-primary hover:bg-primary/90"
                  >
                    Thử lại
                  </Button>
                </div>
              ) : levels.length === 0 ? (
                <div className="p-12 text-center">
                  <FiAward className="w-16 h-16 text-muted-foreground mb-4 mx-auto" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Không có level nào
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Chưa có level nào được thêm vào hệ thống.
                  </p>
                  <Button
                    onClick={handleOpenAddLevelModal}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <FiPlus className="mr-2" size={18} />
                    Thêm level mới
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto custom-scrollbar">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border/50 hover:bg-muted/30">
                        <TableHead className="font-semibold text-foreground">
                          Tên level
                        </TableHead>
                        <TableHead className="font-semibold text-foreground text-center">
                          Loại
                        </TableHead>
                        <TableHead className="font-semibold text-foreground text-center">
                          Số level
                        </TableHead>
                        <TableHead className="font-semibold text-foreground text-center">
                          Điểm KN
                        </TableHead>
                        <TableHead className="font-semibold text-foreground text-center">
                          Màu sắc
                        </TableHead>
                        <TableHead className="font-semibold text-foreground text-center">
                          Hình ảnh
                        </TableHead>
                        <TableHead className="font-semibold text-foreground text-center">
                          Thao tác
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {levels.map((level) => (
                        <TableRow
                          key={level.id}
                          className="border-border/50 hover:bg-muted/20 transition-colors duration-200"
                        >
                          <TableCell className="py-4">
                            <div className="font-semibold text-foreground"
                              style={{
                                color: level.levelNumber === 1 ? level.urlGif : "transparent",
                                backgroundImage: level.levelNumber !== 1 ? `url(${level.urlGif})` : "none",
                                backgroundSize: level.levelNumber !== 1 ? "auto" : "none",
                                backgroundPosition: level.levelNumber !== 1 ? "center" : "none",
                                WebkitBackgroundClip: level.levelNumber !== 1 ? "text" : "none",
                              }}
                            >
                              {level.name}
                            </div>
                          </TableCell>
                          <TableCell className="py-4 text-center">
                            <div className="text-foreground">
                              {level.levelType.name}
                            </div>
                          </TableCell>
                          <TableCell className="py-4 text-center">
                            <div className="text-foreground">
                              {level.levelNumber}
                            </div>
                          </TableCell>
                          <TableCell className="py-4 text-center">
                            <div className="text-foreground">
                              {level.expRequired.toLocaleString()}
                            </div>
                          </TableCell>
                          <TableCell className="py-4 text-center">
                            <div className="flex justify-center">
                              <div
                                className="w-6 h-6 rounded-full"
                                style={{ background: level.color }}
                              ></div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4 text-center">
                            <div className="flex justify-center">
                              {level.urlGif && level.levelNumber !== 1 ? (
                                <Image
                                  src={level.urlGif}
                                  alt={level.name}
                                  width={40}
                                  height={40}
                                  loading="lazy"
                                  className="object-cover rounded !h-10"
                                />
                              ) : level.levelNumber === 1 ? (
                                <div
                                  className="w-10 h-10 rounded"
                                  style={{
                                    backgroundColor: level.urlGif,
                                  }}
                                ></div>
                              ) : (
                                <span className="text-muted-foreground">Không có</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="py-4 text-center">
                            <div className="flex justify-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleOpenEditLevelModal(level)}
                                className="h-8 px-2 text-primary hover:bg-primary/10 hover:text-primary"
                                title="Sửa"
                              >
                                <FiEdit size={16} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleOpenDeleteLevelModal(level)}
                                className="h-8 px-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                title="Xóa"
                              >
                                <FiTrash2 size={16} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Phân trang cho Level */}
              {!isLoading && !error && levels.length > 0 && (
                <div className="p-4 border-t border-border/50">
                  <Pagination
                    currentPage={levelCurrentPage}
                    totalPages={levelTotalPages}
                    onPageChange={setLevelCurrentPage}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Level Type */}
        <TabsContent value="levelType" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <form onSubmit={handleLevelTypeSearch} className="relative">
              <Input
                type="text"
                placeholder="Tìm kiếm loại level..."
                value={levelTypeSearchTerm}
                onChange={(e) => setLevelTypeSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-80 border-border focus:border-primary"
              />
              <FiSearch className="h-5 w-5 text-primary absolute left-3 top-2.5" />
              <button type="submit" className="hidden">
                Tìm kiếm
              </button>
            </form>

            <Button
              onClick={handleOpenAddLevelTypeModal}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              aria-label="Thêm loại level mới"
              title="Thêm loại level mới"
            >
              <FiPlus className="mr-2" size={18} />
              Thêm loại level mới
            </Button>
          </div>

          <Card className="shadow-medium border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="border-b border-border/50">
              <CardTitle className="text-foreground flex items-center gap-2">
                <FiLayers className="text-primary" size={20} />
                Danh sách loại level
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-8 flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : error ? (
                <div className="p-8 text-center flex flex-col items-center">
                  <FiAlertCircle size={40} className="mb-2 text-destructive" />
                  <p className="text-destructive">{error}</p>
                  <Button
                    onClick={fetchLevelTypes}
                    className="mt-4 bg-primary hover:bg-primary/90"
                  >
                    Thử lại
                  </Button>
                </div>
              ) : filteredLevelTypes.length === 0 ? (
                <div className="p-12 text-center">
                  <FiLayers className="w-16 h-16 text-muted-foreground mb-4 mx-auto" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Không có loại level nào
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Chưa có loại level nào được thêm vào hệ thống.
                  </p>
                  <Button
                    onClick={handleOpenAddLevelTypeModal}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <FiPlus className="mr-2" size={18} />
                    Thêm loại level mới
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto custom-scrollbar">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border/50 hover:bg-muted/30">
                        <TableHead className="font-semibold text-foreground">
                          Tên loại level
                        </TableHead>
                        <TableHead className="font-semibold text-foreground text-center">
                          Ngày tạo
                        </TableHead>
                        <TableHead className="font-semibold text-foreground text-center">
                          Ngày cập nhật
                        </TableHead>
                        <TableHead className="font-semibold text-foreground text-center">
                          Thao tác
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLevelTypes.map((levelType) => (
                        <TableRow
                          key={levelType.id}
                          className="border-border/50 hover:bg-muted/20 transition-colors duration-200"
                        >
                          <TableCell className="py-4">
                            <div className="font-semibold text-foreground">
                              {levelType.name}
                            </div>
                          </TableCell>
                          <TableCell className="py-4 text-center">
                            <div className="text-foreground">
                              {formatDate(levelType.createdAt)}
                            </div>
                          </TableCell>
                          <TableCell className="py-4 text-center">
                            <div className="text-foreground">
                              {formatDate(levelType.updatedAt)}
                            </div>
                          </TableCell>
                          <TableCell className="py-4 text-center">
                            <div className="flex justify-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleOpenEditLevelTypeModal(levelType)}
                                className="h-8 px-2 text-primary hover:bg-primary/10 hover:text-primary"
                                title="Sửa"
                              >
                                <FiEdit size={16} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleOpenDeleteLevelTypeModal(levelType)}
                                className="h-8 px-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                title="Xóa"
                              >
                                <FiTrash2 size={16} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal thêm/sửa Level */}
      {isLevelModalOpen && (
        <LevelModal
          isOpen={isLevelModalOpen}
          onClose={() => setIsLevelModalOpen(false)}
          onSubmit={handleSubmitLevel}
          levelTypes={levelTypes}
          level={currentLevel}
        />
      )}

      {/* Modal thêm/sửa Loại Level */}
      {isLevelTypeModalOpen && (
        <LevelTypeModal
          isOpen={isLevelTypeModalOpen}
          onClose={() => setIsLevelTypeModalOpen(false)}
          onSubmit={handleSubmitLevelType}
          levelType={currentLevelType}
        />
      )}

      {/* Modal xác nhận xóa */}
      {isDeleteModalOpen && (
        <DeleteLevelModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
          itemType={deleteItemType}
          itemName={deleteItemName}
        />
      )}
    </DashboardLayout>
  );
}