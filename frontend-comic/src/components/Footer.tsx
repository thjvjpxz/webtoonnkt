import Link from "next/link";
import { FaFacebook, FaGithub, FaTwitter } from "react-icons/fa";

const socialLinks = [
  {
    href: "https://www.facebook.com/thi.17.8",
    icon: <FaFacebook className="w-6 h-6 text-[var(--primary)] hover:text-[var(--success)] transition-all duration-200" />,
  },
  {
    href: "https://github.com/thjvjpxz",
    icon: <FaGithub className="w-6 h-6 text-[var(--primary)] hover:text-[var(--success)] transition-all duration-200" />,
  }
];

export default function Footer() {
  return (
    <footer className="bg-[var(--background)]  border-t border-[var(--border)]">
      <div className="flex flex-col items-center justify-center py-6">
        <p className="text-sm text-center text-[var(--foreground)]">
          &copy; 2025 Nguyễn Kim Thi
        </p>
        <div className="mt-3 flex justify-center items-center gap-2 ">
          {
            socialLinks.map((link) => (
              <Link
                href={link.href}
                key={link.href}
              >
                {link.icon}
              </Link>
            ))
          }
        </div>
      </div>
    </footer>
  );
}
