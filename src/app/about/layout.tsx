import { Header, Footer } from "@/components/layout";

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="pt-20">{children}</main>
      <Footer />
    </>
  );
}
