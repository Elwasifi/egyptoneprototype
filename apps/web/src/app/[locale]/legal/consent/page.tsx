import type { Metadata } from 'next';
import { PageHeader } from '@egypt-one/ui';
import { Page } from '@/components/Container';
import type { Locale } from '@egypt-one/i18n';
import { ConsentCentre } from './ConsentCentre';

export const metadata: Metadata = {
  title: 'Consent Centre',
  description:
    'Grant or withdraw each Egypt One consent separately: cookies, marketing, location, trip tracking, media use, AI processing and sensitive data.',
};

export default async function ConsentCentrePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <Page wide>
      <PageHeader
        eyebrow="Legal & Compliance"
        title="Consent Centre"
        lead="Each purpose is consented to separately — never through a single checkbox. Optional consents can be withdrawn at any time, and every change is recorded with its policy version and timestamp."
      />

      <div className="surface p-6">
        <p className="text-[13px] text-ink-low">Preview — consent recording isn't connected to a backend yet.</p>
      </div>

      <ConsentCentre locale={locale as Locale} />
    </Page>
  );
}
