// @ts-ignore: Babel compilation issue
import { AnySourceData } from '!mapbox-gl';

const setSourceData = ( coordsArray: number[][] ): AnySourceData => {
    return {
        type: 'geojson',
        data: {
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'LineString',
                        coordinates: coordsArray
                    }
                }
            ]
        }
    };
};

const setLayerData = ( sourceId: string ) => {
    return {
        id: sourceId,
        type: 'line',
        source: sourceId,
        layout: {
            'line-cap': 'round',
            'line-join': 'round'
        },
        paint: {
            'line-color': 'black',
            'line-width': 3
        }
    };
};

export {
    setSourceData,
    setLayerData
};