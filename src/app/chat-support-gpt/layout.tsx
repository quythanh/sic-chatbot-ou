import type { Metadata } from "next";
import { Inter } from "next/font/google";
import * as api from "@/utils/api";
import { useRouter } from 'next/navigation';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ChatBot OU - GPT",
  description: "Hệ thống trả lời học vụ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en"  style={{ height:'100%'}}>
      <body style={{height:'100%'}} className={inter.className}>
       
    
        
        {children}
      </body>
    </html>
  );
}
