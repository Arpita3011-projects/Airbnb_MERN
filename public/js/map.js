// This script runs on the client-side to render the map for a listing

window.addEventListener('load',() => {
    if (typeof L==='undefined') {
        console.error('Leaflet is not loaded.');
        return;
    }
    const mapElement=document.getElementById('map');
    if (!mapElement) {
        console.error('Map element #map not found in DOM.');
        return;
    }
    if(typeof coordinates==='undefined'||!Array.isArray(coordinates)||coordinates.length !== 2) {
        console.error('Invalid coordinates for map initialization:',coordinates);
        return;
    }
    const map = L.map('map').setView([coordinates[1], coordinates[0]], 11);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const marker=L.marker([coordinates[1],coordinates[0]]).addTo(map);
    marker.bindPopup(`<h4>${listingTitle}</h4><p>Exact location provided after booking</p>`).openPopup();

    setTimeout(() => {
        map.invalidateSize();
    }, 0);
});
