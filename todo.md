# BMCODEX Service Suite™ - TODO

## Moduł 1: DTC Analyzer Pro
- [x] Pole do wpisania kodu błędu OBD2/DTC
- [x] Wyświetlanie listy rzeczy do sprawdzenia (check-lista)
- [x] Wyświetlanie prawdopodobnych przyczyn z procentami
- [x] Wyświetlanie prawdopodobnych kosztów naprawy w PLN
- [x] Wyświetlanie zagrożeń dla pojazdu
- [x] Wyświetlanie powiązania z tuningiem (Stage 1/2)
- [x] Automatyczne zapisywanie diagnostyki do historii pojazdu

## Moduł 2: Garage Manager
- [x] Tworzenie i edycja kartotek pojazdów (VIN, model, rocznik, przebieg, silnik, skrzynia)
- [x] Historia wizyt (kodowanie, tuning, xHP, diagnostyka, naprawy)
- [x] Archiwum softów (ECU stock, ECU mod, TCU stock, TCU mod)
- [x] Przechowywanie logów jazdy
- [x] Galeria zdjęć i filmów pojazdu
- [x] Kolorowe statusy projektów (przyjęty, w trakcie, czeka na części, gotowy, zakończony)
- [ ] Automatyczne przypomnienia o przeglądach po tuningu
- [ ] Alerty o powracających błędach
- [x] Historia wszystkich protokołów
- [x] Statystyki klienta i pojazdu

## Moduł 3: Booking & Timeline Engine
- [x] Wybór usługi (kodowanie BMW, chiptuning Stage 1/2, xHP, diagnostyka)
- [x] Wyświetlanie dostępnych terminów
- [x] Automatyczne tworzenie profilu klienta (jeśli nowy)
- [x] Automatyczne tworzenie projektu w Garage Manager
- [x] Automatyczne tworzenie protokołu przyjęcia
- [ ] Powiadomienia 24h przed wizytą
- [ ] Powiadomienia 2h przed wizytą
- [ ] Powiadomienia po zakończeniu prac
- [ ] Synchronizacja z kalendarzem (Google, iOS, Mac)
- [x] Timeline dla klienta (wizualizacja postępu)

## Moduł 4: Protocol Pro
- [x] Protokół przyjęcia - dane auta i klienta
- [ ] Protokół przyjęcia - zdjęcia 360° pojazdu
- [ ] Protokół przyjęcia - zaznaczanie uszkodzeń na sylwetce
- [ ] Protokół przyjęcia - lista uwag i zgód
- [ ] Protokół przyjęcia - podpis klienta
- [x] Protokół wydania - lista wykonanych prac
- [ ] Protokół wydania - wgrane softy (ECU/TCU stock/mod)
- [ ] Protokół wydania - lista zmian i uwag
- [ ] Protokół wydania - zdjęcia po realizacji
- [ ] Protokół wydania - podpis klienta
- [x] Generowanie PDF z brandingiem BMCODEX (ciemne tło + #FF4500)
- [x] Automatyczne zapisywanie protokołów w historii pojazdu

## Integracja między modułami
- [x] Rezerwacja tworzy projekt + protokół
- [x] Diagnostyka zapisuje błędy do historii auta
- [x] Protokół przyjęcia powiązany z klientem i pojazdem
- [x] Protokół wydania zamyka projekt
- [x] Garage Manager wyświetla pełną historię
- [x] Wszystkie moduły pracują na tym samym VIN i ID projektu

## Wymagania ogólne
- [x] Responsywność (desktop + tablet + telefon)
- [x] UI w stylu BMW performance (ciemne tło #1A1A1A, akcenty #FF4500)
- [x] Wszystkie interfejsy w języku polskim
- [ ] Eksport danych (PDF, CSV)
- [x] Tryb ciemny jako domyślny
- [x] System autentykacji użytkowników
- [x] Role użytkowników (admin, user)

## Przechowywanie danych
- [x] Przechowywanie zdjęć pojazdów w S3
- [x] Przechowywanie plików softów (ECU/TCU) w S3
- [x] Przechowywanie logów jazdy w S3
- [x] Przechowywanie filmów w S3
- [x] Przechowywanie wygenerowanych PDF w S3

## Testy
- [ ] Testy jednostkowe dla wszystkich procedur tRPC
- [ ] Testy integracyjne między modułami

## Nowe funkcjonalności - System powiadomień
- [x] Konfiguracja SendGrid dla email
- [x] Konfiguracja Twilio dla SMS
- [x] Automatyczne powiadomienia email 24h przed wizytą
- [x] Automatyczne powiadomienia email 2h przed wizytą
- [x] Automatyczne powiadomienia email po zakończeniu prac
- [x] Powiadomienia SMS dla pilnych alertów
- [ ] Panel konfiguracji powiadomień w ustawieniach

## Nowe funkcjonalności - Protocol Pro Enhancement
- [x] Upload zdjęć 360° pojazdu (przód, tył, lewo, prawo, wnętrze)
- [x] Galeria zdjęć w protokole z podglądem
- [x] Interaktywna sylwetka pojazdu (widok z góry)
- [x] Klikalne zaznaczanie uszkodzeń na sylwetce
- [x] Opis każdego uszkodzenia (rysa, wgniecenie, zarysowanie)
- [x] Canvas do podpisu cyfrowego klienta
- [x] Zapis podpisu jako obraz PNG
- [ ] Wyświetlanie podpisu w wygenerowanym PDF

## Bugfix - OAuth callback
- [x] Naprawić błąd "OAuth callback failed" przy logowaniu (dodano szczegółowe logowanie i user-friendly error page)
- [x] Sprawdzić konfigurację OAuth redirect URL
- [x] Przetestować proces logowania na urządzeniach mobilnych

## Bugfix - DTC Analyzer
- [x] Naprawić pusty wybór pojazdu w DTC Analyzer
- [x] Dodać przykładowe pojazdy testowe do bazy danych
- [ ] Dodać przycisk "Dodaj pojazd" w DTC Analyzer dla szybkiego dodawania

## Bugfix - Brak panelu klientów
- [x] Utworzyć stronę zarządzania klientami (/clients)
- [x] Dodać formularz tworzenia nowego klienta
- [x] Dodać listę wszystkich klientów z możliwością edycji
- [x] Dodać link do panelu klientów w nawigacji

## Nowe funkcjonalności - Zarządzanie klientami v2
- [x] Strona szczegółów klienta (/client/:id)
- [x] Wyświetlanie pełnej historii wizyt klienta
- [x] Lista wszystkich pojazdów klienta
- [x] Możliwość edycji danych klienta
- [x] Przegląd wszystkich protokołów klienta
- [x] Przegląd wszystkich projektów klienta
- [x] Statystyki klienta (liczba wizyt, wydatki)

## Nowe funkcjonalności - DTC Analyzer v2
- [x] Przycisk "+ Nowy pojazd" w formularzu DTC Analyzer
- [x] Dialog szybkiego dodawania pojazdu
- [x] Automatyczne odświeżanie listy pojazdów po dodaniu

## Nowe funkcjonalności - Wyszukiwanie i filtrowanie
- [x] Pasek wyszukiwania w panelu klientów
- [x] Wyszukiwanie po nazwie klienta
- [x] Wyszukiwanie po emailu
- [x] Wyszukiwanie po numerze telefonu
- [ ] Filtrowanie w Garage Manager po marce
- [ ] Filtrowanie w Garage Manager po modelu
- [ ] Filtrowanie w Garage Manager po roku
- [ ] Filtrowanie w Garage Manager po statusie projektu
