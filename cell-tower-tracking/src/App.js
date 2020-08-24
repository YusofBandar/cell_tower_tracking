import React, {useRef} from 'react';

import useMap from './hooks/useMap';

function App() {
    const element = useRef();
    const [isLoading, map] = useMap(element);
    return (
        <div>
            { isLoading && <h1>Loading Map...</h1> }
            <div style={{ width: 1800, height: 900 }} ref={ element }></div>
        </div>
    );
}

export default App;
