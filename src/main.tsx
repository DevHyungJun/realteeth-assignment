import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { queryClient } from "./shared/config/query-client";
import { ToastProvider } from "./shared/context/ToastContext";
import { Toast } from "./shared/ui";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
          <Toast />
        </ToastProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </StrictMode>
);
