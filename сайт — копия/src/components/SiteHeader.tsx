import { Link } from "@tanstack/react-router";
import { Search, Plus, User } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg" style={{ background: "var(--gradient-primary)" }} />
          <span className="text-lg font-bold tracking-tight">GameMart</span>
        </Link>

        <div className="relative ml-2 hidden flex-1 md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Поиск игр, предметов, аккаунтов..."
            className="w-full rounded-lg border border-border bg-input/60 py-2 pl-9 pr-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Link
            to="/sell"
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Разместить</span>
          </Link>
          <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground transition hover:bg-secondary">
            <User className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
