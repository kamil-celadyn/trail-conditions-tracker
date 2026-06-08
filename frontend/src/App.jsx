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

    const [token, setToken] = useState(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [loginCredentials, setLoginCredentials] = useState({ username: '', password: '' });
    const [loginError, setLoginError] = useState('');

    const startPosition = [49.6828, 19.0304];
    const apiUrl = 'http://localhost:5022/api/TrailReports';

    const fetchReports = () => {
        fetch(apiUrl)
            .then(res => res.json())
            .then(data => setReports(data))
            .catch(err => console.error("Błąd pobierania danych:", err));
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

        fetch(apiUrl, {
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

    const handleLogin = (e) => {
        e.preventDefault();
        setLoginError('');

        fetch('http://localhost:5022/api/Auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginCredentials)
        })
            .then(async res => {
                if (res.ok) {
                    const data = await res.json();
                    setToken(data.token); 
                    setShowLoginModal(false);
                    setLoginCredentials({ username: '', password: '' });
                } else {
                    setLoginError('Nieprawidłowy login lub hasło.');
                }
            })
            .catch(() => setLoginError('Błąd połączenia z serwerem autoryzacji.'));
    };

    const handleDeleteReport = (id) => {
        if (!token) return;

        fetch(`${apiUrl}/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                if (res.ok) {
                    fetchReports(); 
                } else {
                    alert('Brak uprawnień lub sesja wygasła.');
                }
            })
            .catch(err => console.error("Błąd usuwania:", err));
    };

    const handleLogout = () => {
        setToken(null);
    };

    return (
        <div className="h-screen w-full flex flex-col font-sans">
            <header className="bg-emerald-700 text-white p-4 shadow-md flex justify-between items-center z-10 relative">
                <h1 className="text-2xl font-bold">Trail Conditions Tracker</h1>
                {token ? (
                    <div className="flex items-center gap-4">
                        <span className="text-emerald-200 text-sm font-semibold">Tryb Administratora</span>
                        <button onClick={handleLogout} className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg font-semibold transition">
                            Wyloguj
                        </button>
                    </div>
                ) : (
                    <button onClick={() => setShowLoginModal(true)} className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg font-semibold transition">
                        Panel Administratora
                    </button>
                )}
            </header>

            <main className="flex-1 relative flex">
                {showLoginModal && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-[2000]">
                        <div className="bg-white p-6 rounded-lg shadow-2xl w-80">
                            <h2 className="text-xl font-bold mb-4 text-emerald-800">Logowanie do panelu</h2>
                            <form onSubmit={handleLogin} className="flex flex-col gap-3">
                                <input
                                    type="text"
                                    placeholder="Login (admin)"
                                    className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    value={loginCredentials.username}
                                    onChange={e => setLoginCredentials({ ...loginCredentials, username: e.target.value })}
                                    required
                                />
                                <input
                                    type="password"
                                    placeholder="Hasło (admin123)"
                                    className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    value={loginCredentials.password}
                                    onChange={e => setLoginCredentials({ ...loginCredentials, password: e.target.value })}
                                    required
                                />
                                {loginError && <p className="text-red-500 text-xs font-semibold">{loginError}</p>}
                                <div className="flex gap-2 mt-2">
                                    <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded flex-1 hover:bg-emerald-700 font-semibold transition">
                                        Zaloguj
                                    </button>
                                    <button type="button" onClick={() => { setShowLoginModal(false); setLoginError(''); }} className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 font-semibold transition">
                                        Anuluj
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

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
                                <option value="Zaspy śnieżne">Zaspy śnieżne</option>
                                <option value="Szlak zamknięty">Szlak zamknięty</option>
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
                                <div className="text-center p-1">
                                    <h3 className="font-bold text-base">{report.trailName}</h3>
                                    <p className="text-red-600 font-semibold text-sm mt-1">Warunki: {report.condition}</p>
                                    {report.description && <p className="text-xs text-gray-700 mt-1 max-w-[180px] break-words">{report.description}</p>}

                                    {token && (
                                        <button
                                            onClick={() => handleDeleteReport(report.id)}
                                            className="mt-3 bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded font-bold shadow transition w-full"
                                        >
                                            Usuń zgłoszenie
                                        </button>
                                    )}
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