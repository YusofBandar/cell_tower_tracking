import React from 'react';
import PropTypes from 'prop-types';

import styles from './Location.module.scss';

function Location({ x, y }) {
    return (
        <circle className={`${styles.location} ${styles.blip}`} cx={x} cy={y} r={7}/>
    );
}

Location.propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
}

export default Location;
