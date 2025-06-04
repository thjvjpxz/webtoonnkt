"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { FiHome, FiRefreshCw, FiTag } from "react-icons/fi";
import Link from "next/link";
import CategoryGridComponent from "@/components/category/CategoryGridComponent";
import CategoryGridSkeletonComponent from "@/components/category/CategoryGridSkeletonComponent";
import { notFound } from "next/navigation";
import Main from "@/components/layout/Main";
import { useState, useEffect } from "react";
import { getAllCategories } from "@/services/categoryService";
import { CategoryResponse } from "@/types/category";

export default function CategoryPage() {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);

      const response = await getAllCategories();

      if (response.status === 200 && response.data) {
        setCategories(response.data);
      } else {
        setCategories([]);
      }
    } catch (err) {
      setCategories([]);
      console.error('Lỗi khi fetch categories:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh data
  const refresh = () => {
    fetchCategories();
  };

  // Initial load
  useEffect(() => {
    fetchCategories();
  }, []);

  if (isLoading) {
    return (
      <CategoryGridSkeletonComponent title="Tất cả thể loại" itemCount={15} />
    )
  }

  if (categories.length === 0) {
    notFound();
  }

  return (
    <Main>
      <div className="my-4 sm:my-6 lg:my-8 ">
        {/* Breadcrumb Navigation */}
        <div className="mb-4 sm:mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/" className="flex items-center gap-1">
                    <FiHome className="w-4 h-4" />
                    Trang chủ
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="flex items-center gap-1">
                  <FiTag className="w-4 h-4" />
                  Thể loại
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Page Header */}
        <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 shadow-sm mb-4 sm:mb-6">
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  Tất cả thể loại
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  Khám phá truyện tranh theo thể loại yêu thích của bạn
                </p>
              </div>
              <Button
                onClick={refresh}
                variant="outline"
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <FiRefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                Làm mới
              </Button>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <CategoryGridComponent
          categories={categories}
          title="Tất cả thể loại"
        />
      </div>
    </Main>
  );
}
