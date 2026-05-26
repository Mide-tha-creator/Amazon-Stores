import { ChevronDown, Globe } from "lucide-react";

export function AmazonSellerFooter() {
  return (
    <footer className="border-t border-[#d5d9d9] bg-white px-4 py-4 text-xs text-[#565959] md:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <a href="#" className="text-[#007185] hover:underline">
            Help
          </a>
          <a href="#" className="text-[#007185] hover:underline">
            Program Policies
          </a>
          <button
            type="button"
            className="flex items-center gap-1 text-[#007185] hover:underline"
          >
            <Globe className="h-3.5 w-3.5" />
            English
            <ChevronDown className="h-3 w-3" />
          </button>
        </div>
        <p className="flex items-center gap-2 text-[#565959]">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-sm bg-topnav text-[10px] font-bold text-white">
            a
          </span>
          Download the Amazon Seller mobile app
        </p>
        <p className="text-[#565959]">
          © 1999-2026, Amazon.com, Inc. or its affiliates
        </p>
      </div>
    </footer>
  );
}
