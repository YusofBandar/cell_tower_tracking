import React, { useState, useRef } from 'react';

import styles from './App.module.scss';

import useMap from './hooks/useMap';
import useFetch from './hooks/useFetch';
import useLocation from './hooks/useLocation';
import { CalculatedLocation } from './API';
import { conversion } from './util';

import Location from './components/common/location/Location';
import Accuracy from './components/common/accuracy/Accuracy';
import Tower from './components/common/tower/Tower';
import Placeholder from './components/ui/placeholder/Placeholder';
import LoadingSpinner from './components/common/loading-spinner/LoadingSpinner';

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
    },
    {
        mobileCountryCode: 310,
        mobileNetworkCode: 260,
        locationAreaCode: 40482,
        cellId: 157590765,
        RadioType: 'UMTS',
        Latitude: 37.77988,
        Longitude: -122.41427,
        Range: 3077,
        connected: true
    },
    {
        mobileCountryCode: 311,
        mobileNetworkCode: 480,
        locationAreaCode: 9730,
        cellId: 163335458,
        RadioType: 'LTE',
        Latitude: 37.777176,
        Longitude: -122.417487,
        Range: 1000,
        connected: true
    }
]

function App() {
    const element = useRef();

    const [locationPixelCoords, setLocationPixelCoords] = useState(null);
    const [calLocationPixelCoords, setcalLocationPixelCoords] = useState(null);
    const [towerPixelCoords, setTowerPixelCoords] = useState([]);

    const [isLoadingCalc, calcLocation] = useFetch(() => CalculatedLocation(310, 120, cellTowers), [], [])
    const [{ coords }] = useLocation();
    const location = coords ? { lat: coords.latitude, lng: coords.longitude } : {};

    const [isLoading, factory] = useMap(element, location, () => {
        const { lat, lng } = location;
        const pixels = factory.pixelCoords(lat, lng);
        setLocationPixelCoords(pixels);

        if(!isLoadingCalc){
            const { location, accuracy } = calcLocation;
            const calPixels = factory.pixelCoords(location.lat, location.lng);
            const accPixels = factory.pixelCoords(
               ...conversion.offsetCoordsMetres(location.lat, location.lng, accuracy, 0));

            setcalLocationPixelCoords({ location: calPixels, accuracy: calPixels.y - accPixels.y});
        }

        const towerPixels = cellTowers.map((tower) => (
            { ...tower, ...factory.pixelCoords(tower.Latitude,tower.Longitude) }
        ));
        setTowerPixelCoords(towerPixels);
    }, [isLoadingCalc]);

    return (
        <div className={ styles.mapWrapper }>
            <div className={`${styles.placeholder} ${!isLoading ? styles.hide : ''}`}>
                <Placeholder>
                    { isLoading && <LoadingSpinner /> }
                </Placeholder>
            </div>
            <div className={ styles.map } ref={ element }></div>
            { !isLoading && 
            <svg className={ styles.overlay }>
                { locationPixelCoords && 
                <Location x={locationPixelCoords.x} y={locationPixelCoords.y}/>}
                { towerPixelCoords.map(({ x, y, connected }) => (
                    <Tower x={x} y={y} connected={ connected }/>
                ))}
                { calLocationPixelCoords && 
                    <Accuracy 
                        x={calLocationPixelCoords.location.x} 
                        y={calLocationPixelCoords.location.y} 
                        radius={calLocationPixelCoords.accuracy}
                    />
                }
            </svg>
            }
        </div>
    );
}

export default App;
