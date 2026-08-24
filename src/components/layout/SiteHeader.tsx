import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, Search, Sparkles, X } from "lucide-react";
import logo from "@/assets/egypt-one-logo.jpg.asset.json";
import { Container } from "@/components/site/Primitives";
import { primaryNav } from "@/data/site";
import { SITE } from "@/config/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <Container className="flex h-16 items-center gap-4 lg:h-20">
        <Link to="/" className="flex shrink-0 items-center gap-3" onClick={() => setOpen(false)}>
          <img
            src={logo.url}
            alt={`${SITE.name} logo`}
            width={44}
            height={44}
            className="size-10 rounded-full ring-1 ring-gold-line lg:size-11"
          />
          <span className="leading-tight">
            <span className="block font-display text-base tracking-[0.2em] text-foreground lg:text-lg">
              EGYPT <span className="text-gold">ONE</span>
            </span>
            <span className="hidden text-[10px] tracking-[0.12em] text-muted-foreground sm:block">
              {SITE.tagline}
            </span>
          </span>
        </Link>

        <nav className="ms-auto hidden items-center gap-1 xl:flex">
          {primaryNav.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="rounded-full px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="ms-auto flex items-center gap-2 xl:ms-0">
          <a
            href="#search"
            aria-label="Search Egypt One"
            className="grid size-10 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-gold-line hover:text-gold"
          >
            <Search className="size-4" />
          </a>
          <a
            href="#ai-concierge"
            className="hidden items-center gap-2 rounded-full border border-gold-line bg-gold-soft px-4 py-2.5 text-xs font-semibold text-gold transition-colors hover:bg-gold hover:text-primary-foreground sm:inline-flex"
          >
            <Sparkles className="size-4" />
            AI Concierge
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="grid size-10 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground xl:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </Container>

      <div
        className={cn(
          "overflow-hidden border-t border-border/70 bg-sidebar transition-[max-height] duration-300 xl:hidden",
          open ? "max-h-[70vh] overflow-y-auto" : "max-h-0",
        )}
      >
        <Container className="grid gap-1 py-4">
          {primaryNav.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground/85 transition-colors hover:bg-sidebar-accent hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </Container>
      </div>
    </header>
  );
}
