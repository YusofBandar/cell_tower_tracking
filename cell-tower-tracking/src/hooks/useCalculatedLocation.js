import { useState, useEffect } from 'react';

import { Towers, CalculatedLocation } from '../API';
import { coordsDistanceMetres } from '../util/conversion';

function useCalculatedLocation(location){
    const [isLoading, setIsLoading] = useState(true);
    const [towers, setTowers] = useState();
    const [calcLocation, setCalcLocation] = useState();

    useEffect( () => {
        const fetchCalcLocation = async () => {
            if(location.lat !== undefined && location.lng !== undefined){
                setIsLoading(true);

                const ranges = [100, 200, 300, 500, 800];
                const distancePromises = ranges.map(async (range) => {
                    let towersResponse, locationResponse;

                    try{
                        towersResponse = await Towers(location.lat, location.lng, range);
                        if(towersResponse.length > 0){
                            locationResponse = await CalculatedLocation(310, 120, formatCellTowers(towersResponse));
                        }
                    }catch(error) {
                        return {};
                    }

                    if(!locationResponse){
                        return {};
                    }

                    const distance = coordsDistanceMetres(
                        location.lat,
                        location.lng,
                        locationResponse.location.lat,
                        locationResponse.location.lng);

                    return { towers: towersResponse, location: locationResponse, distance};
                });

                let minDistance = 999999
                let minIndex = 0;
                const distances = await Promise.all(distancePromises);
                distances.filter(distance => 'location' in distance)
                    .forEach((distance, i) => {
                        if(distance < minDistance){
                            minDistance = distance;
                            minIndex = i;
                        }
                });

                const minLocation = distances[minIndex];
                setTowers(minLocation.towers);
                setCalcLocation(minLocation.location);

                setIsLoading(false);
            }
        }

        fetchCalcLocation();
    }, [location.lat, location.lng]);

    return [isLoading, towers, calcLocation];
}

function formatCellTowers(towers){
    return towers.map(t => ({
        mobileCountryCode: t.mcc,
        mobileNetworkCode: t.net,
        locationAreaCode: t.area,
        cellId: t.cell,
    }));
}

export default useCalculatedLocation;
