import { Header, Footer, TryMoreDemos } from "@forgesworn-demos/ui";
import { Hero } from "./hero/Hero.js";
import { Playground } from "./playground/Playground.js";
import { VerifyView } from "./verify/VerifyView.js";
import { Walkthrough } from "./walkthrough/Walkthrough.js";

function getVerifyParam(): string | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  return params.get("verify");
}

export function App() {
  const encoded = getVerifyParam();
  return (
    <>
      <Header current="range-proof" />
      <main>
        {encoded ? (
          <VerifyView encoded={encoded} />
        ) : (
          <>
            <Hero />
            <Playground />
            <Walkthrough />
            <TryMoreDemos current="range-proof" />
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
