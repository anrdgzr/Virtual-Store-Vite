import { useControl } from 'react-map-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

export default function GeocoderControl(props) {
  useControl(
    () => {
      const ctrl = new MapboxGeocoder({
        ...props,
        marker: false,
        accessToken: props.mapboxAccessToken
      });
      
      ctrl.on('result', (e) => {
        const coords = e.result.geometry.coordinates;
        props.onResult(coords);
      });

      return ctrl;
    },
    { position: props.position }
  );

  return null;
}