import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SIPEN-GURU | Aplikasi Administrasi 15 Poin Supervisi Akademik Guru (Kurikulum Merdeka)',
  description: 'Aplikasi pembantu guru membuat dan mengelola 15 komponen administrasi perencanaan dan pelaksanaan pembelajaran standar supervisi akademik.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-slate-100/80 text-slate-900 selection:bg-sky-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
