import React from 'react';

import styles from './Toast.module.scss';

function Toast({ show, children }) {
    return (
        <div className={`${ styles.toast } ${ show ? styles.show : '' }`}>
            { children }
        </div>
    );
}

export default Toast;
