import React from 'react';

import styles from './LoadingSpinner.module.scss';

/**
 * LoadingSpinner
 */
function LoadingSpinner() {
    return (
        <div className={styles.loader}></div>
    );
};

LoadingSpinner.propTypes = {
};

export default LoadingSpinner;
