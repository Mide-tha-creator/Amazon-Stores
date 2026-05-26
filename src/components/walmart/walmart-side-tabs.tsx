"use client";

export function WalmartSideTabs() {
  return (
    <div className="fixed right-0 top-[38%] z-30 hidden flex-col gap-0 lg:flex">
      <button
        type="button"
        className="relative rounded-l-md bg-[#4b5563] px-1.5 py-4 text-[9px] font-semibold tracking-wider text-white [writing-mode:vertical-rl]"
      >
        Quick Learn
        <span className="absolute -left-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#fbbf24] text-[8px] font-bold text-[#111111]">
          9
        </span>
      </button>
      <button
        type="button"
        className="relative rounded-l-md bg-[#111111] px-1.5 py-4 text-[9px] font-semibold tracking-wider text-white [writing-mode:vertical-rl]"
      >
        Feedback
      </button>
    </div>
  );
}
