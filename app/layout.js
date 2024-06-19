import "./global.css";

export const metadata = {
  title: "Haneum AI",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head/>
      <body>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
