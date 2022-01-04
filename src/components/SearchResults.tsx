import { useContext, useState } from 'react';
import { PlacesContext, MapContext } from '../context';
import { LoadingPlaces } from './';
import { Feature } from '../interfaces/places';

export const SearchResults = () => {

    const { places, isLoadingPlaces, userLocation } = useContext(PlacesContext);
    const { map, getRouteBetweenPoints } = useContext(MapContext);

    const [activePlaceId, setActivePlaceId] = useState('');

    const onPlaceClicked = ( place: Feature ) => {
        const [ lng, lat ] = place.center;
        setActivePlaceId( place.id );
        map?.flyTo({
            zoom: 14,
            center: [ lng, lat ]
        });
    };
    
    const getRoute = ( place: Feature ) => {
        if( ! userLocation ) {
            return;
        }
        const [ lng, lat ] = place.center;
        /**
         * Get Routes
         */
        getRouteBetweenPoints( userLocation, [ lng, lat ] );
    };

    if( isLoadingPlaces ) {
        return ( <LoadingPlaces /> );
    }

    if( places.length === 0 ) {
        return <></>;
    }

    return (
        <ul className="list-group p-1 bg-white">
            {
                places.map( place => (
                    <li key={ place.id } 
                        onClick={ () => onPlaceClicked( place ) }
                        className={ `list-group-item list-group-item-action py-3 px-2 pointer${ ( activePlaceId === place.id ) ? ' active' : '' }` }>
                        <h6>{ place.text }</h6>
                        <p
                        style={{
                            fontSize: '12px'
                        }}>
                            { place.place_name }
                        </p>
                        <button onClick={ () => getRoute( place ) }
                                className={ `btn btn-sm ${ activePlaceId === place.id ? 'btn-outline-light' : 'btn-outline-dark' }` }>
                            Directions
                        </button>
                    </li>
                ))
            }
        </ul>
    )
}