import React, { useState, useRef } from 'react';

import styles from './App.module.scss';

import useMap from './hooks/useMap';
import useFetch from './hooks/useFetch';
import useLocation from './hooks/useLocation';
import { Towers, CalculatedLocation } from './API';
import { conversion } from './util';

import Location from './components/common/location/Location';
import Accuracy from './components/common/accuracy/Accuracy';
import Tower from './components/common/tower/Tower';
import Placeholder from './components/ui/placeholder/Placeholder';
import LoadingSpinner from './components/common/loading-spinner/LoadingSpinner';

function App() {
    const element = useRef();

    const [locationPixelCoords, setLocationPixelCoords] = useState({});
    const [calLocationPixelCoords, setcalLocationPixelCoords] = useState({});
    const [towerPixelCoords, setTowerPixelCoords] = useState([]);

    const [{ coords }] = useLocation();
    const location = coords ? { lat: coords.latitude, lng: coords.longitude } : {};

    const [isLoadingTowers, cellTowers] = useFetch(() => Towers(location.lat, location.lng), [], [location.lat, location.lng]);
    const [isLoadingCalc, calcLocation] = useFetch(() => cellTowers.length > 0 && CalculatedLocation(310, 120, formatCellTowers(cellTowers)), [], [cellTowers])

    const [isLoading, factory] = useMap(element, location, () => {
        const { lat, lng } = location;
        const pixels = factory.pixelCoords(lat, lng);
        setLocationPixelCoords(pixels);

        if(!isLoadingCalc && calcLocation){
            const { location, accuracy } = calcLocation;
            const calPixels = factory.pixelCoords(location.lat, location.lng);
            const accPixels = factory.pixelCoords(
               ...conversion.offsetCoordsMetres(location.lat, location.lng, accuracy, 0));

            setcalLocationPixelCoords({ location: calPixels, accuracy: calPixels.y - accPixels.y});
        }

        const towerPixels = cellTowers.map((tower) => (
            { ...tower, ...factory.pixelCoords(Number(tower.lat),Number(tower.lon)) }
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
                { 'x' in locationPixelCoords && 
                <Location x={locationPixelCoords.x} y={locationPixelCoords.y}/>}
                { towerPixelCoords.length > 0 && towerPixelCoords.map(({ x, y }) => (
                    <Tower x={x} y={y} connected={ true }/>
                ))}
                { 'location' in calLocationPixelCoords && 
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

function formatCellTowers(towers){
    return towers.map(t => ({
        mobileCountryCode: t.mcc,
        mobileNetworkCode: t.net,
        locationAreaCode: t.area,
        cellId: t.cell,
    }));
}

export default App;
