import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, AnimatePresence } from "motion/react";

export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [hoverText, setHoverText] = useState("");

  const cursorX = useMotionValue(-200);
  const cursorY = useMotionValue(-200);

  const isVisibleRef = useRef(false);

  useEffect(() => {
    let styleEl: HTMLStyleElement | null = null;

    const enableCursor = () => {
      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        setIsVisible(true);
        styleEl = document.createElement("style");
        styleEl.innerHTML = `* { cursor: none !important; }`;
        document.head.appendChild(styleEl);
      }
    };

    const disableCursor = () => {
      if (isVisibleRef.current) {
        isVisibleRef.current = false;
        setIsVisible(false);
        if (styleEl && document.head.contains(styleEl)) {
          document.head.removeChild(styleEl);
          styleEl = null;
        }
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === "mouse") {
        enableCursor();
        cursorX.set(e.clientX);
        cursorY.set(e.clientY);
      } else {
        disableCursor();
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") disableCursor();
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactiveEl = target.closest('a, button, input, textarea, select, [role="button"], [data-cursor]');

      if (interactiveEl) {
        setIsHovering(true);
        const dataCursor =
          interactiveEl.getAttribute("data-cursor") ??
          interactiveEl.closest("[data-cursor]")?.getAttribute("data-cursor");
        if (dataCursor === "view") setHoverText("View Project");
        else if (dataCursor === "click") setHoverText("Click");
        else setHoverText("");
      } else {
        setIsHovering(false);
        setHoverText("");
      }
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("mouseover", onMouseOver);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("mouseover", onMouseOver);
      if (styleEl && document.head.contains(styleEl)) {
        document.head.removeChild(styleEl);
      }
      document.body.style.cursor = "auto";
    };
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
      style={{ x: cursorX, y: cursorY }}
    >
      <svg
        width="24" height="24" viewBox="0 0 24 24" fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: "translate(-2.5px, -2px)" }}
        className="drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]"
      >
        <path
          d="M2.5 2L18.5 8.5L11 11.5L7.5 19.5L2.5 2Z"
          fill="#FFFFFF" stroke="#000000" strokeWidth="1" strokeLinejoin="round"
        />
      </svg>

      <AnimatePresence>
        {isHovering && hoverText && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute top-5 left-5 px-3 py-1 rounded-full text-[11px] uppercase tracking-wider font-bold whitespace-nowrap shadow-md"
            style={{ backgroundColor: "#FFFFFF", color: "#000000" }}
          >
            {hoverText}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
