import "./globals.css";
import { Inter } from "next/font/google";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Study Tracker",
  description: "Track your study progress",
  manifest: "/manifest.json"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white`}>
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
