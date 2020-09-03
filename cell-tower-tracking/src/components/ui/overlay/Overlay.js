import React from 'react';
import PropTypes from 'prop-types';

import Location from '../../common/location/Location';
import Accuracy from '../../common/accuracy/Accuracy';
import Tower from '../../common/tower/Tower';

import styles from './Overlay.module.scss';

function Overlay({ location, calcLocation, towers}) {
    return(
        <svg className={ styles.overlay }>
            { 'x' in location && 'y' in location && 
            <Location x={location.x} y={location.y}/>}
            { towers.length > 0 && towers.map(({ x, y }, i) => (
                <Tower key={i} x={x} y={y} connected={ true }/>
            ))}
            { calcLocation && 'location' in calcLocation && 
                <Accuracy 
                    x={calcLocation.location.x} 
                    y={calcLocation.location.y} 
                    radius={calcLocation.accuracy}
                />
            }
        </svg>
    );
}

Overlay.propTypes = {
    location: PropTypes.shape({ 
        x: PropTypes.number.isRequired, 
        y: PropTypes.number.isRequired}),
    towers: PropTypes.arrayOf(PropTypes.shape({ 
        x: PropTypes.number.isRequired, 
        y: PropTypes.number.isRequired}))
}

export default Overlay;
