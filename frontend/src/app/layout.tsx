import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'InternHub — Internship Management Platform',
  description: 'Connect students with top internship opportunities. A centralized platform for students, recruiters, and administrators to manage the complete internship lifecycle.',
  keywords: 'internship, jobs, students, recruitment, career',
  openGraph: { title: 'InternHub', description: 'The modern internship management platform', type: 'website' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
