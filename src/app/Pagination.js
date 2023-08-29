import styles from "./page.module.css";

export default function Pagination({ totalpage, currentPage, setCurrentPage }) {
  const handleAction = (sign) => {
    // console.log(sign);

    if (sign == "increment" && currentPage < totalpage) {
      setCurrentPage(currentPage + 1);
    } else if (sign == "decrement" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleStarEnd = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className={styles.pagination}>
      <button
        onClick={() => handleStarEnd(1)}
        className={
          currentPage == 1
            ? styles.pagination_button_disabled
            : styles.pagination_button
        }
      >
        First
      </button>
      <button
        // disabled={currentPage == 1 ? true : false}
        className={
          currentPage == 1
            ? styles.pagination_button_disabled
            : styles.pagination_button
        }
        onClick={() => handleAction("decrement")}
      >
        Prev
      </button>
      <span className={styles.page_count}>
        {currentPage} of {totalpage}
      </span>
      <button
        className={
          currentPage == totalpage
            ? styles.pagination_button_disabled
            : styles.pagination_button
        }
        onClick={() => handleAction("increment")}
      >
        Next
      </button>
      <button
        onClick={() => handleStarEnd(totalpage)}
        className={
          currentPage == totalpage
            ? styles.pagination_button_disabled
            : styles.pagination_button
        }
      >
        Last
      </button>
    </div>
  );
}
