export const getUserLocation = async (): Promise<[ number, number ]> => {
    return new Promise( ( resolve, reject ) => {
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
                resolve( [ coords.longitude, coords.latitude ]);
            },
            ( error ) => {
                alert('The app didn\'t get the Geolocation');
                console.error( error );
                reject();
            }
        );
    }
)};
