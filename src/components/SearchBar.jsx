import React, { useState } from 'react';
import '../styles/SearchBar.css';

export default function SearchBar({ onSearch, onGeolocate }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  return (
    <div className="search-bar-wrapper">
      {/* Formulaire de recherche textuelle d'adresse */}
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-group">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Rechercher une adresse, une ville..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <button type="submit" className="search-btn">
          Rechercher
        </button>
      </form>

      {/* Bouton de géolocalisation rapide "Autour de moi" */}
      {onGeolocate && (
        <button type="button" onClick={onGeolocate} className="geo-btn" title="Utiliser ma position actuelle">
          📍 Autour de moi
        </button>
      )}
    </div>
  );
}