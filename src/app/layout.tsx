// import type { Metadata } from "next";
'use client';

import { Inter } from 'next/font/google';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux';
import { store } from '@/redux/store'; // Import store từ store.ts

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Provider store={store}>
                    <div id="app" className="h-screen">
                        {children}
                    </div>
                </Provider>
            </body>
        </html>
    );
}
