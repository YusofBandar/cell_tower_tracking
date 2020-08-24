import React, { useRef, useEffect } from 'react';

function Map() {
    const mapEl = useRef();

    useEffect(() => {
        if(mapEl.current){
            new window.google.maps.Map(mapEl.current, {
                center: { lat: -34.397, lng: 150.644 },
                zoom: 8
            });
        }
    }, [mapEl]);

    return (
        <div ref={ mapEl }>
            Map Component
        </div>
    );
}

export default Map;
