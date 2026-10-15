import type { Metadata } from 'next';
import './globals.css';
import { StoreProvider } from '@/lib/store';

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: 'DomainFit — Evidence-Based Online Fitness & Management Platform',
  description: 'Manage your entire online fitness journey with DomainFit. Structured workouts, personalized nutrition coaching, progress tracking, and expert trainer oversight in one integrated platform.',
  keywords: ['online fitness coaching', 'workout tracking', 'macro tracking', 'personal trainer management', 'fitness SaaS', 'DomainFit'],
  openGraph: {
    title: 'DomainFit — Your Goals. Your Plan. Your Domain.',
    description: 'Personalized fitness coaching, structured workouts and smarter nutrition — built around your lifestyle and guided by real progress.',
    images: ['/images/domainfit/hero.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
