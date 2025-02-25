import React, { useState, useEffect, useRef } from "react";
import pict from "../assets/images/potato.jpg";

function Parallax() {
  const [offsetY, setOffsetY] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  const handleScroll = () => {
    if (sectionRef.current) {
      const rect = sectionRef.current.getBoundingClientRect();
      // När rect.top är lika med window.innerHeight, då är sektionens topp precis vid viewportens botten.
      // Vi beräknar hur långt in i sektionen vi har kommit:
      const relativeOffset = Math.max(0, window.innerHeight - rect.top);
      setOffsetY(relativeOffset);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    // Kör en initial beräkning
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden">
      <div
        className="absolute w-full h-full bg-cover bg-center"
        style={{
          // Använd offsetY multiplicerat med en faktor för att styra effekten
          transform: `translateY(${offsetY * 0.20}px)`,
          willChange: "transform",
        }}
      >
        <img src={pict} alt="test" style={{ width: "100%", height: "105%", objectFit: "cover", position: "relative", top: "-145px", }} />
      </div>
      {/* <div className="relative z-10 flex items-center justify-center h-full text-white">
        <h1 className="text-4xl font-bold">Your Hero Title</h1>
      </div> */}
    </section>
  );
}

export default Parallax;

