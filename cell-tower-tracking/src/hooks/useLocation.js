import { useState } from 'react';

function useLocation() {
    const [location, setLocation] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const onLocationUpdate = (location) => {
        setLocation(location);
        setError(null);
        setIsLoading(false);
    };

    const onLocationError = (error) => {
        setError(error);
        setIsLoading(false);
    };

    navigator.geolocation.watchPosition(
        onLocationUpdate,
        onLocationError
    )

    return [isLoading, error, location];
}

export default useLocation;
