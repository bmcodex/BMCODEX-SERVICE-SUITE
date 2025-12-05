# BMCODEX Service Suite™

> **Kompleksowy system zarządzania serwisem BMW** - Profesjonalne narzędzie do diagnostyki, tuningu i zarządzania projektami serwisowymi

![BMW Performance](https://img.shields.io/badge/BMW-Performance-FF4500?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

---

## 📋 Spis treści

- [O projekcie](#-o-projekcie)
- [Funkcjonalności](#-funkcjonalności)
- [Moduły systemu](#-moduły-systemu)
- [Technologie](#-technologie)
- [Instalacja](#-instalacja)
- [Konfiguracja](#-konfiguracja)
- [Użytkowanie](#-użytkowanie)
- [Struktura projektu](#-struktura-projektu)
- [API i baza danych](#-api-i-baza-danych)
- [Autor](#-autor)

---

## 🚀 O projekcie

**BMCODEX Service Suite™** to zaawansowana aplikacja webowa stworzona specjalnie dla warsztatów specjalizujących się w serwisie, diagnostyce i tuningu pojazdów BMW. System łączy w sobie cztery kluczowe moduły, które usprawniają codzienną pracę warsztatu i podnoszą poziom obsługi klienta.

### Dlaczego BMCODEX Service Suite?

- ✅ **Profesjonalna diagnostyka** - Analiza kodów DTC z prawdopodobnymi przyczynami i kosztami naprawy
- ✅ **Pełna historia pojazdu** - Kartoteki z archiwum softów ECU/TCU i galerią zdjęć
- ✅ **Zarządzanie projektami** - Kolorowe statusy i śledzenie postępu prac
- ✅ **Automatyczne protokoły** - Generowanie PDF z brandingiem BMCODEX
- ✅ **System rezerwacji** - Kalendarz wizyt z automatycznymi powiadomieniami
- ✅ **Responsywny design** - Działa na desktop, tablet i telefon

---

## 🎯 Funkcjonalności

### Kluczowe możliwości

1. **Diagnostyka OBD2/DTC**
   - Analiza kodów błędów z bazą wiedzy
   - Prawdopodobne przyczyny z procentami
   - Szacunkowe koszty naprawy w PLN
   - Ocena zagrożeń dla pojazdu
   - Kompatybilność z tuningiem (Stage 1/2)

2. **Zarządzanie pojazdami**
   - Pełne kartoteki pojazdów (VIN, model, przebieg)
   - Historia wizyt i wykonanych usług
   - Archiwum softów (ECU/TCU stock/mod)
   - Galeria zdjęć i filmów
   - Kolorowe statusy projektów

3. **Rezerwacje i kalendarz**
   - Wybór usługi (kodowanie, tuning, xHP, diagnostyka)
   - Dostępne terminy wizyt
   - Automatyczne powiadomienia (24h, 2h przed wizytą)
   - Timeline dla klienta
   - Synchronizacja z kalendarzem

4. **Protokoły przyjęcia/wydania**
   - Zdjęcia 360° pojazdu
   - Zaznaczanie uszkodzeń na sylwetce
   - Lista uwag i zgód klienta
   - Podpis cyfrowy
   - Automatyczne generowanie PDF

---

## 🧩 Moduły systemu

### 1️⃣ DTC Analyzer Pro

Moduł diagnostyczny do analizy kodów błędów OBD2.

**Funkcje:**
- Wprowadzanie kodu DTC
- Wyświetlanie check-listy diagnostycznej
- Prawdopodobne przyczyny z procentami
- Szacunkowe koszty naprawy (części + robocizna)
- Ocena zagrożeń dla silnika, skrzyni, turbo
- Analiza kompatybilności z tuningiem
- Automatyczny zapis do historii pojazdu

### 2️⃣ Garage Manager

System zarządzania kartotekami pojazdów klientów.

**Funkcje:**
- Dane podstawowe (VIN, model, rocznik, przebieg, silnik, skrzynia)
- Historia wizyt (kodowanie, tuning, xHP, diagnostyka, naprawy)
- Archiwum softów (ECU stock, ECU mod, TCU stock, TCU mod)
- Przechowywanie logów jazdy
- Galeria zdjęć i filmów
- Kolorowe statusy projektów:
  - 🔵 Przyjęty
  - 🟡 W trakcie
  - 🟣 Czeka na części
  - 🟢 Gotowy do odbioru
  - ⚪ Zakończony

### 3️⃣ Booking & Timeline Engine

Moduł rezerwacji i zarządzania terminami wizyt.

**Funkcje:**
- Wybór usługi (kodowanie BMW, chiptuning Stage 1/2, xHP, diagnostyka)
- Wyświetlanie dostępnych terminów
- Automatyczne tworzenie profilu klienta
- Automatyczne tworzenie projektu w Garage Manager
- Automatyczne tworzenie protokołu przyjęcia
- Powiadomienia:
  - 24h przed wizytą
  - 2h przed wizytą
  - Po zakończeniu prac
- Timeline dla klienta (wizualizacja postępu)

### 4️⃣ Protocol Pro

Moduł protokołów przyjęcia i wydania z generowaniem PDF.

**Protokół przyjęcia:**
- Dane auta i klienta
- Zdjęcia 360° pojazdu
- Zaznaczanie uszkodzeń na sylwetce
- Lista uwag i zgód
- Podpis klienta

**Protokół wydania:**
- Lista wykonanych prac
- Wgrane softy (ECU/TCU stock/mod)
- Lista zmian i uwag
- Zdjęcia po realizacji
- Podpis klienta

**PDF:**
- Branding BMCODEX (ciemne tło + #FF4500)
- Możliwość pobrania i wydruku
- Automatyczny zapis w historii pojazdu

---

## 🛠 Technologie

### Frontend
- **React 19** - Nowoczesna biblioteka UI
- **TypeScript** - Typowanie statyczne
- **Tailwind CSS 4** - Utility-first CSS framework
- **Wouter** - Lekki routing
- **shadcn/ui** - Komponenty UI
- **tRPC** - End-to-end typesafe API

### Backend
- **Node.js 22** - Runtime JavaScript
- **Express 4** - Framework webowy
- **tRPC 11** - API framework
- **Drizzle ORM** - TypeScript ORM
- **MySQL/TiDB** - Baza danych

### Narzędzia
- **Vite** - Build tool
- **pnpm** - Package manager
- **Vitest** - Testing framework
- **ESBuild** - JavaScript bundler

---

## 📦 Instalacja

### Wymagania

- Node.js 22.x lub nowszy
- pnpm 10.x lub nowszy
- MySQL 8.x lub TiDB

### Krok 1: Klonowanie repozytorium

```bash
git clone https://github.com/bmcodex/BMCODEX-SERVICE-SUITE.git
cd BMCODEX-SERVICE-SUITE
```

### Krok 2: Instalacja zależności

```bash
pnpm install
```

### Krok 3: Konfiguracja bazy danych

Utwórz plik `.env` w głównym katalogu projektu:

```env
DATABASE_URL=mysql://user:password@localhost:3306/bmcodex
JWT_SECRET=your-secret-key-here
OAUTH_SERVER_URL=https://api.manus.im
VITE_APP_ID=your-app-id
```

### Krok 4: Migracja bazy danych

```bash
pnpm db:push
```

### Krok 5: Uruchomienie aplikacji

**Tryb deweloperski:**
```bash
pnpm dev
```

**Tryb produkcyjny:**
```bash
pnpm build
pnpm start
```

Aplikacja będzie dostępna pod adresem: `http://localhost:3000`

---

## ⚙️ Konfiguracja

### Zmienne środowiskowe

| Zmienna | Opis | Przykład |
|---------|------|----------|
| `DATABASE_URL` | URL połączenia z bazą danych | `mysql://user:pass@localhost:3306/db` |
| `JWT_SECRET` | Klucz do podpisywania tokenów JWT | `your-secret-key` |
| `OAUTH_SERVER_URL` | URL serwera OAuth | `https://api.manus.im` |
| `VITE_APP_ID` | ID aplikacji OAuth | `your-app-id` |

### Konfiguracja bazy danych

Plik `drizzle.config.ts`:

```typescript
export default {
  schema: "./drizzle/schema.ts",
  out: "./drizzle",
  driver: "mysql2",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
};
```

---

## 📖 Użytkowanie

### 1. Logowanie do systemu

Po uruchomieniu aplikacji, kliknij przycisk **"Zaloguj się"** na stronie głównej. System wykorzystuje OAuth do bezpiecznej autentykacji.

### 2. Dodawanie klienta

1. Przejdź do modułu **Garage Manager**
2. Kliknij **"Dodaj pojazd"**
3. Wybierz klienta z listy lub dodaj nowego
4. Wprowadź dane pojazdu (VIN, marka, model, rocznik)
5. Zapisz pojazd

### 3. Diagnostyka DTC

1. Przejdź do modułu **DTC Analyzer Pro**
2. Wprowadź kod błędu (np. P0171)
3. Wybierz pojazd z listy
4. Kliknij **"Analizuj kod"**
5. System wyświetli:
   - Opis błędu
   - Check-listę diagnostyczną
   - Prawdopodobne przyczyny
   - Szacunkowe koszty naprawy
   - Zagrożenia
   - Kompatybilność z tuningiem

### 4. Tworzenie rezerwacji

1. Przejdź do modułu **Booking Engine**
2. Kliknij **"Nowa rezerwacja"**
3. Wybierz klienta i pojazd
4. Wybierz typ usługi
5. Ustaw datę i godzinę wizyty
6. Dodaj uwagi (opcjonalnie)
7. Zapisz rezerwację

### 5. Tworzenie protokołu

1. Przejdź do modułu **Protocol Pro**
2. Kliknij **"Nowy protokół"**
3. Wybierz typ (przyjęcie/wydanie)
4. Wybierz projekt
5. Dodaj uwagi i zgody klienta
6. System automatycznie wygeneruje PDF

### 6. Przeglądanie historii pojazdu

1. Przejdź do modułu **Garage Manager**
2. Kliknij na wybrany pojazd
3. Przeglądaj zakładki:
   - **Projekty** - lista wszystkich projektów
   - **DTC** - historia kodów błędów
   - **Softy** - archiwum plików ECU/TCU
   - **Media** - zdjęcia i filmy
   - **Protokoły** - protokoły przyjęcia/wydania
   - **Historia** - historia serwisowa

---

## 📁 Struktura projektu

```
bmcodex-service-suite/
├── client/                 # Frontend aplikacji
│   ├── public/            # Pliki statyczne
│   └── src/
│       ├── components/    # Komponenty React
│       ├── pages/         # Strony aplikacji
│       ├── lib/           # Biblioteki i utils
│       ├── contexts/      # Konteksty React
│       └── App.tsx        # Główny komponent
├── server/                # Backend aplikacji
│   ├── _core/            # Infrastruktura (OAuth, tRPC)
│   ├── db.ts             # Query helpers
│   └── routers.ts        # tRPC procedures
├── drizzle/              # Schema i migracje bazy danych
│   └── schema.ts         # Definicje tabel
├── shared/               # Współdzielone typy i stałe
├── package.json          # Zależności projektu
└── README.md             # Dokumentacja
```

### Kluczowe pliki

- **`client/src/App.tsx`** - Routing i layout aplikacji
- **`client/src/pages/`** - Komponenty stron (Home, DtcAnalyzer, GarageManager, etc.)
- **`server/routers.ts`** - Definicje procedur tRPC (API endpoints)
- **`server/db.ts`** - Funkcje zapytań do bazy danych
- **`drizzle/schema.ts`** - Schema bazy danych (tabele, relacje)

---

## 🗄 API i baza danych

### Tabele bazy danych

| Tabela | Opis |
|--------|------|
| `users` | Użytkownicy systemu |
| `clients` | Klienci warsztatu |
| `vehicles` | Pojazdy klientów |
| `projects` | Projekty serwisowe |
| `dtcCodes` | Kody błędów DTC |
| `softwareFiles` | Pliki softów ECU/TCU |
| `vehicleMedia` | Zdjęcia i filmy pojazdów |
| `protocols` | Protokoły przyjęcia/wydania |
| `bookings` | Rezerwacje wizyt |
| `serviceHistory` | Historia serwisowa |
| `notifications` | Powiadomienia |

### Główne procedury tRPC

**Klienci:**
- `clients.list` - Lista wszystkich klientów
- `clients.getById` - Pobierz klienta po ID
- `clients.create` - Utwórz nowego klienta
- `clients.update` - Aktualizuj dane klienta

**Pojazdy:**
- `vehicles.list` - Lista wszystkich pojazdów
- `vehicles.getById` - Pobierz pojazd po ID
- `vehicles.getByVin` - Pobierz pojazd po VIN
- `vehicles.create` - Dodaj nowy pojazd
- `vehicles.update` - Aktualizuj dane pojazdu

**Diagnostyka DTC:**
- `dtc.analyze` - Analizuj kod DTC
- `dtc.getByVehicleId` - Pobierz kody DTC pojazdu
- `dtc.markResolved` - Oznacz kod jako rozwiązany

**Projekty:**
- `projects.list` - Lista wszystkich projektów
- `projects.getById` - Pobierz projekt po ID
- `projects.create` - Utwórz nowy projekt
- `projects.update` - Aktualizuj status projektu

**Rezerwacje:**
- `bookings.list` - Lista wszystkich rezerwacji
- `bookings.upcoming` - Nadchodzące wizyty
- `bookings.create` - Utwórz nową rezerwację
- `bookings.update` - Aktualizuj rezerwację

**Protokoły:**
- `protocols.create` - Utwórz protokół
- `protocols.getByProjectId` - Pobierz protokoły projektu
- `protocols.update` - Aktualizuj protokół

---

## 🎨 Design System

### Kolory

Aplikacja wykorzystuje ciemny motyw z pomarańczowymi akcentami w stylu BMW Performance:

- **Tło główne:** `#1A1A1A` (ciemny szary)
- **Akcent główny:** `#FF4500` (pomarańczowy)
- **Tło kart:** `#212121` (ciemniejszy szary)
- **Tekst główny:** `#F5F5F5` (jasny szary)
- **Tekst wyciszony:** `#A0A0A0` (szary)

### Statusy projektów

- 🔵 **Przyjęty** - Projekt przyjęty do realizacji
- 🟡 **W trakcie** - Prace w toku
- 🟣 **Czeka na części** - Oczekiwanie na dostawę części
- 🟢 **Gotowy do odbioru** - Projekt zakończony, czeka na odbiór
- ⚪ **Zakończony** - Projekt zakończony i odebrany

### Typografia

- **Nagłówki:** Rajdhani (700)
- **Tekst:** Inter (300-800)

---

## 🧪 Testowanie

### Uruchomienie testów

```bash
pnpm test
```

### Przykładowy test

```typescript
import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";

describe("dtc.analyze", () => {
  it("should analyze DTC code P0171", async () => {
    const caller = appRouter.createCaller(ctx);
    const result = await caller.dtc.analyze({
      code: "P0171",
      vehicleId: 1,
    });

    expect(result.description).toContain("System za ubogi");
    expect(result.probableCauses).toHaveLength(6);
  });
});
```

---

## 📝 TODO

- [ ] Implementacja eksportu danych do CSV
- [ ] Integracja z zewnętrzną bazą kodów DTC
- [ ] Moduł raportowania i statystyk
- [ ] Aplikacja mobilna (React Native)
- [ ] Integracja z systemami płatności
- [ ] Wielojęzyczność (EN, DE)

---

## 🤝 Wkład w projekt

Projekt jest otwarty na współpracę! Jeśli chcesz wnieść swój wkład:

1. Forkuj repozytorium
2. Utwórz branch na swoją funkcjonalność (`git checkout -b feature/AmazingFeature`)
3. Commituj zmiany (`git commit -m 'Add some AmazingFeature'`)
4. Push do brancha (`git push origin feature/AmazingFeature`)
5. Otwórz Pull Request

---

## 📄 Licencja

Projekt jest dostępny na licencji MIT. Zobacz plik `LICENSE` dla szczegółów.

---

## 👨‍💻 Autor

**Michał Nurzyński**

- GitHub: [@bmcodex](https://github.com/bmcodex)
- Email: kontakt@bmcodex.pl

---

## 🙏 Podziękowania

Specjalne podziękowania dla:

- Społeczności BMW za inspirację
- Zespołu Manus za platformę deweloperską
- Wszystkich testerów i użytkowników systemu

---

## 📞 Wsparcie

Jeśli masz pytania lub potrzebujesz pomocy:

- Otwórz [Issue](https://github.com/bmcodex/BMCODEX-SERVICE-SUITE/issues) na GitHubie
- Napisz email: kontakt@bmcodex.pl
- Sprawdź [Wiki](https://github.com/bmcodex/BMCODEX-SERVICE-SUITE/wiki) projektu

---

<div align="center">

**BMCODEX Service Suite™** - Profesjonalne zarządzanie serwisem BMW

Made with ❤️ by Michał Nurzyński

</div>
