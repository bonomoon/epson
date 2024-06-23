import styles from "../../styles/Process.module.css"
import { useState, useEffect } from "react"
export default function ProcessView({ setStatus }) {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 1))
    }, 100)
    if (progress >= 100) {
      clearInterval(interval)
      setStatus(2)
    }
    return () => clearInterval(interval)
  })
  const msg = [
    "음계 추출하는 중...",
    "오선보 전환 중...",
    "악보 생성 중...",
    "거의 다 완료 되었습니다.",
  ]

  return (
    <>
      <div className={styles.progress_msg}>
        {msg[Math.floor(progress / 25)]}
      </div>
      <div className={styles.progressbar_container}>
        {/* 값에 따라 길이 수정*/}
        <div
          className={styles.progressbar}
          style={{ width: `${(progress / 100) * 95}vw` }}
        ></div>
        <div className={styles.progressbar_bg}></div>
      </div>
    </>
  )
}
