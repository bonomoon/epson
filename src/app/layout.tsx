import localFont from "next/font/local";
import "./global.css";

export const metadata = {
  title: "Haneum AI",
  description: "",
}

const pretendard = localFont({
  src: "../fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

export default function RootLayout({ children }) {
  return (
    <html lang="ko" className={`${pretendard.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0,maximum-scale=1.0,viewport-fit=cover" />
      </head>
      <body className={pretendard.className}>
        <main className="max-w-md mx-auto">
          {children}
        </main>
      </body>
    </html>
  )
}
