# Wdrażanie aplikacji na Google Cloud

## Wymagania wstępne

1. Konto Google Cloud Platform (GCP)
2. Zainstalowany i skonfigurowany Google Cloud SDK (gcloud CLI)
3. Utworzony projekt w Google Cloud Platform

## Konfiguracja bazy danych Cloud SQL

1. Utwórz instancję MySQL w Cloud SQL:
   ```
   gcloud sql instances create beauty-salon-db \
     --database-version=MYSQL_8_0 \
     --tier=db-f1-micro \
     --region=europe-west3 \
     --root-password=TWOJE_HASLO
   ```

2. Utwórz bazę danych:
   ```
   gcloud sql databases create beauty_salon --instance=beauty-salon-db
   ```

3. Pobierz nazwę połączenia instancji:
   ```
   gcloud sql instances describe beauty-salon-db --format='value(connectionName)'
   ```

## Konfiguracja pliku app.yaml

1. Otwórz plik `app.yaml` i zaktualizuj następujące wartości:
   - `YOUR_INSTANCE_CONNECTION_NAME`: Wklej nazwę połączenia instancji z poprzedniego kroku
   - `YOUR_DB_PASSWORD`: Ustaw hasło do bazy danych
   - `YOUR_SECRET_KEY`: Ustaw bezpieczny klucz JWT

## Wdrażanie aplikacji

1. Zbuduj aplikację i wdróż ją na Google App Engine:
   ```
   npm run deploy
   ```

   Lub wykonaj te kroki ręcznie:
   ```
   npm run build
   gcloud app deploy
   ```

2. Po zakończeniu wdrażania, aplikacja będzie dostępna pod adresem:
   ```
   https://[YOUR-PROJECT-ID].appspot.com
   ```

## Rozwiązywanie problemów

1. Sprawdź logi aplikacji:
   ```
   gcloud app logs tail
   ```

2. Sprawdź status wdrożenia:
   ```
   gcloud app versions list
   ```

3. Jeśli masz problemy z połączeniem do bazy danych, upewnij się, że:
   - Instancja Cloud SQL jest uruchomiona
   - Nazwa połączenia instancji jest poprawna w pliku app.yaml
   - Hasło do bazy danych jest poprawne
   - API Cloud SQL Admin jest włączone w projekcie

## Zarządzanie plikami przesyłanymi przez użytkowników

W środowisku Google Cloud, pliki przesyłane przez użytkowników (np. zdjęcia metamorfoz) powinny być przechowywane w Cloud Storage zamiast lokalnego systemu plików. Aby to zaimplementować, należy zmodyfikować kod odpowiedzialny za przesyłanie plików.