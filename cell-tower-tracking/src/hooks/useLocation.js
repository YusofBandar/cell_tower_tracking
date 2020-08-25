import { useState } from 'react';

function useLocation() {
    const [location, setLocation] = useState({});
    const [error, setError] = useState(null);

    const onLocationUpdate = (location) => {
        setLocation(location);
    };

    const onLocationError = (error) => {
        setError(error);
    };

    navigator.geolocation.watchPosition(
        onLocationUpdate,
        onLocationError
    )

    return [location, error];
}

export default useLocation;
