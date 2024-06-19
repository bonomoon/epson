import Link from "next/link";
import styles from "../../styles/Home.module.css";

export default function ScoreInputPage() {

  const handleEpsonConnect = async (email) => {
    const res = await fetch("/api/epson/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (res.ok) {
      console.log(data)
    } else {
      console.log(data);
    }
  };

  return (
    <div className={styles.container}>
      <h3>
        <img src="/logo.svg" alt="Vercel" className={styles.logo} />
      </h3>

      <div className={styles.grid}>
        <Link href="/score/scan" className={styles.card}>
          <h3>Epson Connect 스캔</h3>
        </Link>
        <Link href="/epson" className={styles.card}>
          <h3>PDF 파일 선택</h3>
        </Link>
      </div>
    </div>
  );
}
