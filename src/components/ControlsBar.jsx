import React from 'react';
import SearchBar from './SearchBar';
import '../styles/ControlsBar.css';

export default function ControlsBar({
  onSearch,
  onGeolocate,
  radius,
  onRadiusChange,
  showMap,
  onToggleMap,
}) {
  return (
    <div className="top-controls-bar">
      <SearchBar onSearch={onSearch} onGeolocate={onGeolocate} />

      <div className="header-controls">
        <div className="radius-selector-header">
          <label htmlFor="radius-select">📏 Rayon :</label>
          <select
            id="radius-select"
            value={radius}
            onChange={(e) => onRadiusChange(Number(e.target.value))}
          >
            <option value={1000}>1 km</option>
            <option value={2000}>2 km</option>
            <option value={5000}>5 km</option>
            <option value={10000}>10 km</option>
            <option value={20000}>20 km</option>
          </select>
        </div>

        <button
          type="button"
          className="toggle-map-btn"
          onClick={onToggleMap}
        >
          {showMap ? '🗺️ Masquer la carte' : '🗺️ Afficher la carte'}
        </button>
      </div>
    </div>
  );
}