/* eslint import/no-webpack-loader-syntax: off */

import './styles.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapsApp } from './MapsApp';
import React from 'react';
import ReactDOM from 'react-dom';

// @ts-ignore
import mapboxgl from '!mapbox-gl';

/**
 * Mapbox Access Token
 */
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API;

if( ! navigator.geolocation ) {
  alert('Your browser cannot access to Geolocation, please activate.');
  throw new Error('Your browser cannot access to Geolocation, please activate.')
}

ReactDOM.render(
  <React.StrictMode>
    <MapsApp />
  </React.StrictMode>,
  document.getElementById('root')
);
