import {useRef, useState, useEffect} from 'react';
import apiKey from '../apiKey'

import MapStyles from './mapStyles';

function useMap(element, location, onLocationChange = () => {}) {
    const [isLoading, setLoading] = useState(true);
    const map = useRef();
    const overlay = useRef();
    const { lat, lng } = location;

    const LatLng = (lat, lng) => {
        return new window.google.maps.LatLng(lat, lng);
    }

    // init map and overlay objects
    useEffect(() => {
        if(element.current && lat !== undefined && lng !== undefined){
            if(!map.current){
                map.current = new window.google.maps.Map(element.current, {
                    zoom: 15,
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

    // re-draw map at new location
    useEffect(() => {
        map.current && map.current.setCenter({ lat, lng });
    }, [lat, lng]);

    // init location factory with useful locations
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




// testing getting calculated position
function useCalculatedLocation(mcc, mnc, cellTowers) {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        const url = `https://www.googleapis.com/geolocation/v1/geolocate?key=${apiKey}`;
        const body = {
            homeMobileCountryCode: mcc,
            homeMobileNetworkCode: mnc,
            considerIp: "false",
            cellTowers
        };

        async function fetchData() {
            const response = await fetch(url, { method: 'post', body: JSON.stringify(body) });
            const json = await response.json();
            setData(json);
            setIsLoading(false);
        }

        fetchData();
    }, [mcc, mnc, cellTowers])

    return [isLoading, data];
};

export {
    useMap,
    useCalculatedLocation
};
