import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon not showing in Webpack/React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function Map({ events = [], filters = {} }) {
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    // 1. Initialize map only once
    if (!mapRef.current) {
      mapRef.current = L.map('map').setView([-17.7840, 31.0530], 17); // UZ Main Campus, zoom 17 fixes gray tiles
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(mapRef.current);

      // Force map to recalculate size - fixes gray tile issue
      setTimeout(() => {
        mapRef.current.invalidateSize();
      }, 100);
    }
  }, []);
  
  useEffect(() =>{
    const map = mapRef.current;
    if (!map) return;

    // 2. Clear old markers before adding new ones
    markersRef.current.forEach(marker => map.removeLayer(marker));
    markersRef.current = [];

    // 3. Filter events - handles "All" and empty filters
    const filteredEvents = events.filter(event => {
      const categoryMatch = filters.category === "All" || event.category === filters.category;
      
      const dateMatch =filters.date === "All" || event.date === filters.date;
      
      return categoryMatch && dateMatch;
    });
    

    // 4. Add new markers
    filteredEvents.forEach(event => {
      // Make sure lat/lng are numbers and in correct order: [lat, lng]
      const lat = Number(event.lat);
      const lng = Number(event.lng);
      
      if (isNaN(lat) || isNaN(lng)) {
        console.warn('Invalid coordinates for event:', event);
        return;
      }

      const marker = L.marker([lat, lng])
        .addTo(map)
        .bindPopup(`
          <div style="min-width: 150px">
            <b>${event.title}</b><br/>
            <i>${event.category}</i><br/>
            ${event.date}<br/>
            ${event.location || ''}
          </div>
        `);
      
      markersRef.current.push(marker);
    });

    // 5. Auto-zoom to fit all markers if there are any
    if (markersRef.current.length > 0) {
      const group = L.featureGroup(markersRef.current);
      map.fitBounds(group.getBounds().pad(0.2));
    }

  }, [events, filters]); // Re-run when events or filters change

  return (
    <div 
      id="map" 
      style={{ 
        height: "500px", 
        width: "100%", 
        borderRadius: "8px",
        border: "1px solid #ccc"
      }}
    ></div>
  );
}
