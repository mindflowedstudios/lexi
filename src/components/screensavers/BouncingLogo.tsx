import { useEffect, useRef, useState, useCallback } from "react";

const COLORS = [
  "#FF69B4", // Hot Pink
  "#FF1493", // Deep Pink
  "#FF6B6B", // Coral
  "#E91E63", // Pink
  "#FF4081", // Pink Accent
  "#F48FB1", // Light Pink
  "#FF0000", // Red (for love)
  "#FF7F00", // Orange
  "#9C27B0", // Purple
  "#E040FB", // Purple Accent
];

// Love messages that rotate with the logo
const LOVE_MESSAGES = [
  "I Love You Lexi",
  "LexiOS",
  "My Love ❤️",
  "Forever Yours",
  "You're Beautiful",
  "17th Avenue ❤️",
];

export function BouncingLogo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [velocity, setVelocity] = useState({ x: 2, y: 2 });
  const [colorIndex, setColorIndex] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  // Calculate logo size based on viewport width (30% of viewport width)
  const getLogoSize = useCallback(() => {
    const vw = window.innerWidth;
    const width = Math.max(200, Math.min(800, vw * 0.3));
    const height = width * 0.5; // Maintain aspect ratio
    return { width, height };
  }, []);

  const [logoSize, setLogoSize] = useState(getLogoSize);
  const logoSizeRef = useRef(logoSize);

  // Update logo size on window resize
  useEffect(() => {
    const handleResize = () => {
      const newSize = getLogoSize();
      setLogoSize(newSize);
      logoSizeRef.current = newSize;
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [getLogoSize]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationId: number;
    let currentPos = { ...position };
    const currentVel = { ...velocity };
    let currentColor = colorIndex;

    const animate = () => {
      const bounds = container.getBoundingClientRect();
      const size = logoSizeRef.current;
      let newX = currentPos.x + currentVel.x;
      let newY = currentPos.y + currentVel.y;
      let bounced = false;

      // Bounce off walls
      if (newX <= 0 || newX + size.width >= bounds.width) {
        currentVel.x = -currentVel.x;
        newX = Math.max(0, Math.min(newX, bounds.width - size.width));
        bounced = true;
      }

      if (newY <= 0 || newY + size.height >= bounds.height) {
        currentVel.y = -currentVel.y;
        newY = Math.max(0, Math.min(newY, bounds.height - size.height));
        bounced = true;
      }

      if (bounced) {
        currentColor = (currentColor + 1) % COLORS.length;
        setColorIndex(currentColor);
        // Change message every few bounces
        if (currentColor % 3 === 0) {
          setMessageIndex((prev) => (prev + 1) % LOVE_MESSAGES.length);
        }
      }

      currentPos = { x: newX, y: newY };
      setPosition(currentPos);
      setVelocity(currentVel);

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full bg-black overflow-hidden"
    >
      <div
        className="absolute transition-colors duration-300"
        style={{
          left: position.x,
          top: position.y,
          width: logoSize.width,
          height: logoSize.height,
        }}
      >
        <svg
          viewBox="0 0 200 60"
          className="w-full h-full"
          style={{ color: COLORS[colorIndex] }}
        >
          {/* Love messages that rotate */}
          <text
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            fill="currentColor"
            fontSize="28"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontWeight="bold"
          >
            {LOVE_MESSAGES[messageIndex]}
          </text>
        </svg>
      </div>
    </div>
  );
}
