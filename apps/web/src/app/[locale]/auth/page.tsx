import type { Metadata } from 'next';
import { Page } from '@/components/Container';
import type { Locale } from '@egypt-one/i18n';
import { AuthForm } from './AuthForm';

export const metadata: Metadata = {
  title: 'Sign in or create an account',
  description:
    'Join Egypt One with Google, Apple, or your email and WhatsApp number to manage trips, live booking status and Egypt One Pass rewards.',
};

export default async function AuthPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <Page wide>
      <AuthForm locale={locale as Locale} />
    </Page>
  );
}
