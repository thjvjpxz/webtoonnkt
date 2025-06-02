import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Comic Admin Dashboard",
  description: "Quản lý website truyện tranh",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        {/* <link rel="stylesheet" href="/css/scrollbar.css" type="text/css" media="all" /> */}
        {/* Logo */}
        <link rel="icon" href="/images/icon_logo.ico" />
      </head>
      <body className={`${inter.className}`}>
        <ThemeProvider>
          <AuthProvider>

            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: "#363636",
                  color: "#fff",
                },
                success: {
                  style: {
                    background: "var(--success)",
                  },
                },
                error: {
                  style: {
                    background: "var(--destructive)",
                  },
                },
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
