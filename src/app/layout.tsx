import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Jeeva — Software Developer & System Designer",
  description: "Portfolio of Jeeva — Software Developer & System Designer specializing in scalable backend systems and modern web experiences.",
  icons: {
    icon: "/icon.png?v=3",
    shortcut: "/icon.png?v=3",
    apple: "/icon.png?v=3",
  },
  openGraph: {
    title: "Jeeva — Software Developer & System Designer",
    description: "Software Developer & System Designer portfolio",
    images: ["/icon.png?v=3"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon.png?v=3" type="image/png" sizes="any" />
        <link rel="shortcut icon" href="/icon.png?v=3" type="image/png" />
        <link rel="apple-touch-icon" href="/icon.png?v=3" />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}>
        <SmoothScrollProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
