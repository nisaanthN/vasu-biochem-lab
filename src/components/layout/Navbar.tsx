"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Beaker, BookOpen, GraduationCap, LayoutDashboard, MessageSquareText, Menu, Sparkles } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader, SheetDescription } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useProgressStore } from "@/stores/progressStore";
import { useHydrated } from "@/hooks/useHydratedStore";

const LINKS = [
  { href: "/notes", label: "Notes", icon: BookOpen },
  { href: "/experiments", label: "Experiments", icon: Beaker },
  { href: "/quiz", label: "Quiz", icon: GraduationCap },
  { href: "/tutor", label: "Tutor", icon: MessageSquareText },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const hydrated = useHydrated();
  const xp = useProgressStore((s) => s.xp);
  const level = useProgressStore((s) => s.level);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="container mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="hidden sm:inline">BioPharm Lab</span>
        </Link>
        <nav className="ml-2 hidden gap-1 md:flex">
          {LINKS.map((l) => {
            const Icon = l.icon;
            const active = pathname === l.href || pathname.startsWith(l.href + "/");
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition",
                  active ? "bg-muted font-medium" : "text-muted-foreground hover:bg-muted/60",
                )}
              >
                <Icon className="h-4 w-4" />
                {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          {hydrated && (
            <Link
              href="/dashboard"
              className="hidden items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-xs text-muted-foreground hover:bg-muted sm:inline-flex"
            >
              <span className="font-semibold text-foreground">Lvl {level}</span>
              <span className="opacity-60">·</span>
              <span>{xp.toLocaleString()} XP</span>
            </Link>
          )}
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>Navigate</SheetTitle>
                <SheetDescription>Jump to a section of BioPharm Lab.</SheetDescription>
              </SheetHeader>
              <nav className="mt-4 flex flex-col gap-1 px-3 pb-6">
                {LINKS.map((l) => {
                  const Icon = l.icon;
                  return (
                    <Link
                      key={l.href}
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted"
                    >
                      <Icon className="h-4 w-4" /> {l.label}
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
