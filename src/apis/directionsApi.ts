import axios from 'axios';

const directionsApi = axios.create({
    baseURL: 'https://api.mapbox.com/directions/v5/mapbox/driving',
    params: {
        alternatives: false,
        geometries: 'geojson',
        overview: 'simplified',
        steps: false,
        access_token: 'pk.eyJ1IjoiZHVxdWVqbyIsImEiOiJja3h5dm9mZjA3M3ZtMm9zdHVzeGIyMW53In0.YZd7P6s3rfzbxrzvrNoVfg'
    }
});

export default directionsApi;
