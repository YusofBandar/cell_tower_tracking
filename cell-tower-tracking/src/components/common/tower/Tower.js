import React from 'react';
import PropTypes from 'prop-types';

import styles from './Tower.module.scss';

function Tower({ x, y, connected }) {
    return (
        <circle 
            className={`${styles.tower} ${connected ? styles.connected : ''}`} 
            cx={x} 
            cy={y} 
            r={7}/>
    );
}

Tower.propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    connected: PropTypes.bool
}

export default Tower;
