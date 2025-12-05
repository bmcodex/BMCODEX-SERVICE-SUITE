# BMCODEX Service Suite™ - TODO

## Moduł 1: DTC Analyzer Pro
- [ ] Pole do wpisania kodu błędu OBD2/DTC
- [ ] Wyświetlanie listy rzeczy do sprawdzenia (check-lista)
- [ ] Wyświetlanie prawdopodobnych przyczyn z procentami
- [ ] Wyświetlanie prawdopodobnych kosztów naprawy w PLN
- [ ] Wyświetlanie zagrożeń dla pojazdu
- [ ] Wyświetlanie powiązania z tuningiem (Stage 1/2)
- [ ] Automatyczne zapisywanie diagnostyki do historii pojazdu

## Moduł 2: Garage Manager
- [ ] Tworzenie i edycja kartotek pojazdów (VIN, model, rocznik, przebieg, silnik, skrzynia)
- [ ] Historia wizyt (kodowanie, tuning, xHP, diagnostyka, naprawy)
- [ ] Archiwum softów (ECU stock, ECU mod, TCU stock, TCU mod)
- [ ] Przechowywanie logów jazdy
- [ ] Galeria zdjęć i filmów pojazdu
- [ ] Kolorowe statusy projektów (przyjęty, w trakcie, czeka na części, gotowy, zakończony)
- [ ] Automatyczne przypomnienia o przeglądach po tuningu
- [ ] Alerty o powracających błędach
- [ ] Historia wszystkich protokołów
- [ ] Statystyki klienta i pojazdu

## Moduł 3: Booking & Timeline Engine
- [ ] Wybór usługi (kodowanie BMW, chiptuning Stage 1/2, xHP, diagnostyka)
- [ ] Wyświetlanie dostępnych terminów
- [ ] Automatyczne tworzenie profilu klienta (jeśli nowy)
- [ ] Automatyczne tworzenie projektu w Garage Manager
- [ ] Automatyczne tworzenie protokołu przyjęcia
- [ ] Powiadomienia 24h przed wizytą
- [ ] Powiadomienia 2h przed wizytą
- [ ] Powiadomienia po zakończeniu prac
- [ ] Synchronizacja z kalendarzem (Google, iOS, Mac)
- [ ] Timeline dla klienta (wizualizacja postępu)

## Moduł 4: Protocol Pro
- [ ] Protokół przyjęcia - dane auta i klienta
- [ ] Protokół przyjęcia - zdjęcia 360° pojazdu
- [ ] Protokół przyjęcia - zaznaczanie uszkodzeń na sylwetce
- [ ] Protokół przyjęcia - lista uwag i zgód
- [ ] Protokół przyjęcia - podpis klienta
- [ ] Protokół wydania - lista wykonanych prac
- [ ] Protokół wydania - wgrane softy (ECU/TCU stock/mod)
- [ ] Protokół wydania - lista zmian i uwag
- [ ] Protokół wydania - zdjęcia po realizacji
- [ ] Protokół wydania - podpis klienta
- [ ] Generowanie PDF z brandingiem BMCODEX (ciemne tło + #FF4500)
- [ ] Automatyczne zapisywanie protokołów w historii pojazdu

## Integracja między modułami
- [ ] Rezerwacja tworzy projekt + protokół
- [ ] Diagnostyka zapisuje błędy do historii auta
- [ ] Protokół przyjęcia powiązany z klientem i pojazdem
- [ ] Protokół wydania zamyka projekt
- [ ] Garage Manager wyświetla pełną historię
- [ ] Wszystkie moduły pracują na tym samym VIN i ID projektu

## Wymagania ogólne
- [ ] Responsywność (desktop + tablet + telefon)
- [ ] UI w stylu BMW performance (ciemne tło #1A1A1A, akcenty #FF4500)
- [ ] Wszystkie interfejsy w języku polskim
- [ ] Eksport danych (PDF, CSV)
- [ ] Tryb ciemny jako domyślny
- [ ] System autentykacji użytkowników
- [ ] Role użytkowników (admin, user)

## Przechowywanie danych
- [ ] Przechowywanie zdjęć pojazdów w S3
- [ ] Przechowywanie plików softów (ECU/TCU) w S3
- [ ] Przechowywanie logów jazdy w S3
- [ ] Przechowywanie filmów w S3
- [ ] Przechowywanie wygenerowanych PDF w S3

## Testy
- [ ] Testy jednostkowe dla wszystkich procedur tRPC
- [ ] Testy integracyjne między modułami
