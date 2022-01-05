import { PlacesContext } from '../context';
import reactLogo from '../logo.svg'; 
import { reactLogoClassNames } from '../helpers';
import { useContext } from 'react';

interface ReactLogoProps {
    className?: reactLogoClassNames
}

export const ReactLogo = ({ className = reactLogoClassNames.REACT_LOGO_FIXED_CLASS }: ReactLogoProps ) => {

    const { isLoading } = useContext(PlacesContext);

    if( isLoading && className === reactLogoClassNames.REACT_LOGO_FIXED_CLASS ) {
        return <></>;
    }

    return (
        <img src={ reactLogo } 
             alt="React Logo"
             className={ ( className === reactLogoClassNames.REACT_LOGO_FIXED_CLASS ) ? `${ className } animate__animated animate__fadeInRight animate__delay-1s` : className }/>
    );
};
