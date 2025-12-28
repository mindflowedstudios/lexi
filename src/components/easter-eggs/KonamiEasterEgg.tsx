import { useEffect, useState, useCallback } from "react";

// Konami code: up, up, down, down, left, right, left, right, b, a
const KONAMI_CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "KeyB",
  "KeyA",
];

const LOVE_MESSAGES = [
  "I built this entire world for you, my love.",
  "Every line of code is a love letter to you.",
  "17th Avenue brought us together...",
  "And now you have your own operating system.",
  "I love you, Alexandria. Forever and always.",
  "- Kassam",
];

export function KonamiEasterEgg() {
  const [keysPressed, setKeysPressed] = useState<string[]>([]);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(false);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const newKeys = [...keysPressed, event.code].slice(-KONAMI_CODE.length);
      setKeysPressed(newKeys);

      // Check if the Konami code was entered
      if (newKeys.length === KONAMI_CODE.length) {
        const isKonamiCode = newKeys.every(
          (key, index) => key === KONAMI_CODE[index]
        );
        if (isKonamiCode) {
          setShowEasterEgg(true);
          setMessageIndex(0);
          setTimeout(() => setFadeIn(true), 100);
        }
      }
    },
    [keysPressed]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Cycle through messages
  useEffect(() => {
    if (!showEasterEgg) return;

    if (messageIndex < LOVE_MESSAGES.length - 1) {
      const timer = setTimeout(() => {
        setMessageIndex((prev) => prev + 1);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showEasterEgg, messageIndex]);

  const handleClose = () => {
    setFadeIn(false);
    setTimeout(() => {
      setShowEasterEgg(false);
      setKeysPressed([]);
      setMessageIndex(0);
    }, 500);
  };

  if (!showEasterEgg) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black transition-opacity duration-500 ${
        fadeIn ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
    >
      {/* Animated hearts background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-4xl animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
              opacity: 0.3,
            }}
          >
            ❤️
          </div>
        ))}
      </div>

      {/* Main message */}
      <div className="text-center text-white z-10 px-8 max-w-2xl">
        <div
          className="text-4xl md:text-6xl font-bold mb-8 animate-pulse"
          style={{ color: "#FF69B4" }}
        >
          ❤️
        </div>
        <p
          className="text-2xl md:text-4xl font-light transition-all duration-500"
          style={{
            fontFamily: "Georgia, serif",
            textShadow: "0 0 20px rgba(255, 105, 180, 0.5)",
          }}
        >
          {LOVE_MESSAGES[messageIndex]}
        </p>
        <p className="text-sm text-gray-400 mt-12 animate-pulse">
          Click anywhere to close
        </p>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
          }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
