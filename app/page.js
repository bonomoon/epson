import Link from "next/link";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <h1>
        <img src="/logo.svg" alt="Vercel" className={styles.logo} />
      </h1>

      <h1 className={styles.title}>Haneum AI</h1>

      <p className={styles.description}>우리 음악, 국악 AI 서비스</p>

      <div className={styles.grid}>
        <Link href="/score" className={styles.card}>
          <h3>정간보 변환 &rarr;</h3>
          <p>정간보를 오선보로, 오선보를 정간보로 역보해보세요.</p>
          <label>* Epson Connect 원격 스캔 지원</label>
        </Link>
      </div>
    </div>
  );
}
