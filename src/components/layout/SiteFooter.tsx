import { Facebook, Instagram, Linkedin, Mail, Youtube } from "lucide-react";
import { Link } from "@tanstack/react-router";
import logo from "@/assets/egypt-one-logo.jpg.asset.json";
import { Container } from "@/components/site/Primitives";
import { footerColumns } from "@/data/site";
import { SITE, mailto } from "@/config/site";

const socials = [
  { Icon: Facebook, href: SITE.social.facebook, label: "Facebook" },
  { Icon: Instagram, href: SITE.social.instagram, label: "Instagram" },
  { Icon: Youtube, href: SITE.social.youtube, label: "YouTube" },
  { Icon: Linkedin, href: SITE.social.linkedin, label: "LinkedIn" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-sidebar py-14">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <div className="flex items-center gap-3">
              <img
                src={logo.url}
                alt={`${SITE.name} logo`}
                width={44}
                height={44}
                className="size-11 rounded-full ring-1 ring-gold-line"
              />
              <span>
                <span className="block font-display text-base tracking-[0.2em] text-foreground">
                  EGYPT <span className="text-gold">ONE</span>
                </span>
                <span className="block text-[10px] tracking-[0.12em] text-muted-foreground">
                  {SITE.tagline}
                </span>
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              A unified digital gateway presenting Egypt&apos;s destinations, heritage, culture and
              investment landscape through one platform.
            </p>
            <a
              href={mailto("Egypt One — general enquiry")}
              className="mt-4 inline-flex items-center gap-2 text-sm text-gold transition-colors hover:text-foreground"
            >
              <Mail className="size-4" />
              <span dir="ltr">{SITE.email}</span>
            </a>
            <p className="mt-1 text-xs text-muted-foreground" dir="ltr">
              {SITE.domain}
            </p>
            <div className="mt-5 flex gap-2">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  rel="noreferrer noopener"
                  target="_blank"
                  className="grid size-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-gold-line hover:text-gold"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {footerColumns.map((col) => (
            <div key={col.title}>
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold/80">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.to ? (
                      <Link
                        to={link.to}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href ?? mailto(`Egypt One — ${link.label}`)}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Content shown on this preview is demonstration data unless labelled otherwise.
          </p>
        </div>
      </Container>
    </footer>
  );
}
