import "./global.css";

export const metadata = {
  title: "Haneum AI",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0,maximum-scale=1.0,viewport-fit=cover" />
      </head>
      <body>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
