import styles from "../../styles/Process.module.css";
import LoadingSpinner from "../LoadingSpinner";

export default function ProcessView({ length, progress }) {
  return (
    <>
      <LoadingSpinner className={"w-10 h-10"} />
      <div className={styles.progress_msg}>{`${progress}/${length}`}</div>

      {/* <div className={styles.progressbar_container}>
        <div
          className={styles.progressbar}
          style={{ width: `${(progress / length) * 95}%` }}
        ></div>
        <div className={styles.progressbar_bg}></div>
      </div> */}
    </>
  );
}
