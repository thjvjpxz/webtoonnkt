import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import Image from "next/image";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

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
            className="w-64"
          />
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
