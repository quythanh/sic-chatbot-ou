'use client';
import type React from 'react';
import type { Session } from '@/models/all';

import { useState } from 'react';
import { SessionContext } from '@/hook/sessionContext';

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const [saveOldSessions, setSaveOldSessions] = useState<Session[]>([]);
    const oldSessions = (value: Session[]) => {
        if (value && value.length > 0) {
            setSaveOldSessions(value);
            console.log('saveOldSessions', saveOldSessions);
        }
    };

    return <SessionContext.Provider value={{ saveOldSessions, oldSessions }}>{children}</SessionContext.Provider>;
}
