'use client';
import { useLoadUserQuery } from '@/redux/features/api/apiSlice';
import { SessionProvider } from 'next-auth/react';
import { Alegreya } from 'next/font/google';
import { FC, ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import { Providers } from './Provider';
import Loader from './components/loader/Loader';
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
            <CustomWrapper>{children}</CustomWrapper>
            <Toaster position="top-center" reverseOrder={false} />
          </SessionProvider>
        </Providers>
      </body>
    </html>
  );
}

const CustomWrapper: FC<{ children: ReactNode }> = ({ children }) => {
  const { isLoading } = useLoadUserQuery({});

  return <>{isLoading ? <Loader isFullscreen /> : <>{children}</>}</>;
};
