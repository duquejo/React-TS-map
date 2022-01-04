/* eslint import/no-webpack-loader-syntax: off */

import { Loading } from '.';
import { PlacesContext, MapContext } from '../context';
// @ts-ignore
import { Map } from '!mapbox-gl';
import { useContext, useLayoutEffect, useRef } from 'react';

export const MapView = () => {

    const { isLoading, userLocation } = useContext( PlacesContext );
    const { setMap } = useContext( MapContext );

    /**
     * useRef for multiple Mapbox ID's Containers
     */
    const mapDiv = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if( ! isLoading ) {
            setMap( new Map({
                container: mapDiv.current!, // container ID
                style: 'mapbox://styles/mapbox/streets-v11', // style URL
                center: userLocation, // starting position [lng, lat]
                zoom: 14 // starting zoom
            }));
        }
    }, [ isLoading ]);

    if( isLoading ) {
        return ( <Loading /> );
    }

    return (
        <div ref={ mapDiv } className="map-container"></div>
    )
}
