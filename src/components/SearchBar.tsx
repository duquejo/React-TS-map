import { ChangeEvent, useContext, useRef } from 'react';
import { MapContext, PlacesContext } from '../context';
import { SearchResults } from '.';

export const SearchBar = () => {

    const { searchPlacesByTerm, isLoading } = useContext(PlacesContext);
    const { clearPolylines } = useContext(MapContext);

    /**
     * User keypress debounce
     */
    const debounceRef = useRef<NodeJS.Timeout>();
    const onQueryChange = ( event: ChangeEvent<HTMLInputElement> ) => {

        if( debounceRef.current ) {
            clearTimeout( debounceRef.current );
        }

        debounceRef.current = setTimeout( () => {
            /**
             * Search place or update query
             */
            searchPlacesByTerm( event.target.value );
            clearPolylines();
        }, 350 );
    };

    if( isLoading ) {
        return <></>;
    }
    
    return (
        <div className="search-container animate__animated animate__fadeInLeft animate__delay-1s">
            <input type="text"
                   className="form-control"
                   placeholder="Search a place..."
                   onChange={ onQueryChange } />
            <SearchResults />
        </div>
    );
};
