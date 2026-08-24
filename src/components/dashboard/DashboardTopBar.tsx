import { Bell, Globe, Heart, Menu, Search, Sparkles } from "lucide-react";
import { topTabs } from "@/data/site";
import { cn } from "@/lib/utils";

export function DashboardTopBar({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/90 backdrop-blur-xl">
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 lg:px-6">
        <button
          onClick={onMenu}
          aria-label="Open menu"
          className="grid size-10 shrink-0 place-items-center rounded-full border border-border text-muted-foreground xl:hidden"
        >
          <Menu className="size-4" />
        </button>

        <label className="relative hidden min-w-0 items-center md:flex" id="search">
          <Search className="pointer-events-none absolute left-4 size-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search destinations, attractions, hotels…"
            className="h-11 w-full max-w-2xl rounded-full border border-border bg-card/70 pl-11 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-gold-line"
          />
        </label>
        <div className="md:hidden" />

        <div className="flex shrink-0 items-center gap-2">
          <button className="hidden items-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground sm:inline-flex">
            <Globe className="size-4" /> EN
          </button>
          <button
            aria-label="Wishlist"
            className="grid size-10 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:text-gold"
          >
            <Heart className="size-4" />
          </button>
          <button
            aria-label="Notifications"
            className="relative grid size-10 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:text-gold"
          >
            <Bell className="size-4" />
            <span className="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-gold text-[9px] font-bold text-primary-foreground">
              3
            </span>
          </button>
          <a
            href="#ai-concierge"
            className="hidden items-center gap-2 rounded-full border border-gold-line bg-gold-soft px-4 py-2.5 text-xs font-semibold text-gold transition-colors hover:bg-gold hover:text-primary-foreground lg:inline-flex"
          >
            <Sparkles className="size-4" /> AI Concierge
          </a>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto px-4 pb-3 lg:px-6 [scrollbar-width:none]">
        {topTabs.map((tab, i) => (
          <a
            key={tab}
            href="#explore"
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-xs font-medium transition-colors",
              i === 0
                ? "border-gold-line bg-gold-soft text-gold"
                : "border-border text-muted-foreground hover:border-gold-line hover:text-foreground",
            )}
          >
            {tab}
          </a>
        ))}
      </div>
    </header>
  );
}
