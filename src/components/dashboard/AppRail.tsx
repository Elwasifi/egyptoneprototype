import { Link } from "@tanstack/react-router";
import {
  Building2,
  CalendarDays,
  Compass,
  CreditCard,
  Gem,
  Headphones,
  Landmark,
  MapPinned,
  Plane,
  Ship,
  Sparkles,
  Utensils,
  X,
} from "lucide-react";
import logo from "@/assets/egypt-one-logo.jpg.asset.json";
import { SITE } from "@/config/site";
import { sidebarGroups } from "@/data/site";
import { cn } from "@/lib/utils";

const groupIcons = [Plane, Compass, Building2, Headphones];

const itemIcons = [
  Sparkles,
  Landmark,
  Plane,
  MapPinned,
  Compass,
  Ship,
  Gem,
  Utensils,
  CalendarDays,
  CreditCard,
];

const badgeStyles: Record<string, string> = {
  AI: "border-info/40 bg-info/10 text-info",
  New: "border-success/40 bg-success/10 text-success",
  Hot: "border-hot/40 bg-hot/10 text-hot",
};

export function AppRail({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      <div
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-40 bg-background/70 backdrop-blur-sm xl:hidden",
          open ? "block" : "hidden",
        )}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[272px] shrink-0 overflow-y-auto border-r border-border/70 bg-sidebar transition-transform duration-300 xl:sticky xl:top-0 xl:z-30 xl:h-screen xl:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center gap-3 border-b border-sidebar-border px-4 py-4">
          <Link to="/" className="flex min-w-0 items-center gap-3" onClick={onClose}>
            <img
              src={logo.url}
              alt={`${SITE.name} logo`}
              width={40}
              height={40}
              className="size-10 shrink-0 rounded-full ring-1 ring-gold-line"
            />
            <span className="min-w-0 leading-tight">
              <span className="block truncate font-display text-sm tracking-[0.22em] text-foreground">
                EGYPT <span className="text-gold">ONE</span>
              </span>
              <span className="block truncate text-[10px] tracking-[0.1em] text-muted-foreground">
                {SITE.tagline}
              </span>
            </span>
          </Link>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="ms-auto grid size-8 shrink-0 place-items-center rounded-full border border-sidebar-border text-muted-foreground xl:hidden"
          >
            <X className="size-4" />
          </button>
        </div>

        <nav className="px-3 py-4">
          {sidebarGroups.map((group, gi) => {
            const GroupIcon = groupIcons[gi % groupIcons.length]!;
            return (
              <div key={group.title} className="mb-5">
                <p className="mb-2 flex items-center gap-2 px-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold/70">
                  <GroupIcon className="size-3.5" />
                  {group.title}
                </p>
                <ul className="grid gap-0.5">
                  {group.items.map((item, ii) => {
                    const Icon = itemIcons[(gi * 3 + ii) % itemIcons.length]!;
                    return (
                      <li key={item.label}>
                        <a
                          href="#explore"
                          onClick={onClose}
                          className="group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-foreground"
                        >
                          <Icon className="size-4 shrink-0 text-muted-foreground group-hover:text-gold" />
                          <span className="min-w-0 flex-1 truncate">{item.label}</span>
                          {item.badge && (
                            <span
                              className={cn(
                                "shrink-0 rounded-full border px-1.5 py-0.5 text-[9px] font-semibold uppercase",
                                badgeStyles[item.badge],
                              )}
                            >
                              {item.badge}
                            </span>
                          )}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}

          <div className="mt-2 rounded-xl border border-gold-line bg-gold-soft p-4">
            <p className="font-display text-sm text-gold">Egypt One Pass</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              One digital pass for attractions, rewards and partner benefits.
            </p>
            <a
              href="#programmes"
              onClick={onClose}
              className="mt-3 inline-flex w-full items-center justify-center rounded-lg bg-gold px-3 py-2 text-xs font-semibold text-primary-foreground"
            >
              Explore Pass
            </a>
          </div>
        </nav>
      </aside>
    </>
  );
}
