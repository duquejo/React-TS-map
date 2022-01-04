import axios from 'axios';

const searchApi = axios.create({
    baseURL: 'https://api.mapbox.com/geocoding/v5/mapbox.places',
    params: {
        limit: 5,
        language: 'en',
        access_token: 'pk.eyJ1IjoiZHVxdWVqbyIsImEiOiJja3h5dm9mZjA3M3ZtMm9zdHVzeGIyMW53In0.YZd7P6s3rfzbxrzvrNoVfg'
    }
});

export default searchApi;
