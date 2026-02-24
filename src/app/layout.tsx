import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Muneerul Islam - Mahallu Committee Management",
  description: "Professional Mahallu Committee Management System for managing families, members, committees, and community programs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
