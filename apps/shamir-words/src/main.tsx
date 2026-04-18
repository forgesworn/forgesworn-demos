import { render } from "preact";
import "@forgesworn-demos/ui/theme.css";
import "./styles.css";
import { App } from "./App.js";

const root = document.getElementById("app");
if (!root) throw new Error("Root element #app not found");
render(<App />, root);
