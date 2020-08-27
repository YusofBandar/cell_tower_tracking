import React, {useState, useEffect} from 'react';

import styles from './Placeholder.module.scss';

import Map from '../../../img/map_placeholder.PNG';
import LoadingSpinner from '../../common/loading-spinner/LoadingSpinner';


function Placeholder({ loading }) {
    const [fade, setFade] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            console.log('fading');
            setFade(!loading);
        }, 800);
    }, [loading]);

    return (
        <div className={`${styles.placeholder} ${ fade ? styles.hide : ''}`}>
            <img className={ styles.map } src={ Map } alt='placeholder map'/>
            { !fade && 
            <div className={ styles.overlay }>
                <LoadingSpinner />
            </div>
            }
        </div>
    );
}

export default Placeholder;

