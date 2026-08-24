import { createFileRoute } from "@tanstack/react-router";
import { Globe, Mail } from "lucide-react";
import { TopUtilityBar } from "@/components/layout/TopUtilityBar";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Section, SectionHeader } from "@/components/site/Primitives";
import { SITE, mailto } from "@/config/site";

const title = "Contact Egypt One — Talk to the platform team";
const description =
  "Reach the Egypt One team about travel, heritage content, partnerships, investment enquiries and press. Email info@egypt-one.com.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: `${SITE.url}/contact` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE.url}/contact` }],
  }),
  component: Contact,
});

const topics = [
  { label: "General enquiry", subject: "Egypt One — general enquiry" },
  { label: "Partnerships", subject: "Egypt One — partnership enquiry" },
  { label: "Investment", subject: "Egypt One — investment enquiry" },
  { label: "Press & media", subject: "Egypt One — press enquiry" },
  { label: "Content correction", subject: "Egypt One — content correction" },
  { label: "Report an issue", subject: "Egypt One — report an issue" },
];

function Contact() {
  return (
    <div className="min-h-screen bg-background">
      <TopUtilityBar />
      <SiteHeader />
      <main>
        <Section>
          <SectionHeader
            eyebrow="Contact"
            title="Talk to the Egypt One team"
            description="One address handles every enquiry while the platform is in build. We reply from the same team that maintains the content."
          />
          <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
            <div className="rounded-2xl border border-gold-line bg-card p-7">
              <Mail className="size-5 text-gold" />
              <a
                href={mailto("Egypt One — general enquiry")}
                className="mt-4 block font-display text-2xl text-foreground hover:text-gold"
                dir="ltr"
              >
                {SITE.email}
              </a>
              <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <Globe className="size-4 text-gold" />
                <span dir="ltr">{SITE.domain}</span>
              </p>
              <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
                No phone line or office address is published yet. We will add them here once they
                are confirmed rather than list placeholders.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {topics.map((t) => (
                <a
                  key={t.label}
                  href={mailto(t.subject)}
                  className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-gold-line"
                >
                  <div className="text-sm font-semibold text-foreground">{t.label}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Opens an email to our team
                  </div>
                </a>
              ))}
            </div>
          </div>
        </Section>
      </main>
      <SiteFooter />
    </div>
  );
}
