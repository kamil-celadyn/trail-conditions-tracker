import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

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

function LocationPicker({ onLocationSelect }) {
    useMapEvents({
        click(e) {
            onLocationSelect(e.latlng);
        },
    });
    return null;
}

function App() {
    const [reports, setReports] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [formData, setFormData] = useState({ trailName: '', condition: 'Dobre', description: '' });

    const startPosition = [49.6828, 19.0304];

    const fetchReports = () => {
        fetch('https://localhost:5022/api/TrailReports')
            .then(res => res.json())
            .then(data => setReports(data))
            .catch(err => console.error("Błąd pobierania:", err));
    };

    useEffect(() => {
        fetchReports();
    }, []);


    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedLocation) return;

        const newReport = {
            trailName: formData.trailName,
            latitude: selectedLocation.lat,
            longitude: selectedLocation.lng,
            condition: formData.condition,
            description: formData.description
        };

        fetch('https://localhost:7205/api/TrailReports', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newReport)
        })
            .then(res => {
                if (res.ok) {
                    setSelectedLocation(null); 
                    setFormData({ trailName: '', condition: 'Dobre', description: '' }); 
                    fetchReports(); 
                }
            })
            .catch(err => console.error("Błąd wysyłania:", err));
    };

    return (
        <div className="h-screen w-full flex flex-col font-sans">
            <header className="bg-emerald-700 text-white p-4 shadow-md flex justify-between items-center z-10 relative">
                <h1 className="text-2xl font-bold">Trail Conditions Tracker</h1>
                <button className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg font-semibold transition">
                    Panel Administratora
                </button>
            </header>

            <main className="flex-1 relative flex">
              
                {selectedLocation && (
                    <div className="absolute top-4 left-4 z-[1000] bg-white p-6 rounded-lg shadow-xl w-80">
                        <h2 className="text-xl font-bold mb-4 text-emerald-800">Nowe zgłoszenie</h2>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                            <input
                                type="text"
                                placeholder="Nazwa szlaku (np. Skrzyczne)"
                                className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                value={formData.trailName}
                                onChange={e => setFormData({ ...formData, trailName: e.target.value })}
                                required
                            />
                            <select
                                className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                value={formData.condition}
                                onChange={e => setFormData({ ...formData, condition: e.target.value })}
                            >
                                <option value="Dobre">Dobre warunki</option>
                                <option value="Błoto">Błoto</option>
                                <option value="Oblodzenie">Oblodzenie</option>
                                <option value="Zaspy">Zaspy śnieżne</option>
                                <option value="Zamknięty">Szlak zamknięty</option>
                            </select>
                            <textarea
                                placeholder="Opis dodatkowy (opcjonalnie)"
                                className="border p-2 rounded resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                rows="3"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                            <div className="flex gap-2 mt-2">
                                <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded flex-1 hover:bg-emerald-700 font-semibold transition">
                                    Zgłoś
                                </button>
                                <button type="button" onClick={() => setSelectedLocation(null)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 font-semibold transition">
                                    Anuluj
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <MapContainer center={startPosition} zoom={13} className="h-full w-full z-0">
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <LocationPicker onLocationSelect={setSelectedLocation} />

                    {selectedLocation && (
                        <Marker position={selectedLocation}>
                            <Popup>Dodajesz zgłoszenie w tym miejscu</Popup>
                        </Marker>
                    )}

                    {reports.map((report) => (
                        <Marker key={report.id} position={[report.latitude, report.longitude]}>
                            <Popup>
                                <div className="text-center">
                                    <h3 className="font-bold text-lg">{report.trailName}</h3>
                                    <p className="text-red-600 font-semibold mt-1">Warunki: {report.condition}</p>
                                    {report.description && <p className="text-sm mt-2">{report.description}</p>}
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </main>
        </div>
    );
}

export default App;