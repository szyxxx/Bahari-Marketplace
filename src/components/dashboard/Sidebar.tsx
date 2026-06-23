import * as React from "react";
import { cn } from "@/lib/utils";

export function Sidebar({ className }: { className?: string }) {
  const menuItems = [
    { label: "Overview", href: "/dashboard", icon: "LayoutDashboard" },
    { label: "Produsen", href: "/dashboard/producers", icon: "Users" },
    { label: "Komoditas", href: "/dashboard/commodities", icon: "Fish" },
    { label: "Batch", href: "/dashboard/batches", icon: "Boxes" },
    { label: "Listing", href: "/dashboard/listings", icon: "Store" },
    { label: "Pesanan", href: "/dashboard/orders", icon: "ShoppingCart" },
    { label: "Eco Points", href: "/dashboard/ecopoints", icon: "Leaf" },
  ];

  return (
    <aside className={cn("pb-12 w-64 border-r bg-background hidden md:block", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight font-['Outfit']">
            Dashboard Koperasi
          </h2>
          <div className="space-y-1">
            {menuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  "text-muted-foreground" // Active state handling would go here
                )}
              >
                {/* Placeholder icon until lucide-react is fully wired */}
                <span className="w-4 h-4 mr-2 bg-muted-foreground/20 rounded-sm"></span>
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
