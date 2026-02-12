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
    icon: '/assets/lone_cowry_logo.png',
    apple: '/assets/lone_cowry_logo.png',
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
