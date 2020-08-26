import {useRef, useState, useEffect} from 'react';
import MapStyles from './mapStyles';

function useMap(element, lat, lng, onLocationChange = () => {}) {
    const [isLoading, setLoading] = useState(true);
    const map = useRef();
    const overlay = useRef();

    const LatLng = (lat, lng) => {
        return new window.google.maps.LatLng(lat, lng);
    }

    useEffect(() => {
        if(element.current && lat && lng){
            if(!map.current){
                map.current = new window.google.maps.Map(element.current, {
                    zoom: 12,
                    styles: MapStyles,
                    disableDefaultUI: true,
                    disableDoubleClickZoom: false,
                    center: { lat, lng }
                });
            }

            if(!overlay.current){
                overlay.current = new window.google.maps.OverlayView();
                overlay.current.setMap(map.current);
            }
            setLoading(false);
        }
    }, [element, lat, lng]);

    useEffect(() => {
        map.current && map.current.setCenter({ lat, lng });
    }, [lat, lng]);

    useEffect(() => {
        if(overlay.current) {
            const factory = {
                pixelCoords: (lat, lng) => coordsToPixel(overlay.current, LatLng(lat, lng))
            }

            overlay.current.draw = () => onLocationChange(lat, lng, factory)
        }
    }, [lat, lng, onLocationChange])

    return [isLoading, map.current];
}

function coordsToPixel (overlay, coords) {
    const projection = overlay.getProjection();
    return projection ? projection.fromLatLngToContainerPixel(coords) : {};
};

export default useMap;
