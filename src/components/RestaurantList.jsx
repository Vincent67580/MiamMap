import React from 'react';
import '../styles/RestaurantList.css';

export default function RestaurantList({ restaurants, selectedRestaurant, onSelectRestaurant }) {
  if (!restaurants || restaurants.length === 0) {
    return <div className="no-results">Aucun restaurant trouvé 🍽️</div>;
  }

  return (
    <div className="restaurant-list-container">
      {restaurants.map((resto) => {
        const isSelected = selectedRestaurant && selectedRestaurant.id === resto.id;

        return (
          <div 
            key={resto.id} 
            className={`restaurant-card ${isSelected ? 'active' : ''}`}
            onClick={() => onSelectRestaurant && onSelectRestaurant(resto)}
          >
            <h3>{resto.name}</h3>
            <p className="restaurant-cuisine">{resto.cuisine}</p>
            <p className="restaurant-address">📍 {resto.address}</p>
            
            {resto.openingHours && (
              <p className="restaurant-hours">🕒 {resto.openingHours}</p>
            )}

            {resto.phone && (
              <p className="restaurant-phone">
                📞 <a href={`tel:${resto.phone}`} onClick={(e) => e.stopPropagation()}>{resto.phone}</a>
              </p>
            )}

            {resto.website && (
              <p className="restaurant-web">
                🌐 <a href={resto.website} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                  Site officiel
                </a>
              </p>
            )}

            <div style={{ marginTop: '8px', display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
              {resto.wheelchair === 'yes' && (
                <span className="badge-accessibility" style={{ fontSize: '11px', background: '#e6f4ea', padding: '2px 6px', borderRadius: '4px' }}>
                  ♿ Accessible PMR
                </span>
              )}
              {resto.outdoorSeating && (
                <span className="badge-seating" style={{ fontSize: '11px', background: '#fff8e1', padding: '2px 6px', borderRadius: '4px' }}>
                  ☀️ Terrasse
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}