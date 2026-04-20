import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono, Inter, Public_Sans } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });
const jetBrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const publicSans = Public_Sans({ subsets: ["latin"], variable: "--font-public-sans" });

export const metadata: Metadata = {
    title: "CouncilIA — Council as a Service",
    description: "Validate your ideas with CouncilIA. Six AI experts debate your strategy through adversarial rounds while a Judge arbitrates. Elevate your decision-making.",
    metadataBase: new URL("https://www.councilia.com"),
    openGraph: {
        title: "CouncilIA — One AI agrees with you. Six won't.",
        description: "Validate your ideas with CouncilIA. 6 AI experts debate your strategy through adversarial rounds while a Judge arbitrates. Elevate your decision-making.",
        url: "https://www.councilia.com",
        siteName: "CouncilIA",
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "CouncilIA — One AI agrees with you. Six won't.",
        description: "Validate your ideas with CouncilIA. 6 AI experts debate your strategy through adversarial rounds while a Judge arbitrates. Elevate your decision-making.",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${spaceGrotesk.variable} ${jetBrainsMono.variable} ${inter.variable} ${publicSans.variable} font-body bg-deep-blue text-slate-100 selection:bg-neon-lime selection:text-black`}>
                {children}
            </body>
        </html>
    );
}