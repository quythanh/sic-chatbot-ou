import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import 'bootstrap/dist/css/bootstrap.min.css';

import { useRouter } from 'next/router';

// import "./globals.css";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Đăng nhập',
    description: 'Trang đăng nhập',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return children;
}
