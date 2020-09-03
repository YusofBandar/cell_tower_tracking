import React, { useState, useRef } from 'react';

import styles from './App.module.scss';

import useMap from './hooks/useMap';
import useFetch from './hooks/useFetch';
import useLocation from './hooks/useLocation';
import { Towers, CalculatedLocation } from './API';
import { conversion } from './util';

import Overlay from './components/ui/overlay/Overlay';
import Placeholder from './components/ui/placeholder/Placeholder';
import LoadingSpinner from './components/common/loading-spinner/LoadingSpinner';

function App() {
    const element = useRef();

    const [locationPixelCoords, setLocationPixelCoords] = useState({});
    const [calLocationPixelCoords, setcalLocationPixelCoords] = useState({});
    const [towerPixelCoords, setTowerPixelCoords] = useState([]);

    const [{ coords }] = useLocation();
    const location = coords ? { lat: coords.latitude, lng: coords.longitude } : {};

    const [isLoadingTowers, cellTowers] = useFetch(() => Towers(location.lat, location.lng, 400), [], [location.lat, location.lng]);
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
            { !isLoading && 'x' in locationPixelCoords && 'y' in locationPixelCoords &&
            <Overlay 
                location={ locationPixelCoords } 
                calcLocation={ calLocationPixelCoords } 
                towers={ towerPixelCoords }/>
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
