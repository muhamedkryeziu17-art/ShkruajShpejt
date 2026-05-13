import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import { AuthProvider } from "./state/AuthProvider";
import { BillingProvider } from "./state/BillingProvider";
import { LegalAcceptanceProvider } from "./state/LegalAcceptanceProvider";
import { ThemeProvider } from "./state/ThemeProvider";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <LegalAcceptanceProvider>
            <BillingProvider>
              <App />
            </BillingProvider>
          </LegalAcceptanceProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
