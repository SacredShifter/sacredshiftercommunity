import React from 'react';

export function Slogan({ variant = "inline" }: { variant?: "inline" | "watermark" }) {
  const base = "Shift your experience, make it Sacred";
  if (variant === "watermark") {
    return (
      <div className="fixed inset-0 z-0 text-[10vw] text-center flex items-center justify-center text-white opacity-[0.02] pointer-events-none transform -rotate-45">
        <p>{base}</p>
      </div>
    );
  }
  return <p className="text-sm italic text-muted-foreground">{base}</p>;
}
