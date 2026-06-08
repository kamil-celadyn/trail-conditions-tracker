# Trail Conditions Tracker

System monitorowania warunków na szlakach i planowania wędrówek. 
Projekt zaliczeniowy z podziałem na warstwę prezentacji (Frontend) oraz panel zarządzania (Backend).

## Cel biznesowy
Zapewnienie turystom aktualnych informacji o warunkach na szlakach górskich (np. ostrzeżenia o błocie, zaspach, oblodzeniu) zgłaszanych na żywo przez użytkowników, oraz panel weryfikacyjny dla administratorów.

## Technologie
* **Backend:** ASP.NET Core 8 Web API, Entity Framework Core, SQLite (zastąpiono PostGIS w celu zapewnienia w 100% bezkonfiguracyjnego środowiska lokalnego/zero-config), JWT Authentication, Swagger.
* **Frontend:** React / Vue.js, Leaflet / OpenLayers, Tailwind CSS (w trakcie implementacji).

## Instrukcja uruchomienia lokalnego (Backend)

Aby uruchomić serwer lokalnie, wykonaj poniższe kroki:

1. Otwórz terminal w głównym folderze sklonowanego repozytorium.
2. Przejdź do folderu z projektem API:
   `cd backend/TrailTracker.API`
3. Aplikacja korzysta z bazy SQLite. Aby wygenerować plik bazy danych (`trailtracker.db`) na podstawie modeli, wykonaj migrację:
   `dotnet ef database update`
4. Uruchom aplikację:
   `dotnet run`
5. Serwer zostanie uruchomiony. Interaktywna dokumentacja API oraz możliwość testowania znajduje się pod adresem: 
   `https://localhost:<PORT>/swagger` (port wyświetli się w oknie terminala).

## System autoryzacji (Zabezpieczenie Panelu)
Aplikacja posiada dedykowany moduł administracyjny zabezpieczony systemem autentykacji i autoryzacji opartym o tokeny JWT. Modyfikacja danych (edycja zgłoszeń, usuwanie fałszywych raportów) wymaga zalogowania.

Domyślne dane administratora (na potrzeby testów):
* **Login:** admin
* **Hasło:** admin123