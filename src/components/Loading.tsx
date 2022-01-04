import { ReactLogo } from ".";
import { reactLogoClassNames } from '../helpers';

export const Loading = () => {
    return (
        <div className="loading-map d-flex justify-content-center align-items-center animate__animated animate__fadeIn">
            <div className="text-center">
                <ReactLogo className={ reactLogoClassNames.REACT_LOGO_LOADING_CLASS }/>
                <h3>Please wait</h3>
                <span>Getting current location...</span>
            </div>
        </div>
    )
}
