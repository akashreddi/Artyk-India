import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import LayoutClient from "./layout-client";

const palatinoLinotype = localFont({
  src: "./fonts/PalatinoLinotype-Regular.ttf",
  variable: "--font-display",
  display: "swap",
});

const creatoDisplay = localFont({
  src: [
    { path: "./fonts/CreatoDisplay-Thin.otf", weight: "100", style: "normal" },
    { path: "./fonts/CreatoDisplay-ThinItalic.otf", weight: "100", style: "italic" },
    { path: "./fonts/CreatoDisplay-Light.otf", weight: "300", style: "normal" },
    { path: "./fonts/CreatoDisplay-LightItalic.otf", weight: "300", style: "italic" },
    { path: "./fonts/CreatoDisplay-Regular.otf", weight: "400", style: "normal" },
    { path: "./fonts/CreatoDisplay-RegularItalic.otf", weight: "400", style: "italic" },
    { path: "./fonts/CreatoDisplay-Medium.otf", weight: "500", style: "normal" },
    { path: "./fonts/CreatoDisplay-MediumItalic.otf", weight: "500", style: "italic" },
    { path: "./fonts/CreatoDisplay-Bold.otf", weight: "700", style: "normal" },
    { path: "./fonts/CreatoDisplay-BoldItalic.otf", weight: "700", style: "italic" },
    { path: "./fonts/CreatoDisplay-ExtraBold.otf", weight: "800", style: "normal" },
    { path: "./fonts/CreatoDisplay-ExtraBoldItalic.otf", weight: "800", style: "italic" },
    { path: "./fonts/CreatoDisplay-Black.otf", weight: "900", style: "normal" },
    { path: "./fonts/CreatoDisplay-BlackItalic.otf", weight: "900", style: "italic" },
  ],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://artykindia.com"),
  title: {
    default: "Artyk India",
    template: "%s | Artyk India",
  },
  description:
    "Artyk India is a 25,000 sq.ft. European furniture experience centre in Jubilee Hills, Hyderabad.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${palatinoLinotype.variable} ${creatoDisplay.variable}`}>
      <body className="bg-stone text-onyx antialiased">
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}