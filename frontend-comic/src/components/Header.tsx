import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import Image from "next/image";
import Button from "./ui/Button";
import { FiSearch } from "react-icons/fi";
import Input from "./ui/Input";

export default function Header() {
  return (
    <header className="flex justify-between items-center py-3 pe-5">
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
            leftIcon={<FiSearch className="h-5 w-5 text-green-400 dark:text-green-500" />}
          />
        </div>

        {/* End Search bar */}
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button variant="primaryOutline" size="sm">
          Đăng ký
        </Button>
        <Button variant="primary" size="sm">
          Đăng nhập
        </Button>
      </div>
    </header>
  );
}
