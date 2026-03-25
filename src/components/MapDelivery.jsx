import { useState, useEffect, useMemo } from "react";
import Map, { Marker, Source, Layer } from "react-map-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import GeocoderControl from "./GeoCoderControl";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const MapDelivery = ({ onLocationSelect }) => {
    const [marker, setMarker] = useState({
        latitude: 19.4326,
        longitude: -99.1332
    });

    const tuUbicacion = {
        latitude: 19.327425216425173,
        longitude: -99.12420460313803
    };

    const distanciaKm = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * Math.PI / 180) *
            Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) ** 2;

        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    };

    const isInsideRange = distanciaKm(
        marker.latitude, marker.longitude,
        tuUbicacion.latitude, tuUbicacion.longitude
    ) <= 3;

    const handleUpdateLocation = (newLat, newLng) => {
        const isInside = distanciaKm(
            newLat, newLng,
            tuUbicacion.latitude, tuUbicacion.longitude
        ) <= 3;

        setMarker({
            latitude: newLat,
            longitude: newLng
        });

        onLocationSelect({
            latitude: newLat,
            longitude: newLng,
            dentroDelRango: isInside
        });
    };

    const handleGeocoderResult = (coords) => {
        const [lng, lat] = coords;
        
        handleUpdateLocation(lat, lng);
    };

    const circleGeoJSON = useMemo(() => {
        const points = [];
        const km = 3;
        
        const latRad = (tuUbicacion.latitude * Math.PI) / 180;
        const kmInDegLat = 1/111;
        const kmInDegLon = 1/(111 * Math.cos(latRad));

        for (let i = 0; i <= 64; i++) {
            const angle = (i * 360 / 64) * Math.PI / 180;
            const dLat = Math.sin(angle) * km * kmInDegLat;
            const dLon = Math.cos(angle) * km * kmInDegLon;
            
            points.push([
                tuUbicacion.longitude + dLon,
                tuUbicacion.latitude + dLat
            ]);
        }

        return {
            type: "Feature",
            geometry: {
                type: "Polygon",
                coordinates: [points]
            }
        };
    }, []);

    return (
        <div style={{ height: "350px", borderRadius: 12, overflow: "hidden", position: 'relative' }}>
            <Map
                mapboxAccessToken={MAPBOX_TOKEN}
                initialViewState={{
                    latitude: tuUbicacion.latitude,
                    longitude: tuUbicacion.longitude,
                    zoom: 11
                }}
                style={{ width: "100%", height: "100%" }}
                mapStyle="mapbox://styles/mapbox/streets-v11"
            >
                <GeocoderControl 
                    mapboxAccessToken={MAPBOX_TOKEN} 
                    position="top-left" 
                    onResult={handleGeocoderResult}
                />
                <Source id="circle-source" type="geojson" data={circleGeoJSON}>
                    <Layer
                        id="circle-fill"
                        type="fill"
                        paint={{
                            "fill-color": isInsideRange ? "#4caf50" : "#f44336",
                            "fill-opacity": 0.2,
                        }}
                    />
                    <Layer 
                        id="circle-outline"
                        type="line"
                        paint={{
                            "line-color": isInsideRange ? "#4caf50" : "#f44336",
                            "line-width": 2
                        }}
                    />
                </Source>

                {/* Marker */}
                <Marker
                    longitude={marker.longitude}
                    latitude={marker.latitude}
                    draggable
                    onDragEnd={(e) =>
                        // setMarker({
                        //     longitude: e.lngLat.lng,
                        //     latitude: e.lngLat.lat,
                        // })
                        handleUpdateLocation(e.lngLat.lat, e.lngLat.lng)
                    }
                />
            </Map>
        </div>
    );
};

export default MapDelivery;