import './globals.css';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: { default: 'Egypt One — One Egypt. One Journey. One Platform.', template: '%s · Egypt One' },
  description:
    'Egypt One is a national digital platform for tourism, heritage, investment and services across Egypt’s 27 governorates. Prototype: all listings are demo data unless labelled otherwise.',
  applicationName: 'Egypt One',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  openGraph: { siteName: 'Egypt One', type: 'website' },
  robots: { index: false, follow: false },
  icons: { icon: '/icon.svg' },
};

export const viewport: Viewport = {
  themeColor: '#06111A',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
