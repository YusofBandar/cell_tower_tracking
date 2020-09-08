import React, { useState, useEffect } from 'react';

import useLocation from './hooks/useLocation';
import useCalculatedLocation from './hooks/useCalculatedLocation';

import styles from './App.module.scss';

import Map from './components/ui/map/Map';
import Placeholder from './components/ui/placeholder/Placeholder';
import LoadingSpinner from './components/common/loading-spinner/LoadingSpinner';
import Error from './components/common/error/Error';
import Toast from './components/common/toast/Toast';

function App() {
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, error, { coords }] = useLocation();
    const location = coords ? { lat: coords.latitude, lng: coords.longitude } : {};

    const [isLoadingTowers, towers, calcLocation] = useCalculatedLocation(location);

    useEffect(() => {
        if(error){
            setErrorMessage('Failed to get location');
        }
    }, [error])

    return (
        <div className={ styles.mapWrapper }>
            { !isLoading && 
            <Toast show={ !isLoadingTowers && (!towers || towers.length < 1) }>Failed to calculate location</Toast> }
            <div className={`${styles.placeholder} ${(!isLoading && !error) ? styles.hide : ''}`}>
                <Placeholder>
                    <span className={ styles.content }>
                        { isLoading && <LoadingSpinner /> }
                        { !isLoading && error && <Error>{ errorMessage }</Error> }
                    </span>
                </Placeholder>
            </div>
            { !isLoading &&
            <Map 
                location={ location } 
                calcLocation={ isLoadingTowers ? {} : calcLocation } 
                towers={ isLoadingTowers ? [] : towers }/>
            }
        </div>
    );
}

export default App;
