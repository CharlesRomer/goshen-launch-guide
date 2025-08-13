import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

// Mouseflow Website ID (public). Replace if you change projects.
const MOUSEFLOW_ID = "7e4b2660-87cc-44b5-b5a3-e266d4ba0e1e";
const SCRIPT_ID = "mouseflow-cdn-script";

declare global {
  interface Window {
    mouseflow?: {
      newPageView?: (path?: string) => void;
    };
  }
}

export default function MouseflowTracker() {
  const location = useLocation();
  const didMountRef = useRef(false);
  const [loaded, setLoaded] = useState<boolean>(!!window.mouseflow);

  useEffect(() => {
    // If script already present, just wait for availability
    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      if (window.mouseflow) setLoaded(true);
      else existing.addEventListener("load", () => setLoaded(true));
      return;
    }

    // Inject Mouseflow CDN script for this project
    const s = document.createElement("script");
    s.id = SCRIPT_ID;
    s.defer = true;
    s.async = true;
    s.src = `https://cdn.mouseflow.com/projects/${MOUSEFLOW_ID}.js`;
    s.addEventListener("load", () => setLoaded(true));
    document.head.appendChild(s);
  }, []);

  // Ensure SPA virtual pageviews on route change
  useEffect(() => {
    if (didMountRef.current) {
      if (loaded && window.mouseflow?.newPageView) {
        window.mouseflow.newPageView(location.pathname + location.search);
      }
    } else {
      didMountRef.current = true;
    }
  }, [loaded, location.pathname, location.search]);

  return null;
}
