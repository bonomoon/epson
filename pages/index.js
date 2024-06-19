import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Haneum AI</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>
          <img src="/logo.svg" alt="Vercel" className={styles.logo} />
        </h1>

        <h1 className={styles.title}>
          Haneum AI
        </h1>

        <p className={styles.description}>
          우리 음악, 국악 AI 서비스
        </p>

        <div className={styles.grid}>
          <Link href="/converter/jungganbo-to-staff" className={styles.card}>
            <h3>정간보 변환 &rarr;</h3>
            <p>정간보를 오선보로 역보해보세요.</p>
            <label>* Epson Connect 원격 스캔 지원</label>
          </Link>
          <Link href="/converter/staff-to-jungganbo" className={styles.card}>
            <h3>오선보 변환 &rarr;</h3>
            <p>오선보를 정간보로 역보해보세요.</p>
            <label>* Epson Connect 원격 스캔 지원</label>
          </Link>
        </div>
      </main>

      <footer>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by&nbsp;<b>백제대로 567</b>
        </a>
      </footer>

      <style jsx>{`
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        footer img {
          margin-left: 0.5rem;
        }
        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
          text-decoration: none;
          color: inherit;
        }
        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family:
            Menlo,
            Monaco,
            Lucida Console,
            Liberation Mono,
            DejaVu Sans Mono,
            Bitstream Vera Sans Mono,
            Courier New,
            monospace;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family:
            -apple-system,
            BlinkMacSystemFont,
            Segoe UI,
            Roboto,
            Oxygen,
            Ubuntu,
            Cantarell,
            Fira Sans,
            Droid Sans,
            Helvetica Neue,
            sans-serif;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}
