import type { Metadata } from 'next';
import { PageHeader } from '@egypt-one/ui';
import { Page } from '@/components/Container';
import { mailto, SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contact Egypt One',
  description:
    'Reach the Egypt One team about travel, heritage content, partnerships, investment enquiries and press.',
};

const topics = [
  { label: 'General enquiry', subject: 'Egypt One — general enquiry' },
  { label: 'Partnerships', subject: 'Egypt One — partnership enquiry' },
  { label: 'Investment', subject: 'Egypt One — investment enquiry' },
  { label: 'Press & media', subject: 'Egypt One — press enquiry' },
  { label: 'Content correction', subject: 'Egypt One — content correction' },
  { label: 'Report an issue', subject: 'Egypt One — report an issue' },
];

export default function ContactPage() {
  return (
    <Page wide>
      <PageHeader
        eyebrow="Contact"
        title="Talk to the Egypt One team"
        lead="One address handles every enquiry while the platform is in build. We reply from the same team that maintains the content."
      />

      <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
        <div className="surface-gold p-7">
          <a href={mailto('Egypt One — general enquiry')} dir="ltr" className="block text-[22px] font-semibold text-gold-200 hover:text-gold-100">
            {SITE.email}
          </a>
          <p className="mt-4 text-[13px] text-ink-low" dir="ltr">
            www.egypt-one.com
          </p>
          <p className="mt-6 text-[12px] leading-relaxed text-ink-faint">
            No phone line or office address is published yet. We will add them here once they are confirmed rather
            than list placeholders.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {topics.map((topic) => (
            <a key={topic.label} href={mailto(topic.subject)} className="surface p-5 transition-colors hover:border-gold-600/35">
              <div className="text-[14px] font-semibold text-ink-hi">{topic.label}</div>
              <div className="mt-1 text-[12px] text-ink-faint">Opens an email to our team</div>
            </a>
          ))}
        </div>
      </div>
    </Page>
  );
}
