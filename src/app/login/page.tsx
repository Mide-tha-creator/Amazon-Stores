"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDemoAuth } from "@/components/providers/demo-auth-provider";
import { SurfaceCard } from "@/components/shared/surface-card";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useDemoAuth();
  const [email, setEmail] = useState("demo@seller-analytics.local");
  const [marketplace, setMarketplace] = useState<"amazon" | "walmart">("amazon");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, marketplace);
    router.push(
      marketplace === "amazon"
        ? "/amazon/dashboard/sales"
        : "/walmart/analytics/sales-insights"
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-page p-4">
      <SurfaceCard className="w-full max-w-md">
        <h1 className="mb-2 text-2xl font-bold">Demo sign in</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Any credentials work. This is a mock authentication flow for
          presentations only.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Marketplace</Label>
            <Select
              value={marketplace}
              onValueChange={(v) => setMarketplace(v as "amazon" | "walmart")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="amazon">Amazon</SelectItem>
                <SelectItem value="walmart">Walmart</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">
            Continue to dashboard
          </Button>
        </form>
        <p className="mt-4 text-center text-sm">
          <Link href="/" className="text-primary hover:underline">
            Back to marketplace picker
          </Link>
        </p>
      </SurfaceCard>
    </div>
  );
}
