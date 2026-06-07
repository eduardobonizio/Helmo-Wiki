import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

function DeferredAnalytics() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const trigger = () => setReady(true);
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(trigger, { timeout: 2000 });
    } else {
      setTimeout(trigger, 200);
    }
  }, []);
  if (!ready) return null;
  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    <DeferredAnalytics />
  </React.StrictMode>,
);

reportWebVitals();
