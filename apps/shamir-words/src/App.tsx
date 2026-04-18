import { Header, Footer, TryMoreDemos } from "@forgesworn-demos/ui";
import { Hero } from "./hero/Hero.js";
import { Playground } from "./playground/Playground.js";
import { Walkthrough } from "./walkthrough/Walkthrough.js";

export function App() {
  return (
    <>
      <Header current="shamir-words" />
      <main>
        <Hero />
        <Playground />
        <Walkthrough />
        <TryMoreDemos current="shamir-words" />
      </main>
      <Footer />
    </>
  );
}
