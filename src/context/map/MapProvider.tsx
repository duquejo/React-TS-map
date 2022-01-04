/* eslint import/no-webpack-loader-syntax: off */

import { AnySourceData } from 'mapbox-gl';
// @ts-ignore
import { LngLatBounds, Map, Marker, Popup } from '!mapbox-gl';
import { IDirectionsResponse } from '../../interfaces/directions';
import { MapContext } from './MapContext';
import { PlacesContext } from '../';
import { directionsApi } from '../../apis';
import { mapReducer } from './mapReducer';
import { useReducer, useContext, useEffect, useRef } from 'react';
import { constants, setSourceData, setLayerData } from '../../helpers';

export interface IMapState {
    isMapReady: boolean;
    map?: Map; // At beginning is null
    markers: Marker[];
}

const INITIAL_STATE: IMapState = {
    isMapReady: false,
    map: undefined,
    markers: []
};

interface IMapProviderProps {
    children: JSX.Element | JSX.Element[]
}

export const MapProvider = ({ children }: IMapProviderProps) => {

    const [state, dispatch] = useReducer( mapReducer, INITIAL_STATE );
    const { places } = useContext(PlacesContext);

    /**
     * useEffect array-dependencies bugfix
     */
    const markersRef = useRef<()=>Marker[]>();

    const setupMarkers = (): Marker[] => {
        state.markers.forEach( marker => marker.remove() );
        const newMarkers: Marker[] = [];
        for (const place of places) {
            const [ lng, lat ] = place.center;
            const popup = new Popup()
            .setHTML(`
                <h6>${ place.text }</h6>
                <p>${ place.place_name }</p>
            `);
            const newMarker = new Marker()
            .setPopup( popup )
            .setLngLat( [ lng, lat ])
            .addTo( state.map! );
            newMarkers.push( newMarker );
        }
        return newMarkers;     
    };
    markersRef.current = setupMarkers;

    useEffect( () => {
        if( markersRef.current ) {
            const newMarkers = markersRef.current();
            dispatch({ 
                type: 'setMarkers', 
                payload: newMarkers
            });
        }
    }, [ places ]);

    const setMap = ( map: Map ) => {

        const myLocationPopup = new Popup()
        .setHTML(`<h4>I'm here!</h4><p>Somehere around the world!</p>`)

        new Marker({ color: '#ff4136' })
        .setLngLat( map.getCenter() )
        .setPopup( myLocationPopup )
        .addTo( map );

        dispatch({
            type: 'setMap',
            payload: map
        });
    };

    /**
     * Clear Polylines
     */
    const clearPolylines = () => {
        if( state.map?.getLayer( constants.SOURCE_DATA_ID ) ) {
            state.map.removeLayer( constants.SOURCE_DATA_ID );
            state.map.removeSource( constants.SOURCE_DATA_ID );
        }
    }

    /**
     * Get Route between points
     * @param start start coordinate points
     * @param end end coordinate points
     */
    const getRouteBetweenPoints = async ( start: [ number, number ], end: [ number, number ] ) => {
        
        /**
         * Navigation API Call
         */
        const response = await directionsApi.get<IDirectionsResponse>(`/${ start.join(',') };${ end.join(',') }`);
        
        const { distance, duration, geometry } = response.data.routes[0];
        const { coordinates } = geometry;

        let kms = distance / 1000;
            kms = Math.round( kms * 100 );
            kms /= 100; 

        const minutes = Math.floor( duration / 60 );

        const bounds = new LngLatBounds( start, start );

        for (const coord of coordinates) {
            const newCoord: [ number, number ] = [ coord[0], coord[1] ];
            bounds.extend( newCoord );
        }
        state.map?.fitBounds( bounds, {
            padding: 200
        });

        /**
         * Polyline
         */
        const sourceData: AnySourceData = setSourceData( coordinates );

        /**
         * Refreshing map Polylines
         */
         clearPolylines();

        state.map?.addSource( constants.SOURCE_DATA_ID, sourceData );
        state.map?.addLayer( setLayerData( constants.SOURCE_DATA_ID ) );
    };

    return (
        <MapContext.Provider value={{
            ...state,

            // Methods
            setMap,
            getRouteBetweenPoints,
            clearPolylines
            }}>
            { children }
        </MapContext.Provider>
    )
}
