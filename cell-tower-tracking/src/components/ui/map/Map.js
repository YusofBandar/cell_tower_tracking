import React, { useState, useRef } from 'react';

import { conversion } from '../../../util';
import useMap from '../../../hooks/useMap';

import styles from './Map.module.scss';

import Placeholder from '../placeholder/Placeholder';
import LoadingSpinner from '../../common/loading-spinner/LoadingSpinner';
import Overlay from '../overlay/Overlay';


function Map({ location, calcLocation, towers,}) {
    const element = useRef();

    const [locationPixelCoords, setLocationPixelCoords] = useState({});
    const [calLocationPixelCoords, setcalLocationPixelCoords] = useState({});
    const [towerPixelCoords, setTowerPixelCoords] = useState([]);

    const [isLoading, factory] = useMap(element, location, () => {
        if(location && 'lat' in location && 'lng' in location){
            const { lat, lng } = location;
            const pixels = factory.pixelCoords(lat, lng);
            setLocationPixelCoords(pixels);
        }

        if(calcLocation && 'location' in location && 'accuracy' in location){
            const { location, accuracy } = calcLocation;
            const calPixels = factory.pixelCoords(location.lat, location.lng);
            const accPixels = factory.pixelCoords(
               ...conversion.offsetCoordsMetres(location.lat, location.lng, accuracy, 0));

            setcalLocationPixelCoords({ location: calPixels, accuracy: calPixels.y - accPixels.y});
        }

        if(towers && towers.length > 0){
            const towerPixels = towers.map((tower) => (
                { ...tower, ...factory.pixelCoords(Number(tower.lat),Number(tower.lon)) }
            ));
            setTowerPixelCoords(towerPixels);
        }
    }, [location, calcLocation, towers]);

    return(
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

export default Map;
