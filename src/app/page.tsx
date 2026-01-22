import { Header, Footer } from "@/components/layout";
import { Hero, Introduction, FeaturedProducts, MeetTheAnimals, Newsletter } from "@/components/home";

export default function Home() {
  return (
    <>
      <Header />
      <main className="pt-0">
        <Hero />
        <Introduction />
        <FeaturedProducts />
        <MeetTheAnimals />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
