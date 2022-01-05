import { Feature, IPlacesResponse } from '../../interfaces/places';
import { useEffect, useReducer } from 'react';
import { PlacesContext } from './PlacesContext';
import { getUserLocation } from '../../helpers';
import { placesReducer } from './placesReducer';
import { searchApi } from '../../apis';

export interface IPlacesState {
    isLoading: boolean;
    userLocation?: [ number, number ];
    isLoadingPlaces: boolean;
    places: Feature[];
    activePlace?: Feature;
}

const INITIAL_STATE: IPlacesState = {
    isLoading: true,
    userLocation: undefined,
    isLoadingPlaces: false,
    places: [],
    activePlace: undefined
};

interface PlacesProviderProps {
    children: JSX.Element | JSX.Element[]
}

export const PlacesProvider = ({ children }: PlacesProviderProps ) => {

    const [state, dispatch] = useReducer( placesReducer, INITIAL_STATE );

    useEffect(() => {
        getUserLocation()
        .then( lngLat => dispatch({
            type: 'setUserLocation',
            payload: lngLat
        }));
    }, []);

    const searchPlaceByCoords = async ( coords?: [number, number] ): Promise<Feature[]> => {
        if( ! coords ) {
            return [];
        }
        const response = await searchApi.get<IPlacesResponse>( `/${ coords }.json`, {
            params: {
                limit: 1
            }
        } );
        return response.data.features;
    };

    const searchPlacesByTerm = async ( query: string ): Promise<Feature[]> => {
        if( query.length === 0 ) {
            dispatch({ 
                type: 'setPlaces', 
                payload: []
            });
            return [];
        }

        if( ! state.userLocation ) {
            throw new Error('User location isn\'t available'); 
        }

        dispatch({ type: 'setLoadingPlaces' });

        const response = await searchApi.get<IPlacesResponse>( `/${ query }.json`, {
            params: {
                proximity: state.userLocation.join(',')
            }
        });

        dispatch({ type: 'setPlaces', payload: response.data.features });
        return response.data.features;
    };

    const setActivePlace = ( place: Feature ) => {
        dispatch({
            type: 'setActivePlace',
            payload: place
        });
    };
    
    return (
        <PlacesContext.Provider value={{
            ...state,

            // Methods
            searchPlacesByTerm,
            searchPlaceByCoords,
            setActivePlace
        }}>
            { children }
        </PlacesContext.Provider>
    );
};
