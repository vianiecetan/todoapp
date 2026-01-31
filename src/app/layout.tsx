import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { Toaster } from "sonner"; 
import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "Taskly | Organize your life",
  description: "A beautiful T3 Todo App",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <TRPCReactProvider>
          {children}
        </TRPCReactProvider>
        {/* 2. Add the Toaster component here */}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}