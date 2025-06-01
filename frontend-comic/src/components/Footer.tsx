import Link from "next/link";
import Image from "next/image";
import {
  FaFacebook,
  FaGithub,
  FaTwitter,
  FaInstagram
} from "react-icons/fa";
import { FiHeart } from "react-icons/fi";

const socialLinks = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/thi.17.8",
    icon: <FaFacebook className="w-5 h-5" />,
    color: "hover:text-blue-600"
  },
  {
    name: "GitHub",
    href: "https://github.com/thjvjpxz",
    icon: <FaGithub className="w-5 h-5" />,
    color: "hover:text-gray-900 dark:hover:text-gray-100"
  },
]

const quickLinks = [
  { name: "Trang chủ", href: "/" },
  { name: "Truyện hot", href: "/hot" },
  { name: "Truyện mới cập nhật", href: "/new" },
  { name: "Thể loại", href: "/categories" },
];

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-4 py-8">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo & Description */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image
                src="/images/logo.svg"
                alt="Comic Logo"
                width={120}
                height={24}
                className="object-contain"
              />
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Nền tảng đọc truyện tranh online miễn phí với hàng ngàn bộ truyện hay được cập nhật liên tục.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Theo dõi chúng tôi</h3>
            <div className="flex items-center gap-3">
              {socialLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-muted-foreground transition-all duration-200 hover:scale-110 ${link.color}`}
                  aria-label={link.name}
                  title={link.name}
                >
                  {link.icon}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>&copy; 2025 Nguyễn Kim Thi</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/" className="hover:text-primary transition-colors">
                Điều khoản
              </Link>
              <Link href="/" className="hover:text-primary transition-colors">
                Bảo mật
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
