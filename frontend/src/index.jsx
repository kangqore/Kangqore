import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";
import "./i18n";
import App from "@/App";

// Apply saved theme before first paint to prevent flash
;(function() {
  const saved = localStorage.getItem('kq-theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  if (saved === 'dark' || (!saved && prefersDark)) {
    document.documentElement.classList.add('dark')
  }
})()

// Nuke any active service workers — they were intercepting API POST requests.
// On first load: unregister all, then force a reload so the page runs clean.
// sessionStorage flag prevents the reload from looping.
if ('serviceWorker' in navigator) {
  const alreadyKilled = sessionStorage.getItem('sw-killed')
  if (!alreadyKilled) {
    navigator.serviceWorker.getRegistrations().then(regs => {
      if (regs.length > 0) {
        Promise.all(regs.map(r => r.unregister())).then(() => {
          sessionStorage.setItem('sw-killed', '1')
          window.location.reload()
        })
      } else {
        sessionStorage.setItem('sw-killed', '1')
      }
    })
  }
}

const rootElement = document.getElementById("root");

if (rootElement.hasChildNodes()) {
  ReactDOM.hydrateRoot(
    rootElement,
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
