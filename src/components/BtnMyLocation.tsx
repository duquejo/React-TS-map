import { MapContext } from '../context';
import { PlacesContext } from '../context/places/PlacesContext';
import { useContext } from 'react';

export const BtnMyLocation = () => {

    const { map, isMapReady } = useContext(MapContext);
    const { userLocation, isLoading } = useContext(PlacesContext);

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
            zoom: 16,
            center: userLocation
        });
    };

    if( isLoading ) {
        return <></>;
    }    

    return (
        <button className="btn btn-dark my-location-btn animate__animated animate__fadeInRight animate__delay-1s"
                onClick={ onClick }>
            <span className="d-none d-md-block">Go to my location</span>
            <span className="d-block d-md-none">Go back</span>
        </button>
    );
};
