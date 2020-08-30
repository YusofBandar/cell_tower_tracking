import React from 'react';

import styles from './Placeholder.module.scss';

import Map from '../../../img/map_placeholder.PNG';


function Placeholder({ children }) {
    return (
        <div className={ styles.placeholder }>
            <img className={ styles.map } src={ Map } alt='placeholder map'/>
            <div className={ styles.overlay }>
                { children } 
            </div>
        </div>
    );
}

export default Placeholder;

