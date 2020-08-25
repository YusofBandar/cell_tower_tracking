import {useRef, useState, useEffect} from 'react';
import MapStyles from './mapStyles';

function useMap(element, center) {
    const [isLoading, setLoading] = useState(true);
    const map = useRef();

    useEffect(() => {
        if(element.current && center){
            map.current = new window.google.maps.Map(element.current, {
                zoom: 12,
                styles: MapStyles,
                disableDefaultUI: true,
                disableDoubleClickZoom: false,
                center
            });

            setLoading(false);
        }
    }, [element, center]);

    return [isLoading, map.current];
}

export default useMap;
