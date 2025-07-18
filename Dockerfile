FROM node:16

WORKDIR /app

# Kopiowanie plików package.json i package-lock.json
COPY package*.json ./
COPY server/package*.json ./server/

# Instalacja zależności głównej aplikacji
RUN npm install

# Instalacja zależności serwera
WORKDIR /app/server
RUN npm install
WORKDIR /app

# Kopiowanie reszty kodu aplikacji
COPY . .

# Budowanie aplikacji
RUN npm run build

# Ekspozycja portu (domyślnie 8080 dla Cloud Run)
EXPOSE 8080

# Ustawienie zmiennych środowiskowych
ENV NODE_ENV=production
ENV PORT=8080
ENV DB_HOST="/cloudsql/serene-notch-466304-d8:europe-central2:beauty-salon-db"
ENV DB_USER="root"
ENV DB_PASSWORD="Adamkopec123"
ENV DB_NAME="beauty_salon"
ENV JWT_SECRET="Adamkopec123"
ENV CLOUD_STORAGE_BUCKET="serene-notch-466304-d8.appspot.com"

# Dodanie skryptu startowego
RUN echo '#!/bin/sh\nnode server/server.js' > start.sh && chmod +x start.sh

# Uruchomienie aplikacji
CMD ["/app/start.sh"]