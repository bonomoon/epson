import styles from "../../styles/Process.module.css";

export default function ProcessView({ length, progress }) {
  return (
    <>
      <div className={styles.progress_msg}>{`${progress}/${length}`}</div>
      <div className={styles.progressbar_container}>
        {/* 값에 따라 길이 수정*/}
        <div
          className={styles.progressbar}
          style={{ width: `${(progress / length) * 95}%` }}
        ></div>
        <div className={styles.progressbar_bg}></div>
      </div>
    </>
  );
}
