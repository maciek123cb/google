#!/usr/bin/env node

// Prosty plik startowy dla aplikacji
console.log('Uruchamianie aplikacji...');

// Ustawienie zmiennych środowiskowych
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.env.PORT = process.env.PORT || '8080';

// Uruchomienie serwera
try {
  require('./server/server.js');
} catch (error) {
  console.error('Błąd podczas uruchamiania serwera:', error);
  process.exit(1);
}