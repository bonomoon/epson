import Link from "next/link"
import styles from "../../styles/Home.module.css"
import AddLinkIcon from "@mui/icons-material/AddLink"
import DoDisturbOnOutlinedIcon from "@mui/icons-material/DoDisturbOnOutlined"
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined"
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined"

export default function ScoreInputPage() {
  const handleEpsonConnect = async (email) => {
    const res = await fetch("/api/epson/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })

    const data = await res.json()

    if (res.ok) {
      console.log(data)
    } else {
      console.log(data)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.nav}>
        <div className={styles.nav_item}>
          <img src="/logo.svg" alt="Vercel" className={styles.logo} />
        </div>
        <div className={styles.nav_item}>
          {/* 기기 연결 상태창 */}
          <div className={styles.device_status_container}>
            <div className={styles.device_status}>
              <div className={styles.not_connected_status}>
                <DoDisturbOnOutlinedIcon />
              </div>
              <div className={styles.device_status_msg}>기기 연결 안됨</div>
              <div className={styles.print_add_container}>
                <div className={styles.print_add}>
                  <AddLinkIcon sx={{ fontSize: "20px" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.nav_item}></div>
      </div>
      {/* 설명 */}
      <div className={styles.page_description}>
        <div>정간보 -&gt; 오선보</div>
        <span className={styles.text_muted}>
          * 현재는 단소 악보만 제공됩니다.
        </span>
      </div>
      {/* pdf */}
      <div className={styles.pdf_description}>
        <AddCircleOutlineOutlinedIcon sx={{ fontSize: "120px" }} />
        <p>
          Epson Scanner에 연결하여, <br />
          자동으로 추가해보세요
        </p>
      </div>

      {/* 버튼 */}
      <div className={styles.grid}>
        <Link href="/score/scan" className={styles.blue_card}>
          Epson Connect 연결
        </Link>
        <Link href="/epson" className={styles.grey_card}>
          <PictureAsPdfOutlinedIcon /> PDF 추가
        </Link>
      </div>
    </div>
  )
}
