"use client";

import { X } from "lucide-react";
import { useState } from "react";

export function AmazonFeedbackTab() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <button
      type="button"
      className="fixed bottom-24 left-0 z-30 flex items-center gap-1 rounded-r bg-[#008296] px-1.5 py-3 text-[10px] font-bold tracking-wide text-white shadow-md hover:bg-[#006b7a]"
      style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
      onClick={() => setVisible(false)}
      aria-label="Feedback"
    >
      <span className="rotate-180">FEEDBACK</span>
      <X className="h-3 w-3 shrink-0 rotate-90" />
    </button>
  );
}
