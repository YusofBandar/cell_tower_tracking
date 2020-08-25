import {useRef, useState, useEffect} from 'react';
import MapStyles from './mapStyles';

function useMap(element) {
    const [isLoading, setLoading] = useState(true);
    const map = useRef();

    useEffect(() => {
        if(element.current){
            map.current = new window.google.maps.Map(element.current, {
                center: { lat: -34.397, lng: 150.644 },
                zoom: 8,
                styles: MapStyles,
                disableDefaultUI: true,
                disableDoubleClickZoom: false
            });

            setLoading(false);
        }
    }, [element]);

    return [isLoading, map.current];
}

export default useMap;
