"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Car, MapPin, CalendarCheck, LogOut } from "lucide-react";
import { logoutAdmin } from "@/lib/admin-actions";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/vehicles", label: "Vehicles", icon: Car },
  { href: "/admin/ziyarat", label: "Ziyarat packages", icon: MapPin },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-border/60 bg-secondary/20 p-4">
      <div className="mb-6 px-2">
        <div className="font-display text-lg font-semibold">Admin</div>
        <div className="text-xs text-muted-foreground">Al-Khair Tours</div>
      </div>
      <nav className="flex-1 space-y-1">
        {links.map((l) => {
          const active = l.exact ? pathname === l.href : pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground",
                active && "bg-primary/10 text-primary",
              )}
            >
              <l.icon className="h-4 w-4" /> {l.label}
            </Link>
          );
        })}
      </nav>
      <form action={logoutAdmin}>
        <button
          type="submit"
          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </form>
    </aside>
  );
}
