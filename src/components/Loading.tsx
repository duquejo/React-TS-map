import React from 'react'

export const Loading = () => {
    return (
        <div className="loading-map d-flex justify-content-center align-items-center">
            <div className="text-center">
                <h3>Please wait</h3>
                <span>Getting current location...</span>
            </div>
        </div>
    )
}
