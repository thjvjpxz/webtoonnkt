import Footer from "./Footer";
import Header from "./Header";
import Nav from "./Nav";

export default function Main({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      <Nav />
      <div className="flex flex-col min-h-screen container mx-auto">
        {children}
      </div>
      <Footer />
    </div>
  );
}
