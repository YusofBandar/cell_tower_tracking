import React, { useState, useRef } from 'react';

import styles from './App.module.scss';

import useMap from './hooks/useMap';
import useLocation from './hooks/useLocation';

import Location from './components/common/location/Location';
import Tower from './components/common/tower/Tower';

const cellTowers = [
    { lat: 37.874929, lng: -122.419416, connected: false}, 
    { lat: 37.774929, lng: -122.45942, connected: true}];

function App() {
    const element = useRef();

    const [locationPixelCoords, setLocationPixelCoords] = useState(null);
    const [towerPixelCoords, setTowerPixelCoords] = useState([]);

    const [{ coords }] = useLocation();
    const lat = coords ? coords.latitude : null;
    const lng = coords ? coords.longitude : null;

    const [isLoading, map] = useMap(element, lat, lng, (lat, lng, factory) => {
        const pixels = factory.pixelCoords(lat, lng);
        setLocationPixelCoords(pixels);

        const towerPixels = cellTowers.map((tower) => (
            { ...tower, ...factory.pixelCoords(tower.lat,tower.lng) }
        ));
        setTowerPixelCoords(towerPixels);
    });

    return (
        <div className={ styles.mapWrapper }>
            { isLoading && <h1>Loading Map...</h1> }
            <div className={ styles.map } ref={ element }></div>
            <svg className={ styles.overlay }>
                { locationPixelCoords && 
                <Location x={locationPixelCoords.x} y={locationPixelCoords.y}/>}
                { towerPixelCoords.map(({ x, y, connected }) => (
                    <Tower x={x} y={y} connected={ connected }/>
                ))}
            </svg>
        </div>
    );
}

export default App;
