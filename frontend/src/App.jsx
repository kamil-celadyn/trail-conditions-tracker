import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Poprawka dla znikaj¹cych ikon markerów w React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

function App() {
    // Koordynaty startowe: Okolice Skrzycznego w Beskidach
    const startPosition = [49.6828, 19.0304];

    return (
        <div className="h-screen w-full flex flex-col font-sans">
            {/* Nawigacja górna (Tailwind CSS) */}
            <header className="bg-emerald-700 text-white p-4 shadow-md flex justify-between items-center">
                <h1 className="text-2xl font-bold">Trail Conditions Tracker</h1>
                <button className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg font-semibold transition">
                    Panel Administratora
                </button>
            </header>

            {/* Kontener Mapy */}
            <main className="flex-1 relative z-0">
                <MapContainer
                    center={startPosition}
                    zoom={13}
                    className="h-full w-full z-0"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* Przyk³adowy marker na szlaku */}
                    <Marker position={startPosition}>
                        <Popup>
                            <div className="text-center">
                                <h3 className="font-bold text-lg">Skrzyczne (1257 m n.p.m.)</h3>
                                <p className="text-red-600 font-semibold mt-1">Uwaga: Oblodzenie na szlaku!</p>
                            </div>
                        </Popup>
                    </Marker>
                </MapContainer>
            </main>
        </div>
    );
}

export default App;