import * as React from "react";
import { Button } from "@/components/ui/Button";

export function Header() {
  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b bg-background px-6">
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle would go here */}
        <h1 className="text-lg font-semibold font-['Outfit']">Kopdes Maju Bersama</h1>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm">
          Notifications
        </Button>
        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
          A
        </div>
      </div>
    </header>
  );
}
