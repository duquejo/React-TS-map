import { useContext } from "react";
import { MapContext } from "../context";
import { PlacesContext } from '../context/places/PlacesContext';

export const BtnMyLocation = () => {

    const { map, isMapReady } = useContext(MapContext);
    const { userLocation } = useContext(PlacesContext);

    const onClick = () => {

        if( ! isMapReady ) {
            throw new Error('Map isn\'t ready');
        }

        if( ! userLocation ) {
            throw new Error('User location isn\'t ready');
        }

        /**
         * Fly to mapbox
         */
        map?.flyTo({
            zoom: 14,
            center: userLocation
        });
    };

    return (
        <button className="btn btn-dark my-location-btn" 
                onClick={ onClick }>
            My location
        </button>
    )
}
