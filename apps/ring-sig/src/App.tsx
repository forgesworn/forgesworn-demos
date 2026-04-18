import { Header, Footer } from "@forgesworn-demos/ui";
import { Hero } from "./hero/Hero.js";

export function App() {
  return (
    <>
      <Header current="ring-sig" />
      <main>
        <Hero />
      </main>
      <Footer />
    </>
  );
}
