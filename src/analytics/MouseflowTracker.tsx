import { mouseflow } from "react-mouseflow";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

// Mouseflow Website ID (public). Replace if you change projects.
const MOUSEFLOW_ID = "7e4b2660-87cc-44b5-b5a3-e266d4ba0e1e";

export default function MouseflowTracker() {
  const location = useLocation();
  const didMountRef = useRef(false);

  // Initialize Mouseflow once
  useEffect(() => {
    mouseflow.initialize(MOUSEFLOW_ID);
  }, []);

  // Ensure SPA virtual pageviews on route change
  useEffect(() => {
    if (didMountRef.current) {
      mouseflow.newPageView(location.pathname + location.search);
    } else {
      didMountRef.current = true;
    }
  }, [location.pathname, location.search]);

  return null;
}
