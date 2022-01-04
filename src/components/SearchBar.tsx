import { ChangeEvent, useContext, useRef } from "react"
import { SearchResults } from ".";
import { MapContext, PlacesContext } from '../context';

export const SearchBar = () => {

    const { searchPlacesByTerm } = useContext(PlacesContext);
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
    
    return (
        <div className="search-container">
            <input type="text"
                   className="form-control"
                   placeholder="Search a place..."
                   onChange={ onQueryChange } />
            <SearchResults />
        </div>
    )
}
