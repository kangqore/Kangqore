import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// In dev, kangqore-view is proxied through CRA at :3000.
// If a human opens Vite directly at :5174, bounce them to :3000.
// navigator.webdriver is true in Playwright/Selenium — skip redirect in CI.
if (window.location.port === '5174' && !navigator.webdriver) {
  window.location.replace(window.location.href.replace(':5174', ':3000'))
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
