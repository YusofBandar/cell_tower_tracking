import React, {useState} from 'react';
import PropTypes from 'prop-types';

import styles from './Accuracy.module.scss';
import {useEffect} from 'react';

function Accuracy ({ x, y, radius }) {
    const [accuracy, setAccuracy] = useState(0);

    useEffect(() => {
        setAccuracy(radius);
    }, [radius])

    return (
        <circle 
            className={ styles.accuracy } 
            style={{ strokeWidth: accuracy }}
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
