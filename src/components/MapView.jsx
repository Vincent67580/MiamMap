import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
import '../styles/MapView.css';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

function MapRecenter({ center, zoom }) {
  const map = useMap();

  useEffect(() => {
    if (center && center.length === 2) {
      map.flyTo(center, zoom, {
        duration: 1.2,
      });
    }
  }, [center, zoom, map]);

  return null;
}

export default function MapView({ restaurants, selectedRestaurant, center, searchCenter }) {
  const defaultPosition = center || [48.8156, 7.7891];
  const markerRefs = useRef({});

  const targetPosition = selectedRestaurant
    ? [selectedRestaurant.lat, selectedRestaurant.lng]
    : defaultPosition;

  const targetZoom = selectedRestaurant ? 17 : 14;

  useEffect(() => {
    if (selectedRestaurant && markerRefs.current[selectedRestaurant.id]) {
      markerRefs.current[selectedRestaurant.id].openPopup();
    }
  }, [selectedRestaurant]);

  return (
    <div className="map-wrapper">
      <MapContainer
        center={defaultPosition}
        zoom={14}
        scrollWheelZoom={true}
        className="leaflet-map-instance"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapRecenter center={targetPosition} zoom={targetZoom} />

        {/* 🔵 Point central de recherche ou position GPS */}
        {searchCenter && (
          <CircleMarker
            center={searchCenter}
            radius={9}
            pathOptions={{
              color: '#ffffff',       // Bordure blanche
              fillColor: '#2563eb',   // Bleu vif moderne
              fillOpacity: 1,
              weight: 3
            }}
          >
            <Popup>
              <div className="map-popup-content">
                <h4 className="map-popup-title">📍 Centre de recherche</h4>
                <p>Point de référence de votre recherche ou position actuelle</p>
              </div>
            </Popup>
          </CircleMarker>
        )}

        {/* 🍽️ Marqueurs des restaurants */}
        {restaurants.map((resto) => (
          <Marker
            key={resto.id}
            position={[resto.lat, resto.lng]}
            ref={(el) => {
              markerRefs.current[resto.id] = el;
            }}
          >
            <Popup>
              <div className="map-popup-content">
                <h4 className="map-popup-title">{resto.name}</h4>
                <p className="map-popup-cuisine">{resto.cuisine}</p>
                <p className="map-popup-address">📍 {resto.address}</p>
                
                {resto.openingHours && (
                  <p className="map-popup-hours">🕒 {resto.openingHours}</p>
                )}

                {/* {resto.phone && (
                  <p className="map-popup-phone">
                    📞 <a href={`tel:${resto.phone}`}>{resto.phone}</a>
                  </p>
                )}

                {resto.website && (
                  <p className="map-popup-web">
                    🌐 <a href={resto.website} target="_blank" rel="noopener noreferrer">
                      Site officiel
                    </a>
                  </p>
                )} */}

                
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}