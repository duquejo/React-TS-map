import { HomeScreen } from './screens';
import { MapProvider } from './context';
import { PlacesProvider } from './context';

/**
 * MapProvider must be inside of PlacesProvider
 */
export const MapsApp = () => {
    return (
        <PlacesProvider>
            <MapProvider>
                <HomeScreen />
            </MapProvider>
        </PlacesProvider>
    );
};
