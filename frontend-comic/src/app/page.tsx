import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import Content from "@/components/home/Content";
import Nav from "@/components/layout/Nav";
import Sidebar from "@/components/layout/Sidebar";

export default function Home() {
  return (
    <div>
      <Header />
      <Nav />
      <div className="flex flex-col min-h-screen container mx-auto">
        <Sidebar />
        <Content />
      </div>
      <Footer />
    </div>
  );
}
