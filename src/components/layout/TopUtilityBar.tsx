import { Globe, LifeBuoy, Mail } from "lucide-react";
import { Container } from "@/components/site/Primitives";
import { SITE, mailto } from "@/config/site";

export function TopUtilityBar() {
  return (
    <div className="hidden border-b border-border/60 bg-sidebar text-[11px] text-muted-foreground md:block">
      <Container className="flex h-9 items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <Globe className="size-3.5 text-gold/70" />
            <span className="font-medium text-foreground/80">EN</span>
            <span aria-hidden="true">/</span>
            <span>العربية</span>
          </span>
          <span className="hidden sm:inline">USD</span>
          <span className="hidden lg:inline">Visiting from: Worldwide</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href={mailto("Egypt One — support request")}
            className="flex items-center gap-1.5 transition-colors hover:text-gold"
          >
            <Mail className="size-3.5" />
            <span dir="ltr">{SITE.email}</span>
          </a>
          <a href="#support" className="flex items-center gap-1.5 transition-colors hover:text-gold">
            <LifeBuoy className="size-3.5" />
            Support
          </a>
        </div>
      </Container>
    </div>
  );
}
