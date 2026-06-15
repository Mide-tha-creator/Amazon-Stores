import Link from "next/link";

export function DemoDisclaimerFooter() {
  return (
    <footer className="border-t border-border bg-card px-4 py-3 text-center text-xs text-muted-foreground">
      <p>
        <strong>Seller Central Demo</strong> — Demonstration environment only. Not
        affiliated with Amazon. All data is simulated for client presentation
        purposes.
      </p>
      <p className="mt-1">
        <Link href="/" className="text-primary hover:underline">
          Store picker
        </Link>
        {" · "}
        <Link href="/login" className="text-primary hover:underline">
          Demo login
        </Link>
      </p>
    </footer>
  );
}
