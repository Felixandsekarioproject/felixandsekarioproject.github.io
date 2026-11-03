"use client";

import { useEffect } from "react";

/**
 * While the page is scrolling, add a "scrolling" class to <html>.
 * CSS uses it to switch off map hover effects during scrolling, so the
 * browser doesn't redraw the map every time a state passes under the mouse.
 * Hover works again ~150 ms after scrolling stops.
 */
export default function ScrollCalm() {
  useEffect(() => {
    const root = document.documentElement;
    let timer: number | undefined;
    const onScroll = () => {
      if (!root.classList.contains("scrolling")) root.classList.add("scrolling");
      window.clearTimeout(timer);
      timer = window.setTimeout(() => root.classList.remove("scrolling"), 150);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(timer);
    };
  }, []);
  return null;
}
