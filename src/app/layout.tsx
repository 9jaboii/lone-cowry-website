import type { Metadata } from 'next';
import './globals.css';
import './public.css';

export const metadata: Metadata = {
  title: 'Lone Cowry Ventures | AI, Agentic AI & Defense Technology',
  description:
    'Lone Cowry Ventures is a global technology powerhouse delivering Generative AI, Agentic AI, GPU infrastructure, Kubernetes, data engineering, defense surveillance, drone technology, quantum computing, fintech, cybersecurity, and cloud solutions.',
  keywords:
    'AI, Generative AI, Agentic AI, Defense Technology, Cybersecurity, Cloud Computing, Washington DC, Silver Spring MD',
  authors: [{ name: 'Lone Cowry Ventures Limited' }],
  icons: {
    icon: [
      { url: '/assets/icon_only.svg', type: 'image/svg+xml' },
      { url: '/assets/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/assets/favicon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: { url: '/assets/apple-touch-icon.png', sizes: '180x180' },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
