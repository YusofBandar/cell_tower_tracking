import React, {useRef} from 'react';

import styles from './App.module.scss';

import useMap from './hooks/useMap';

import Location from './components/common/location/Location';
import Tower from './components/common/tower/Tower';

function App() {
    const element = useRef();
    const [isLoading, map] = useMap(element);
    return (
        <div className={ styles.mapWrapper }>
            { isLoading && <h1>Loading Map...</h1> }
            <div className={ styles.map } ref={ element }></div>
            <svg className={ styles.overlay }>
                <Location x={100} y={100}/>
                <Tower x={150} y={100}/>
            </svg>
        </div>
    );
}

export default App;
