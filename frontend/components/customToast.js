import { toast } from "react-hot-toast";
import { X } from "lucide-react";

export const showProfessionalToast = (message) => {
  toast.custom((t) => (
    <div
      className={`
        /* 1. LAYOUT & RESPONSIVE WIDTH */
        pointer-events-auto 
        w-auto max-w-[350px] min-w-[300px]
        flex items-center justify-between gap-3 px-4 py-3 rounded-xl
        
        /* 2. STYLE (Glassmorphism Lite) */
        bg-white/95 text-black shadow-2xl backdrop-blur-sm
        dark:bg-zinc-950/95 dark:text-white
        border border-zinc-200 dark:border-zinc-800
        
        /* 3. 🔥 SLOW & SMOOTH ANIMATION */
        transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]
        ${t.visible 
            ? "opacity-100 translate-y-0 scale-100"   // Fully Visible
            : "opacity-0 -translate-y-8 scale-95"    // Hidden (Floats slightly up)
        }
      `}
    >
      {/* Icon/Indicator (Optional dot) */}
      <div className="size-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />

      {/* Message Text */}
      <span className="flex-1 text-sm font-medium leading-tight cursor-default select-none">
        {message}
      </span>

      {/* Vertical Divider */}
      <div className="h-5 w-[1px] bg-zinc-200 dark:bg-zinc-800 shrink-0"></div>

      {/* Close Button */}
      <button
        onClick={() => toast.dismiss(t.id)}
        className="
          group flex items-center justify-center size-6 shrink-0
          rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 
          transition-colors active:scale-90
        "
      >
        <X className="size-3.5 text-zinc-400 group-hover:text-black dark:group-hover:text-white" />
      </button>
    </div>
  ), {
    position: "top-right",
    duration: 2500, // Auto fade out after 4 seconds
  });
};