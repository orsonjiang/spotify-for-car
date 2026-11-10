import "./globals.css";

import { AlertProvider } from "@/components/AlertProvider";

// Same head tags as the old client/index.html.
export const metadata = {
    title: "Spotify for Car",
    icons: {
        icon: [
            { url: "/assets/favicon-32x32.png", type: "image/png", sizes: "32x32" },
            { url: "/assets/favicon-16x16.png", type: "image/png", sizes: "16x16" },
        ],
        shortcut: "/assets/favicon.ico",
        apple: { url: "/assets/apple-touch-icon.png", sizes: "180x180" },
        other: { rel: "mask-icon", url: "/assets/safari-pinned-tab.svg", color: "#5bbad5" },
    },
    manifest: "/assets/site.webmanifest",
    other: {
        "msapplication-TileColor": "#da532c",
        "msapplication-config": "/assets/browserconfig.xml",
    },
};

export const viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    themeColor: "#ffffff",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            {/* The old SiteWrapper classes. */}
            <body className="flex min-h-screen flex-col justify-center bg-neutral-50 text-center text-neutral-900 dark:bg-neutral-800 dark:text-neutral-50">
                <AlertProvider>{children}</AlertProvider>
            </body>
        </html>
    );
}
