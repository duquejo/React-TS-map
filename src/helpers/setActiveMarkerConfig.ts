import { Marker } from "mapbox-gl";
import { constantsName } from './constants.enum';

/**
 * 
 * Filter destination point
 * @param {Marker[]} markers - Markers array
 * @param {[number, number]} activeMarker - active marker/destination coordinate
 * @param {IPopupOptions} options - Popup active options
 * @returns void;
 */
export const setActiveMarkerConfig = ( 
    markers: Marker[], 
    activeMarker: [number, number] ): void => {

    if( ! activeMarker || ! markers.length ) {
        return;
    }
    
    markers.forEach( ( marker: Marker ) => {

        const markerDOMElement = marker.getElement();

        // Close if it's open
        if( marker.getPopup().isOpen() ){
            marker.togglePopup();
        }

        const activeMarkers = markerDOMElement.querySelector(`svg g[fill="${ constantsName.MARKER_ACTIVE_COLOR }"]`);
        if( activeMarkers ) {
            activeMarkers.setAttribute( 'fill', constantsName.MARKER_DEFAULT_COLOR );
        }
        const endCoords = { lng: activeMarker[0], lat: activeMarker[1] };
        if ( JSON.stringify( marker.getLngLat() ) === JSON.stringify( endCoords )  ) {

            /**
             * Set active color
             */
            markerDOMElement.querySelectorAll('svg g[fill="'+constantsName.MARKER_DEFAULT_COLOR+'"]')[0]
            .setAttribute( 'fill', constantsName.MARKER_ACTIVE_COLOR );

            /**
             * Toggle Popup
             */
            marker.togglePopup();
        }
    });
};
