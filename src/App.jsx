import React, { useState } from 'react';
import Header from './components/Header';
import ControlsBar from './components/ControlsBar';
import RestaurantList from './components/RestaurantList';
import MapView from './components/MapView';
import Spinner from './components/Spinner';
import Footer from './components/Footer';
import { searchLocation, fetchRealRestaurants } from './services/api';
import 'leaflet/dist/leaflet.css';
import './App.css';

export default function App() {
  const [restaurants, setRestaurants] = useState([]);
  const [mapCenter, setMapCenter] = useState([48.8156, 7.7891]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const [radius, setRadius] = useState(2000);
  const [selectedCuisine, setSelectedCuisine] = useState('all');
  const [lastQueryCoords, setLastQueryCoords] = useState(null);
  const [showMap, setShowMap] = useState(true);

  const handleSearch = async (query) => {
    setLoading(true);
    setErrorMsg(null);
    setSelectedRestaurant(null);

    const location = await searchLocation(query);

    if (location) {
      const coords = [location.lat, location.lng];
      setMapCenter(coords);
      setLastQueryCoords(coords);

      try {
        const realRestos = await fetchRealRestaurants(location.lat, location.lng, radius);
        setRestaurants(realRestos);
        setSelectedCuisine('all');
      } catch (err) {
        setErrorMsg(err.message);
        setRestaurants([]);
      }
    } else {
      alert("Adresse introuvable !");
    }
    setLoading(false);
  };

  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      alert("La géolocalisation n'est pas supportée par votre navigateur.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSelectedRestaurant(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const coords = [lat, lng];

        setMapCenter(coords);
        setLastQueryCoords(coords);

        try {
          const realRestos = await fetchRealRestaurants(lat, lng, radius);
          setRestaurants(realRestos);
          setSelectedCuisine('all');
        } catch (err) {
          setErrorMsg(err.message);
          setRestaurants([]);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Erreur de géolocalisation :", error);
        alert("Impossible de récupérer votre position.");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleRadiusChange = async (newRadius) => {
    setRadius(newRadius);
    setSelectedRestaurant(null);
    if (lastQueryCoords) {
      setLoading(true);
      setErrorMsg(null);
      try {
        const realRestos = await fetchRealRestaurants(lastQueryCoords[0], lastQueryCoords[1], newRadius);
        setRestaurants(realRestos);
      } catch (err) {
        setErrorMsg(err.message);
        setRestaurants([]);
      }
      setLoading(false);
    }
  };

  const handleCuisineChange = (cuisine) => {
    setSelectedCuisine(cuisine);
    setSelectedRestaurant(null);
    if (lastQueryCoords) {
      setMapCenter([...lastQueryCoords]);
    }
  };

  const handleSelectRestaurant = (resto) => {
    if (selectedRestaurant && selectedRestaurant.id === resto.id) {
      setSelectedRestaurant(null);
      if (lastQueryCoords) {
        setMapCenter([...lastQueryCoords]);
      }
    } else {
      setSelectedRestaurant(resto);
      if (!showMap) setShowMap(true);
    }
  };

  const filteredRestaurants = selectedCuisine === 'all'
    ? restaurants
    : restaurants.filter(r => r.cuisine === selectedCuisine);

  const availableCuisines = [...new Set(restaurants.map(r => r.cuisine))];

  return (
    <div className="miam-app-container">
      <Header />

      <ControlsBar
        onSearch={handleSearch}
        onGeolocate={handleGeolocate}
        radius={radius}
        onRadiusChange={handleRadiusChange}
        showMap={showMap}
        onToggleMap={() => setShowMap((prev) => !prev)}
      />

      <main className={`content-layout ${!showMap ? 'map-hidden' : ''}`}>
        <div className="sidebar-list">
          <h2>Restaurants à proximité</h2>

          {restaurants.length > 0 && (
            <div className="cuisine-filters-container">
              <button
                className={selectedCuisine === 'all' ? 'cuisine-btn active' : 'cuisine-btn'}
                onClick={() => handleCuisineChange('all')}
              >
                Tous ({restaurants.length})
              </button>
              {availableCuisines.map((cuisine) => (
                <button
                  key={cuisine}
                  className={selectedCuisine === cuisine ? 'cuisine-btn active' : 'cuisine-btn'}
                  onClick={() => handleCuisineChange(cuisine)}
                >
                  {cuisine}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <Spinner text="Recherche en cours..." />
          ) : errorMsg ? (
            <div className="error-banner" style={{ background: '#fee2e2', color: '#991b1b', padding: '15px', borderRadius: '8px', margin: '15px 0', border: '1px solid #fecaca' }}>
              <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>⚠️ Erreur de connexion</p>
              <p>{errorMsg}</p>
            </div>
          ) : restaurants.length === 0 ? (
            <p className="welcome-message">
              🔍 Entrez une ville ou cliquez sur <strong>"Autour de moi"</strong> pour lancer la recherche !
            </p>
          ) : filteredRestaurants.length === 0 ? (
            <p className="no-results-filter">Aucun restaurant ne correspond à ce type de cuisine.</p>
          ) : (
            <RestaurantList
              restaurants={filteredRestaurants}
              selectedRestaurant={selectedRestaurant}
              onSelectRestaurant={handleSelectRestaurant}
            />
          )}
        </div>

        {showMap && (
          <div className="map-section">
            <MapView
              restaurants={filteredRestaurants}
              selectedRestaurant={selectedRestaurant}
              center={mapCenter}
              searchCenter={lastQueryCoords}
              radius={radius}
            />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}