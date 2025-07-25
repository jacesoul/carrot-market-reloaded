import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | Carrot Market",
    default: "Carrot Market",
  },
  description: "Sell and buy all the things",
};

export default function RootLayout({
  children,
  // @ts-ignore
  potato,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log(potato);
  return (
    <html lang="en">
      <body className={`bg-neutral-900 text-white max-w-screen-sm mx-auto`}>
        {potato}
        {children}
      </body>
    </html>
  );
}
