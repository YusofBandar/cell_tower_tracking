import React, { useState, useRef } from 'react';

import styles from './App.module.scss';

import { useMap, useCalculatedLocation } from './hooks/useMap';
import useLocation from './hooks/useLocation';

import Location from './components/common/location/Location';
import Tower from './components/common/tower/Tower';
import Placeholder from './components/ui/placeholder/Placeholder';

const cellTowers = [
    {
        mobileCountryCode: 310,
        mobileNetworkCode: 120,
        locationAreaCode: 21264,
        cellId: 174190097,
        RadioType: 'LTE',
        Latitude: 37.778549,
        Longitude: -122.426247,
        Range: 1000,
        connected: true
    },
    {
        mobileCountryCode: 310,
        mobileNetworkCode: 260,
        locationAreaCode: 258,
        cellId: 20301,
        RadioType: 'GSM',
        Latitude: 37.777276,
        Longitude: -122.424088,
        Range: 1000,
        connected: true
    },
    {
        mobileCountryCode: 310,
        mobileNetworkCode: 410,
        locationAreaCode: 56965,
        cellId: 4315654,
        RadioType: 'UTMS',
        Latitude: 37.779803,
        Longitude: -122.422117,
        Range: 1000,
        connected: true
    },
    {
        mobileCountryCode: 310,
        mobileNetworkCode: 120,
        locationAreaCode: 21264,
        cellId: 174190085,
        RadioType: 'LTE',
        Latitude: 37.778678,
        Longitude: -122.424903,
        Range: 1000,
        connected: true
    }
]

function App() {
    const element = useRef();

    const [locationPixelCoords, setLocationPixelCoords] = useState(null);
    const [calLocationPixelCoords, setcalLocationPixelCoords] = useState(null);
    const [towerPixelCoords, setTowerPixelCoords] = useState([]);

    const [isLoadingCalc, calcLocation] = useCalculatedLocation(310, 120, cellTowers);
    const [{ coords }] = useLocation();
    const lat = coords ? coords.latitude : null;
    const lng = coords ? coords.longitude : null;

    const [isLoading] = useMap(element, lat, lng, (lat, lng, factory) => {
        const pixels = factory.pixelCoords(lat, lng);
        setLocationPixelCoords(pixels);

        if(!isLoadingCalc){
            const { location } = calcLocation;
            const calPixels = factory.pixelCoords(location.lat, location.lng);
            setcalLocationPixelCoords(calPixels);
        }

        const towerPixels = cellTowers.map((tower) => (
            { ...tower, ...factory.pixelCoords(tower.Latitude,tower.Longitude) }
        ));
        setTowerPixelCoords(towerPixels);
    });

    return (
        <div className={ styles.mapWrapper }>
            <Placeholder loading={ isLoading }/>
            <div className={ styles.map } ref={ element }></div>
            <svg className={ styles.overlay }>
                { locationPixelCoords && 
                <Location x={locationPixelCoords.x} y={locationPixelCoords.y}/>}
                { towerPixelCoords.map(({ x, y, connected }) => (
                    <Tower x={x} y={y} connected={ connected }/>
                ))}
                { calLocationPixelCoords && 
                    <Location x={calLocationPixelCoords.x} y={calLocationPixelCoords.y}/>
                }
            </svg>
        </div>
    );
}




export default App;
