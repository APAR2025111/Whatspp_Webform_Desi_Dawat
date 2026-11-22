import React from "react";
import { createRoot } from "react-dom/client";
import WhatsAppOrderFormPage from "./WhatsAppOrderFormPage.jsx";
import "./standalone.css";
import "./order-form.css";

function StandaloneOrderApp() {
  return (
    <div className="standalone-order-app">
      <header className="standalone-order-header">
        <a href="#top" className="standalone-order-brand" aria-label="Desi Dawat order form">
          <img src="./images/LOGO.jpeg" alt="Desi Dawat" />
          <span><strong>Desi Dawat</strong><small>Traditional Indian Family Kitchen · Oulu</small></span>
        </a>
        <a className="standalone-order-phone" href="tel:+358449803211">Call +358 44 980 3211</a>
      </header>
      <main id="top"><WhatsAppOrderFormPage /></main>
      <footer className="standalone-order-footer">Desi Dawat · Pateniementie 59, 90800 Oulu, Finland</footer>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<StandaloneOrderApp />);
