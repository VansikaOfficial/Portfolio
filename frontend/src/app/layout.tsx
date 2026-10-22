import type { Metadata } from 'next';
import { Fraunces, Inter, JetBrains_Mono } from 'next/font/google';
import EmotionRegistry from '@/theme/EmotionRegistry';
import { ColorModeProvider } from '@/theme/ColorModeContext';
import QueryProvider from '@/lib/QueryProvider';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  weight: ['400', '500', '600'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Portfolio | Data Analyst & AI Engineer',
    template: '%s | Portfolio',
  },
  description: 'Professional portfolio showcasing projects, skills, and experience in data science and AI engineering.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
        <EmotionRegistry>
          <ColorModeProvider>
            <QueryProvider>{children}</QueryProvider>
          </ColorModeProvider>
        </EmotionRegistry>
      </body>
    </html>
  );
}
