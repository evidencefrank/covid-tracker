import React from 'react';
import "./Map.css";
import { MapContainer as LeafletMap, TileLayer, useMap } from "react-leaflet";
import { showDataOnMap } from './util';

function ChangeMap ({ center, zoom }) {
    const map = useMap();
    map.setView(center, zoom);
    return null;
}

function Map ({ countries, type, center, zoom }) {
    return (
        <div className="map">
            <LeafletMap>
                <ChangeMap center={center} zoom={zoom} />
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png">
                </TileLayer>
                {/* loop through countries and draw circles */}
                {showDataOnMap(countries, type)}
            </LeafletMap>
        </div>
    );
}

export default Map
