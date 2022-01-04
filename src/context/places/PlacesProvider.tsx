import { Feature, IPlacesResponse } from '../../interfaces/places';
import { PlacesContext } from './PlacesContext';
import { getUserLocation } from '../../helpers';
import { placesReducer } from './placesReducer';
import { useEffect, useReducer } from 'react';
import { searchApi } from '../../apis';

export interface IPlacesState {
    isLoading: boolean;
    userLocation?: [ number, number ];
    isLoadingPlaces: boolean;
    places: Feature[];
}

const INITIAL_STATE: IPlacesState = {
    isLoading: true,
    userLocation: undefined,
    isLoadingPlaces: false,
    places: []
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
    
    return (
        <PlacesContext.Provider value={{
            ...state,

            // Methods
            searchPlacesByTerm
        }}>
            { children }
        </PlacesContext.Provider>
    )
}
