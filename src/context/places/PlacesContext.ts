import { createContext } from "react";
import { Feature } from '../../interfaces/places';

export interface IPlacesContextProps {
    isLoading: boolean;
    userLocation?: [ number, number ];
    isLoadingPlaces: boolean;
    places: Feature[];
    activePlace?: Feature;

    // Methods
    searchPlacesByTerm: (query: string) => Promise<Feature[]>;
    searchPlaceByCoords: ( coords?: [number, number] ) => Promise<Feature[]>;
    setActivePlace: (place: Feature) => void;
}

export const PlacesContext = createContext<IPlacesContextProps>( {} as IPlacesContextProps );
