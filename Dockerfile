FROM node:20

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

# Kopiowanie pliku .env.cloud do .env w katalogu server
RUN cp .env.cloud server/.env

# Plik server-start.js jest już w repozytorium

# Uruchomienie aplikacji
CMD ["node", "server-start.js"]