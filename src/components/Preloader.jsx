"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { RefreshCcw } from "lucide-react";

const Preloader = () => {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
      // After the loading is done, start the fade-out effect
      setTimeout(() => setIsVisible(false), 250); // Adjust the timeout to control the speed of the fade-out
    }, 500);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "#fff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        opacity: isLoading ? 1 : 0,
        transition: "opacity 0.5s ease", // Smoothly transition the opacity
        visibility: isVisible ? "visible" : "hidden",
      }}
    >
      <RefreshCcw
        size={48}
        style={{
          animation: "spin 2s linear infinite",
        }}
      />
      <style jsx>{`
        /* Define the keyframes for the rotation animation */
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Preloader;
