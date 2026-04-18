import { render } from "preact";
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "@forgesworn-demos/ui/theme.css";
import "./styles.css";
import { App } from "./App.js";

const root = document.getElementById("app");
if (!root) throw new Error("Root element #app not found");
render(<App />, root);
