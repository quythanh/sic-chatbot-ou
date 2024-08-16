'use client';
import type React from 'react';
import { UserProvider } from '@/components/useContext/useContextUser';

const RootLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return <UserProvider>{children}</UserProvider>;
};

export default RootLayout;
