"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Main from "@/components/layout/Main";
import { FiHome, FiArrowLeft } from "react-icons/fi";

export default function NotFound() {
  return (
    <Main>
      <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-background select-none">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* 404 Illustration */}
          <div className="relative">
            <div className="text-[8rem] md:text-[12rem] font-bold text-transparent bg-gradient-to-r from-primary to-primary/50 bg-clip-text leading-none">
              404
            </div>
            <div className="absolute inset-0 text-[8rem] md:text-[12rem] font-bold text-muted-foreground/10 leading-none">
              404
            </div>
          </div>

          {/* Error Message */}
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Trang không tìm thấy
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Xin lỗi! Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <Link href="/">
              <Button
                variant="default"
                size="lg"
                className="w-full h-14 text-base gap-2 group"
              >
                <FiHome className="w-5 h-5 transition-transform group-hover:scale-110" />
                Về trang chủ
              </Button>
            </Link>

            <Button
              variant="outline"
              size="lg"
              className="w-full h-14 text-base gap-2 group"
              onClick={() => window.history.back()}
            >
              <FiArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              Quay lại
            </Button>
          </div>

        </div>
      </div>
    </Main>
  );
}