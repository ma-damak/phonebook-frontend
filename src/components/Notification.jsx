const Notification = ({ message, styles }) => {
  if (message) {
    return <p className={styles}>{message}</p>;
  }
  return null;
};

export default Notification;
