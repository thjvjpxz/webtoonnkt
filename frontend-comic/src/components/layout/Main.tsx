import { Suspense } from "react";
import Footer from "./Footer";
import Header from "./Header";
import Nav from "./Nav";
import { LoadingSpinner } from "../ui/loading-spinner";

function HeaderFallback() {
  return (
    <header className="top-0 z-50 bg-background dark:bg-dark-900 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto">
        <div className="flex items-center justify-between py-3 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-40 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
          <div className="flex items-center gap-2">
            <LoadingSpinner size="sm" />
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Main({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Suspense fallback={<HeaderFallback />}>
        <Header />
      </Suspense>
      <Nav />
      <div className="flex flex-col min-h-screen container mx-auto">
        {children}
      </div>
      <Footer />
    </div>
  );
}
