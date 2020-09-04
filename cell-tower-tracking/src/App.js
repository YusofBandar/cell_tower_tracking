import React from 'react';

import useFetch from './hooks/useFetch';
import useLocation from './hooks/useLocation';
import { Towers, CalculatedLocation } from './API';

// eslint-disable-next-line
import styles from './App.module.scss';

import Map from './components/ui/map/Map';
import Placeholder from './components/ui/placeholder/Placeholder';
import LoadingSpinner from './components/common/loading-spinner/LoadingSpinner';

function App() {
    const [isLoading, _, { coords }] = useLocation();
    const location = coords ? { lat: coords.latitude, lng: coords.longitude } : {};

    const [isLoadingTowers, towers] = useFetch(() => Towers(location.lat, location.lng, 400), [], [location.lat, location.lng]);
    const [isLoadingCalc, calcLocation] = useFetch(() => towers.length > 0 && CalculatedLocation(310, 120, formatCellTowers(towers)), [], [towers])


    return (
        <div className={ styles.mapWrapper }>
            <div className={`${styles.placeholder} ${!isLoading ? styles.hide : ''}`}>
                <Placeholder>
                    { isLoading && <LoadingSpinner /> }
                </Placeholder>
            </div>
            { !isLoading &&
            <Map 
                location={ location } 
                calcLocation={ isLoadingCalc ? {} : calcLocation } 
                towers={ isLoadingTowers ? [] : towers }/>
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
