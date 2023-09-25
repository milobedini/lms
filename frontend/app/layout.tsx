import { Alegreya } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from './utils/theme-provider';

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
        className={`${alegraya.variable} !bg-white bg-no-repeat dark:bg-gradient-to-b dark:from-gray-900 dark:to-black duration-300`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
