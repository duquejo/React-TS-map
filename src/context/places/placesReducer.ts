import { IPlacesState } from './PlacesProvider';
import { Feature } from '../../interfaces/places';

type PlacesAction = 
    | { type: 'setUserLocation', payload: [ number, number ] } // Longitude / Latitude
    | { type: 'setPlaces', payload: Feature[] }
    | { type: 'setLoadingPlaces' }

export const placesReducer = ( state: IPlacesState, action: PlacesAction ): IPlacesState => {
    switch ( action.type ) {
        case 'setUserLocation':
            return {
                ...state,
                isLoading: false,
                userLocation: action.payload
            };
        case 'setLoadingPlaces' : 
            return {
                ...state,
                isLoadingPlaces: true,
                places: []
            };
        case 'setPlaces':
            return {
                ...state,
                isLoadingPlaces: false,
                places: action.payload
            };
        default:
            return state;
    }
};