import styles from "./SkeletonTaskCard.module.css";

const SkeletonTaskCard = () => {
  return (
    <div className={styles.skeletonCard}>
      <div className={styles.skeletonTitle}></div>
      <div className={styles.skeletonChecklist}></div>
      <div className={styles.skeletonChecklistItem}>
        <div className={styles.skeletonCheckbox}></div>
        <div className={styles.skeletonChecklistText}></div>
      </div>
      <div className={styles.skeletonChecklistItem}>
        <div className={styles.skeletonCheckbox}></div>
        <div className={styles.skeletonChecklistText}></div>
      </div>
      <div className={styles.skeletonFooter}>
        <div className={styles.skeletonDate}></div>
        <div className={styles.skeletonStatus}></div>
      </div>
    </div>
  );
};

export default SkeletonTaskCard;
