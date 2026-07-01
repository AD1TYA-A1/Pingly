import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Adm1n Chats",
  verification: {
    google: "uDS4QmI4sYhzd7YTGQ-cvAvAOS9OaZbWMMQqA_zuDJc"
  },
  description: "A modern real-time messaging platform with AI-powered assistance."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased  `}
      >
        {children}
      </body>
    </html>
  );
}
