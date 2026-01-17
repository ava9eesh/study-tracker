import "./globals.css";

export const metadata = {
  title: "Study Tracker",
  description: "Track your study progress",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        {children}

        <footer className="mt-20 py-6 text-center text-gray-400 text-sm">
          <p>
            Built by{" "}
            <span className="text-white font-medium">
              Avaneesh Shinde
            </span>
          </p>
          <p className="mt-1">
            Contact:{" "}
            <a
              href="https://discord.com/users/i_love_zandu_bam"
              target="_blank"
              className="text-blue-400 hover:underline"
            >
              i_love_zandu_bam
            </a>
          </p>
        </footer>
      </body>
    </html>
  );
}
