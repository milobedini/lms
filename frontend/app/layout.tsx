'use client';
import { SessionProvider } from 'next-auth/react';
import { Alegreya } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { Providers } from './Provider';
import './globals.css';

const alegraya = Alegreya({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-Alegraya',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${alegraya.variable}  bg-no-repeat bg-gradient-to-b from-gray-900 to-black duration-300`}
      >
        <Providers>
          <SessionProvider>
            {children}
            <Toaster position="top-center" reverseOrder={false} />
          </SessionProvider>
        </Providers>
      </body>
    </html>
  );
}
