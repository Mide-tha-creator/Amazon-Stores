import { cn } from "@/lib/utils";

interface ReportPageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function ReportPageLayout({ children, className }: ReportPageLayoutProps) {
  return (
    <div className={cn("mx-auto w-full max-w-none overflow-x-auto", className)}>
      <div className="min-w-0 border border-[#d5d9d9] bg-white">{children}</div>
    </div>
  );
}
