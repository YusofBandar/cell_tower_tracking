import { useState, useEffect, useReducer } from 'react';

import MapStyles from './mapStyles';

function mapReducer(state, action) {
    if(action.type === 'draw'){
        const { lat, lng, element } = action;
        let { map, overlay } = state;
        
        if(!map){
            map = new window.google.maps.Map(element.current, {
                zoom: 15,
                styles: MapStyles,
                disableDefaultUI: true,
                disableDoubleClickZoom: false,
                center: { lat, lng }
            });
        }

        if(!overlay){
            overlay = new window.google.maps.OverlayView();
            overlay.setMap(map);
        }
        map.setCenter({ lat, lng });
        return { map, overlay, lat, lng }
    }
}

function useMap(element, location, onLocationChange = () => {}, deps) {
    const [isLoading, setLoading] = useState(true);
    const { lat, lng } = location;
    const [state, dispatch] = useReducer(mapReducer, {});

    const LatLng = (lat, lng) => {
        return new window.google.maps.LatLng(lat, lng);
    }

    // init map and overlay objects
    useEffect(() => {
        if(element.current && lat !== undefined && lng !== undefined){
            dispatch({ type: 'draw', lat, lng, element });
            setLoading(false);
        }
    }, [element, lat, lng]);

    // assign location callback
    useEffect(() => {
        if(state.overlay && state.map){
            state.overlay.draw = onLocationChange;
            window.google.maps.event.addListener(state.map, 'draw', () => {
                onLocationChange();
            });
        }
    }, [state, onLocationChange])

    // force a redraw when deps change
    useEffect(() => {
        window.google.maps.event.trigger(state.map, 'draw');
    },[...deps]) // eslint-disable-line

    const factory = {
        pixelCoords: (lat, lng) => {
            return coordsToPixel(state.overlay, LatLng(lat, lng));
        }
    }

    return [isLoading, factory]
}

function coordsToPixel (overlay, coords) {
    const projection = overlay.getProjection();
    return projection ? projection.fromLatLngToContainerPixel(coords) : {};
};

export default useMap;
