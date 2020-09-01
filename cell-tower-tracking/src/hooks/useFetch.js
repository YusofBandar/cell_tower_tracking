import { useState, useEffect } from 'react';

function useFetch(action, deps) {
    const [data, setData] = useState();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);

        async function fetchData() {
            const response = await action();
            setData(response);
            setIsLoading(false);
        }

        fetchData();
    }, [...deps]) // eslint-disable-line

    return[isLoading, data]
}

export default useFetch;
