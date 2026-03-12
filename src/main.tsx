import { createRoot } from "react-dom/client";
import "@fontsource-variable/quicksand";
import "@fontsource-variable/cabin";
import "@fontsource-variable/inconsolata";

// Leaflet CSS and compatibility
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
