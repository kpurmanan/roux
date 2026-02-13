import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/context";

export const metadata: Metadata = {
    title: "PacePass - Endurance Event Platform",
    description: "The premier platform for managing marathons, triathlons, and endurance events worldwide.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <body className="custom-scrollbar">
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}
