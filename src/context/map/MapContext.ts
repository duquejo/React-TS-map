/* eslint import/no-webpack-loader-syntax: off */

// @ts-ignore
import { Map } from '!mapbox-gl';
import { createContext } from 'react';

interface IMapContextProps {
    isMapReady: boolean;
    map?: Map;

    // Methods
    setMap: (map: Map) => void;
    getRouteBetweenPoints: ( start: [ number, number ], end: [ number, number ] ) => Promise<void>;
    clearPolylines: () => void;
}

export const MapContext = createContext( {} as IMapContextProps );