import React, { useState, useRef } from 'react';

import styles from './App.module.scss';

import useMap from './hooks/useMap';
import useLocation from './hooks/useLocation';

import Location from './components/common/location/Location';
import Tower from './components/common/tower/Tower';

function App() {
    const element = useRef();

    const [locationPixelCoords, setLocationPixelCoords] = useState(null);

    const [{ coords }] = useLocation();
    const location = coords ? { lat: coords.latitude, lng: coords.longitude } : null;

    const [isLoading, map] = useMap(element, location, (_, factory) => {
        const pixels = factory.pixelCoords();
        setLocationPixelCoords(pixels);
    });

    return (
        <div className={ styles.mapWrapper }>
            { isLoading && <h1>Loading Map...</h1> }
            <div className={ styles.map } ref={ element }></div>
            <svg className={ styles.overlay }>
                { locationPixelCoords && 
                <Location x={locationPixelCoords.x} y={locationPixelCoords.y}/>}
                <Tower x={150} y={100}/>
            </svg>
        </div>
    );
}

export default App;
