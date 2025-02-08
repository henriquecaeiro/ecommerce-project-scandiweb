import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./index.css";
import App from "./App";
import { CategoryProvider } from "./context/CategoryContext";
import { LoadingProvider } from "./context/LoadingContext";
import { ErrorProvider } from "./context/ErrorContext";
import { CartProvider } from "./context/CartContext";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <ErrorProvider>
      <LoadingProvider>
        <CartProvider>
          <CategoryProvider>
            <App />
          </CategoryProvider>
        </CartProvider>
      </LoadingProvider>
    </ErrorProvider>
  </StrictMode>
);
