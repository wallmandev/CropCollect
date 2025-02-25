import React from "react";

interface ButtonProps {
  children: React.ReactNode; // Text eller annat innehåll inuti knappen
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void; // Valfri funktion att köra vid klick
  className?: string; // Extra klasser för styling
  type?: "button" | "submit" | "reset"; // Typ av knapp
}

const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  onClick,
  type = "button",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      // Lägg gärna till `className`-propens värde här, så du kan utöka stilar vid behov
      className={`relative inline-block font-medium group py-1.5 px-2.5 w-30 h-10 rounded bg-secondary font-primary hover:bg-opacity-80 ${className}`}
    >
      <span className="absolute inset-0 w-full h-full transition duration-400 ease-out transform translate-x-1 translate-y-1 bg-secondary group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
      <span className="absolute inset-0 w-full h-full bg-myColor border border-secondary group-hover:bg-secondary"></span>
      <span className="relative text-black font-bold">
        {children}
      </span>
    </button>
  );
};

export default Button;

