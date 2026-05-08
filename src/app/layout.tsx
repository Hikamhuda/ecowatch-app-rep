import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EcoWatch - Pelaporan Lingkungan',
  description: 'Website pelaporan masyarakat sederhana terkait lingkungan sekitar.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <main className="container">
          {children}
        </main>
      </body>
    </html>
  );
}
