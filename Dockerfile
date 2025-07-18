FROM node:16

WORKDIR /app

# Kopiowanie plików package.json i package-lock.json
COPY package*.json ./

# Instalacja zależności
RUN npm install

# Kopiowanie reszty kodu aplikacji
COPY . .

# Budowanie aplikacji
RUN npm run build

# Konfiguracja dla App Engine
COPY app.yaml .

# Ekspozycja portu (domyślnie 8080 dla App Engine/Cloud Run)
EXPOSE 8080

# Ustawienie zmiennych środowiskowych
ENV NODE_ENV=production
ENV PORT=8080

# Uruchomienie aplikacji
CMD ["node", "server/server.js"]