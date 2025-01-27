import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import App from "./App";
import { CategoryProvider } from "./context/CategoryContext";
import { LoadingProvider } from "./context/LoadingContext";
import { ErrorProvider } from "./context/ErrorContext";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <ErrorProvider>
      <LoadingProvider>
        <CategoryProvider>
          <App />
        </CategoryProvider>
      </LoadingProvider>
    </ErrorProvider>
  </StrictMode>
);
