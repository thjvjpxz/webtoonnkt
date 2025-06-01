import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Content from "@/components/home/Content";
import Nav from "@/components/Nav";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  return (
    <div>
      <Header />
      <Nav />
      <div className="flex flex-col min-h-screen container mx-auto">
        <Sidebar />
        <Content />
        <Footer />
      </div>
    </div>
  );
}
