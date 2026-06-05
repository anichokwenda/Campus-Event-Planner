import { useEffect, useRef } from "react";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import markerRetina from "leaflet/dist/images/marker-icon-2x.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerRetina,
    shadowUrl: markerShadow,
});

export default function Map({ events, filters }) {
  useEffect(() => {
    const map = L.map('map').setView([-17.7840, 31.0530], 16); // Your campus coords

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(map);

    const filteredEvents = events.filter(event => {
      if (filters.category && event.category !== filters.category) return false;
      if (filters.date && event.date !== filters.date) return false;
      return true;
    });

    const markers = L.markerClusterGroup();
    filteredEvents.forEach(event => {
      L.marker([event.lat, event.lng])
        .bindPopup(event.title)
        .addTo(markers);
    });
    map.addLayer(markers);

    return () => map.remove();
  }, [events, filters]);

  return <div id="map" style={{ height: "600px", width: "100%" }} />;
}
