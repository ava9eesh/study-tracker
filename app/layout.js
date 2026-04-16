import "./globals.css";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import NotificationManager from "@/components/NotificationManager";
import NavButtons from "@/components/NavButtons";

export const metadata = {
  title: "Study Tracker | Master Your Learning Journey",
  description: "Track your study progress, master concepts, and achieve academic excellence with our intelligent study tracking system.",
  manifest: "/manifest.json",
  themeColor: "#0a0d16",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body style={{
        position: "relative",
        minHeight: "100vh"
      }}>
        <ServiceWorkerRegister />
        <NotificationManager />
        <NavButtons />
        <div style={{ position: "relative", zIndex: 10 }}>
          {children}
        </div>
      </body>
    </html>
  );
}