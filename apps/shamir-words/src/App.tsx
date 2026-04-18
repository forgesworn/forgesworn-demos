import { Header, Footer } from "@forgesworn-demos/ui";

export function App() {
  return (
    <>
      <Header current="shamir-words" />
      <main>
        <section class="hero">
          <h1>shamir-words</h1>
          <p>Split a seed into cards. Any threshold restores.</p>
          <p class="placeholder">Hero interaction lands in Task 2.1.</p>
        </section>
      </main>
      <Footer />
    </>
  );
}
