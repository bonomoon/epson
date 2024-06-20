import Link from "next/link";
import Container from "../components/Container";

export default function Home() {
  return (
    <div className="h-screen flex flex-col justify-center items-center gap-3">
      <div>
        <img src="/logo.svg" alt="Vercel" className="h-14 mb-3" />
      </div>

      <h1 className="font-bold text-5xl">Haneum AI</h1>

      <p className="text-lg">우리 음악, 국악 AI 서비스</p>

      <div className="flex flex-col flex-wrap justify-center items-center mt-16">
        <Link
          href="/score"
          className="
            max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow 
            hover:text-blue-600 hover:border-blue-600
            focus:text-blue-600 focus:border-blue-600
            active:text-blue-600 active:border-blue-600
          dark:bg-gray-800 dark:border-gray-700
          transition-colors ease-linear duration-200
            "
        >
          <h3 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
            정간보 변환 &rarr;
          </h3>
          <p className="mb-3 font-normal text-gray-500 dark:text-gray-400">
            정간보를 오선보로, 오선보를 정간보로 역보해보세요.
          </p>
          <label className="font-semibold text-sm text-blue-500 dark:text-blue-400">
            * Epson Connect 원격 스캔 지원
          </label>
        </Link>
      </div>
    </div>
  );
}
