import Link from "next/link";

export default function Content() {
  return (
    <main className="flex justify-center items-center min-h-screen">
      <Link
        href="/admin/dashboard"
        className="px-4 py-2 text-green-700 border border-green-600 rounded-lg bg-white hover:bg-green-700 hover:text-white transition-all duration-75"
      >
        Dashboard
      </Link>
    </main>
  );
}
