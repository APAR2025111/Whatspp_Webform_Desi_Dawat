import React from "react";
import { createRoot } from "react-dom/client";
import WhatsAppOrderFormPage from "./WhatsAppOrderFormPage.jsx";
import "./standalone.css";
import "./order-form.css";

function StandaloneOrderApp() {
  return (
    <div className="standalone-order-app">
      <main id="top"><WhatsAppOrderFormPage /></main>
      <footer className="standalone-order-footer">Desi Dawat · Pateniementie 59, 90800 Oulu, Finland</footer>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<StandaloneOrderApp />);
