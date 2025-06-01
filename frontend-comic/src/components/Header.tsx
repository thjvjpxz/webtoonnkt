import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import Image from "next/image";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { FiSearch } from "react-icons/fi";

export default function Header() {
  return (
    <header className="flex justify-between items-center py-3 pe-5 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-2">
        <Link href="/">
          <Image
            src={"/images/logo.svg"}
            alt="logo"
            width={200}
            height={20}
            className="object-cover"
          />
        </Link>
        {/* Search bar */}
        <div className="flex gap-2 relative">
          <Input
            placeholder="Tìm kiếm truyện..."
            className="pl-10 w-full sm:w-80 border-border focus:border-primary"
          />
          <FiSearch className="h-5 w-5 text-primary absolute left-3 top-2" />
          <button type="submit" className="hidden">
            Tìm kiếm
          </button>
        </div>
        {/* End Search bar */}
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button variant="outline" size="sm">
          Đăng ký
        </Button>
        <Button size="sm">
          Đăng nhập
        </Button>
      </div>
    </header>
  );
}
