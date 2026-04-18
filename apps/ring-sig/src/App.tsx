import { Header, Footer, TryMoreDemos } from "@forgesworn-demos/ui";
import { Hero } from "./hero/Hero.js";
import { Playground } from "./playground/Playground.js";
import { Walkthrough } from "./walkthrough/Walkthrough.js";

export function App() {
  return (
    <>
      <Header current="ring-sig" />
      <main>
        <Hero />
        <Playground />
        <Walkthrough />
        <TryMoreDemos current="ring-sig" />
      </main>
      <Footer />
    </>
  );
}
