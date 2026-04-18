import { Header, Footer } from "@forgesworn-demos/ui";

export function App() {
  return (
    <>
      <Header current="ring-sig" />
      <main>
        <section class="hero">
          <h1>ring-sig</h1>
          <p>Sign as one of a group. Hidden within the ring.</p>
          <p class="placeholder">Hero interaction lands across Tasks 3.1–3.5.</p>
        </section>
      </main>
      <Footer />
    </>
  );
}
