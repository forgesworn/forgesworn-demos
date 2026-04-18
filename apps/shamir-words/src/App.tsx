import { Header, Footer } from "@forgesworn-demos/ui";
import { Hero } from "./hero/Hero.js";
import { Playground } from "./playground/Playground.js";

export function App() {
  return (
    <>
      <Header current="shamir-words" />
      <main>
        <Hero />
        <Playground />
      </main>
      <Footer />
    </>
  );
}
