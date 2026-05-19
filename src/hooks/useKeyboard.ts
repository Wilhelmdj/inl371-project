import { useEffect, useRef } from "react";

export function useKeyboard(active: boolean) {
  const keys = useRef<Record<string, boolean>>({});
  useEffect(() => {
    if (!active) { keys.current = {}; return; }
    const blockScroll = new Set(["ArrowUp", "ArrowDown", " ", "Space"]);
    const down = (e: KeyboardEvent) => {
      keys.current[e.key] = true;
      if (blockScroll.has(e.key)) e.preventDefault();
    };
    const up = (e: KeyboardEvent) => { keys.current[e.key] = false; };
    window.addEventListener("keydown", down, { passive: false });
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [active]);
  return keys;
}
