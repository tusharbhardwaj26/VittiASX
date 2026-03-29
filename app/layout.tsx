import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Vitti · ASX Intelligence Center',
  description: 'Real‑time ASX announcement intelligence with AI summaries and market sensitivity detection.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
        />
        <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='url(%23g)'/%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%236366f1'/%3E%3Cstop offset='1' stop-color='%238b5cf6'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect x='3' y='18' width='6' height='10' rx='1.5' fill='white' opacity='0.7'/%3E%3Crect x='13' y='10' width='6' height='18' rx='1.5' fill='white'/%3E%3Crect x='23' y='4' width='6' height='24' rx='1.5' fill='white' opacity='0.9'/%3E%3C/svg%3E" />
      </head>
      <body
        style={{ fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" }}
        className="bg-[#04060f] text-slate-100 antialiased"
      >
        {children}
      </body>
    </html>
  );
}
