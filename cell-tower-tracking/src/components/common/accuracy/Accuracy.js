import React from 'react';
import PropTypes from 'prop-types';

import styles from './Accuracy.module.scss';

function Accuracy ({ x, y, radius }) {
    return (
        <circle 
            className={ styles.accuracy } 
            style={{ strokeWidth: radius }}
            cx={x} 
            cy={y} 
            r={7}
        />);
}

Accuracy.propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    radius: PropTypes.number.isRequired
}

export default Accuracy;
