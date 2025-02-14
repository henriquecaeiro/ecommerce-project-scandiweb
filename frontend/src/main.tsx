import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./index.css";
import App from "./App";
import Providers from "./context/Providers";


const rootElement = document.getElementById("root");

// Throws an error if the root element is not found
if (!rootElement) {
  throw new Error("Root element not found");
}

// Initializes the React application and renders it inside the root element
createRoot(rootElement as HTMLElement).render(
  <StrictMode>
    <Providers>
      <App />
    </Providers>
  </StrictMode>
);
