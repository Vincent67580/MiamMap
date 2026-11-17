// Fichier : src/services/api.js

export async function searchLocation(query) {
  if (!query || !query.trim()) return null;

  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&featuretype=settlement&limit=5`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'MiamMap-React-App'
      }
    });

    const data = await response.json();

    if (data && data.length > 0) {
      const bestMatch = data.find(item => item.osm_type === 'node') || data[0];

      return {
        lat: parseFloat(bestMatch.lat),
        lng: parseFloat(bestMatch.lon),
        displayName: bestMatch.display_name
      };
    }
  } catch (error) {
    console.error("Erreur lors de la recherche avec Nominatim :", error);
  }
  return null;
}

// Fonction de calcul de distance Haversine
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const toRad = d => d * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

export async function fetchRealRestaurants(lat, lng, radius = 2000) {
  const OVERPASS_SERVERS = [
    "https://overpass-api.de/api/interpreter",
    "https://lz4.overpass-api.de/api/interpreter",
    "https://overpass.openstreetmap.fr/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter"
  ];

  // Requête Overpass globale pour récupérer tous les restaurants (nodes et ways) dans le rayon
  const overpassQuery = `
    [out:json][timeout:25];
    (
      node["amenity"="restaurant"](around:${radius},${lat},${lng});
      way["amenity"="restaurant"](around:${radius},${lat},${lng});
    );
    out center;
  `;

  let json = null;

  // Boucle de résilience avec POST
  for (const server of OVERPASS_SERVERS) {
    try {
      const response = await fetch(server, {
        method: "POST",
        body: new URLSearchParams({ data: overpassQuery })
      });

      if (response.ok) {
        json = await response.json();
        break;
      }
    } catch (e) {
      console.warn(`Serveur ${server} indisponible, essai suivant...`);
    }
  }

  if (!json || !json.elements) {
    throw new Error("Impossible de joindre les serveurs Overpass. Les serveurs sont actuellement surchargés.");
  }

  return json.elements
    .map((element, index) => {
      const elementLat = element.lat || element.center?.lat;
      const elementLon = element.lon || element.center?.lon;

      if (elementLat === undefined || elementLon === undefined || !element.tags || !element.tags.name) {
        return null;
      }

      const tags = element.tags;
      const street = tags["addr:street"] || tags["contact:street"] || "";
      const num = tags["addr:housenumber"] || tags["contact:housenumber"] || "";
      const postcode = tags["addr:postcode"] || tags["contact:postcode"] || "";
      const city = tags["addr:city"] || tags["contact:city"] || "";

      let address = "Adresse non spécifiée";
      if (street) {
        const streetPart = `${num} ${street}`.trim();
        const cityPart = `${postcode} ${city}`.trim();
        address = cityPart ? `${streetPart}, ${cityPart}` : streetPart;
      }

      const cuisine = tags.cuisine 
        ? tags.cuisine.replace(/_/g, ' ').replace(/;/g, ', ') 
        : "Cuisine variée";

      return {
        id: element.id || index,
        name: tags.name,
        cuisine: cuisine.charAt(0).toUpperCase() + cuisine.slice(1),
        address: address,
        phone: tags.phone || tags["contact:phone"] || null,
        website: tags.website || tags["contact:website"] || null,
        openingHours: tags.opening_hours || null,
        wheelchair: tags.wheelchair || null,
        outdoorSeating: tags.outdoor_seating === 'yes',
        lat: elementLat,
        lng: elementLon,
        dist: calculateDistance(lat, lng, elementLat, elementLon)
      };
    })
    .filter(Boolean);
}