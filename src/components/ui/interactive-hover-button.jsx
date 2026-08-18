import React from "react";
import { ArrowRight } from "lucide-react";

const InteractiveHoverButton = React.forwardRef(({ text = "Button", className = "", ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={`group relative cursor-pointer overflow-hidden rounded-full border border-[#D4AF37]/50 bg-white/40 p-2 px-5 text-center font-semibold text-sm transition-all duration-300 ${className}`}
      {...props}
    >
      <span className="relative z-20 inline-block translate-x-1 transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0 text-black">
        {text}
      </span>
      <div className="absolute inset-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 text-black opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
        <span>{text}</span>
        <ArrowRight className="w-4 h-4" />
      </div>
      <div className="absolute inset-0 z-0 rounded-full bg-[#D4AF37] opacity-0 transition-all duration-300 transform scale-90 group-hover:scale-100 group-hover:opacity-100"></div>
    </button>
  );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";

// Link version for react-router-dom Links and dramatic anchor tags
const InteractiveHoverLink = React.forwardRef(({ text = "Button", className = "", as: Component = "a", children, ...props }, ref) => {
  return (
    <Component
      ref={ref}
      className={`group relative cursor-pointer overflow-hidden rounded-full border border-[#D4AF37]/50 bg-white/40 p-2 px-5 text-center font-semibold text-sm inline-block transition-all duration-300 ${className}`}
      {...props}
    >
      <span className="relative z-20 inline-block translate-x-1 transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0 text-black">
        {text}
      </span>
      <div className="absolute inset-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 text-black opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
        <span>{text}</span>
        <ArrowRight className="w-4 h-4" />
      </div>
      <div className="absolute inset-0 z-0 rounded-full bg-[#D4AF37] opacity-0 transition-all duration-300 transform scale-90 group-hover:scale-100 group-hover:opacity-100"></div>
    </Component>
  );
});

InteractiveHoverLink.displayName = "InteractiveHoverLink";

export { InteractiveHoverButton, InteractiveHoverLink };
