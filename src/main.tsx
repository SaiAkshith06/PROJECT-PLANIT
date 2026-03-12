import { createRoot } from "react-dom/client";
import "@fontsource-variable/quicksand";
import "@fontsource-variable/cabin";
import "@fontsource-variable/inconsolata";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
