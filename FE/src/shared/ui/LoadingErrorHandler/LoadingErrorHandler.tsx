import { CircularProgress } from '@mui/material';
import styles from './LoadingErrorHandler.module.css';

const LoadingErrorHandler = ({ loading, error }: any) => {
  if (loading) {
    return (
      <div className={styles.loaderWrapper}>
        <CircularProgress size="30px" />
      </div>
    );
  }
  if (error) return <p className={styles.error}>{`Error: ${error}`}</p>;

  return null;
};

export default LoadingErrorHandler;
