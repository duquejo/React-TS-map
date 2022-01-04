/* eslint import/no-webpack-loader-syntax: off */

import { AnySourceData, PopupOptions } from 'mapbox-gl';
// @ts-ignore
import { LngLatBounds, Map, Marker, Popup } from '!mapbox-gl';
import { IDirectionsResponse } from '../../interfaces/directions';
import { MapContext } from './MapContext';
import { PlacesContext } from '../';
import { directionsApi } from '../../apis';
import { mapReducer } from './mapReducer';
import { useReducer, useContext, useEffect, useRef } from 'react';
import { constantsName, setSourceData, setLayerData, setActiveMarkerConfig } from '../../helpers';
import { Feature } from '../../interfaces/places';

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
    const { places, searchPlaceByCoords, userLocation } = useContext(PlacesContext);

    /**
     * useEffect array-dependencies bugfix
     */
    const markersRef = useRef<()=>Marker[]>();

    const setupMarkers = (): Marker[] => {

        // Definitions
        const newMarkers: Marker[] = [];
        const options: PopupOptions = {
            className: 'animate__animated animate__fadeIn animate__faster'
        };

        state.markers.forEach( marker => marker.remove() );
        for (const place of places) {

            const [ lng, lat ] = place.center;

            const popup = new Popup(options)
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

    const setMap = async ( map: Map ) => {

        let popUpContent = `<h4>I'm here!</h4><p>Somehere around the world!</p>`;
        const myLocation: Feature[] = await searchPlaceByCoords( userLocation );
        if( myLocation.length > 0 ) {
            popUpContent = `<h4>Hello there!</h4><p><strong>My current location: </strong>${ myLocation[0].place_name }.</p>`;
        }

        const myLocationPopup = new Popup()
        .setHTML( popUpContent );

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
        if( state.map?.getLayer( constantsName.SOURCE_DATA_ID ) ) {
            state.map.removeLayer( constantsName.SOURCE_DATA_ID );
            state.map.removeSource( constantsName.SOURCE_DATA_ID );
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
        
        const { geometry } = response.data.routes[0];
        const { coordinates } = geometry;

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

        state.map?.addSource( constantsName.SOURCE_DATA_ID, sourceData );
        state.map?.addLayer( setLayerData( constantsName.SOURCE_DATA_ID ) );

        /**
         * Filter destination point
         * @see setMarkerColor helper
         */
        setActiveMarkerConfig( state.markers, end );
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
