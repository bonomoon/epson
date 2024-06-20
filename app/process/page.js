import styles from "../../styles/Process.module.css"

export default function Process() {
  return (
    <div className={styles.container}>
      <div className={styles.progress_msg}>분석 중입니다...</div>
      <div className={styles.progressbar_container}>
        {/* 값에 따라 길이 수정*/}
        <div className={styles.progressbar}></div>
        <div className={styles.progressbar_bg}></div>
      </div>
    </div>
  )
}
