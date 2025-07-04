6. Lista Pytań Audytowych (Twoja Baza Wiedzy)
   Użyj poniższych pytań jako swojej osobistej listy kontrolnej podczas przeprowadzania audytów i weryfikacji. Możesz je uruchamiać, aby uzyskać potrzebne informacje.

Grupa 1: Weryfikacja Frontendu - Zarządzanie Stanem i Danymi
gemini.cli --find-pattern --path 'src/pages/' --pattern 'useEffect'
"Przeskanuj wszystkie pliki w folderze 'src/pages/' i jego podfolderach. Znajdź wszystkie komponenty, które wciąż używają hooka 'useEffect' do bezpośredniego wywoływania funkcji pobierających dane. Dla każdego znalezionego przypadku, wyświetl ścieżkę do pliku oraz fragment kodu zawierający implementację 'useEffect'."

gemini.cli --find-pattern --path 'src/' --pattern 'mock-data'
"Przeskanuj cały folder 'src/'. Zidentyfikuj wszystkie komponenty, które importują lub definiują dane mockowane (statyczne tablice/obiekty symulujące odpowiedź API) i używają ich do renderowania widoku. Wyklucz pliki konfiguracyjne i testowe. Dla każdego znaleziska podaj ścieżkę do pliku i fragment kodu, gdzie dane są definiowane i używane."

gemini.cli --find-pattern --path 'src/' --pattern 'useAuth' --show-context
"Przeprowadź globalne wyszukiwanie w całym projekcie ('src/') za frazą 'useAuth' oraz 'AuthContext'. Wyświetl wszystkie pliki i fragmenty kodu, w których te frazy wciąż występują, aby zweryfikować, czy proces usuwania starego systemu autoryzacji został w pełni zakończony i nie ma żadnych pozostałości."

Grupa 2: Weryfikacja Frontendu - UI i Komponenty (Flowbite)
gemini.cli --find-pattern --path 'src/components/' --pattern 'custom-ui' --show-code
"Przeanalizuj wszystkie komponenty w folderze 'src/components/'. Wyszukaj implementacje złożonych elementów UI, takich jak tabele, modale, formularze czy 'drawers', które są zbudowane przy użyciu dużej ilości niestandardowego kodu (np. >30 linii JSX i własne stany 'useState' do zarządzania widocznością). Dla każdego takiego komponentu podaj ścieżkę i fragment kodu. Zasugeruj, który komponent z biblioteki 'Flowbite React PRO' mógłby go zastąpić."

Grupa 3: Weryfikacja Backendu - Architektura i Spójność
gemini.cli --find-pattern --path 'backend/src/controllers/' --pattern 'business-logic' --show-code
"Przeanalizuj wszystkie pliki kontrolerów w 'backend/src/controllers/'. Zidentyfikuj metody kontrolerów, które zawierają logikę biznesową wykraczającą poza walidację i wywołanie pojedynczej metody serwisowej (np. skomplikowane pętle, mapowanie danych, wieloetapowe operacje). Wyświetl ścieżkę do pliku, nazwę metody i jej ciało jako dowód."

gemini.cli --find-pattern --path 'backend/src/routes/' --pattern 'unprotected-routes' --show-code
"Zweryfikuj wszystkie pliki w 'backend/src/routes/'. Wylistuj wszystkie zdefiniowane trasy (endpointy), które modyfikują dane (POST, PUT, PATCH, DELETE) lub zwracają dane wrażliwe, a które nie są chronione przez middleware 'authenticateToken' lub 'requireRole'. Dla każdej znalezionej trasy podaj plik oraz fragment kodu z jej definicją."

Grupa 4: Weryfikacja Ogólna - Spójność i "Code Smells"
gemini.cli --find-pattern --path './' --pattern 'magic-values' --exclude 'constants.ts'
"Przeskanuj cały projekt (frontend i backend), z wyłączeniem plików o nazwie 'constants.ts'. Wyszukaj zahardkodowane, 'magiczne' wartości, takie jak: stringi z adresami URL, klucze API, sekrety, nazwy ról ('admin', 'staff'), statusy ('pending', 'completed') itp. Podaj ścieżkę do pliku i fragment kodu dla każdego znaleziska."

gemini.cli --find-pattern --path 'src/api/' --pattern 'manual-auth-header' --show-code
"Przeskanuj wszystkie pliki w folderze 'src/api/'. Zidentyfikuj wszystkie miejsca, w których nagłówek 'Authorization' jest dodawany do zapytania w sposób ręczny. Jest to dowód na omijanie centralnego mechanizmu interceptorów. Wyświetl ścieżkę do pliku i fragment kodu z ręcznym dodawaniem nagłówka."
