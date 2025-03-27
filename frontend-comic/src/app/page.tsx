import Link from "next/link";

export default function Home() {
  return (
    <div className="flex justify-center w-full h-screen items-center">
      <Link href="/dashboard" className="px-4 py-2 text-green-700 border border-green-600 rounded-lg bg-white hover:bg-green-700 hover:text-white transition-all duration-75">Dashboard</Link>
    </div>
  );
}
