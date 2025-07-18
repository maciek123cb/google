const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Serwowanie statycznych plików z katalogu dist
app.use(express.static(path.join(__dirname, '..', 'dist')));

// Prosta trasa API dla testów
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Serwer działa poprawnie' });
});

// Obsługa wszystkich innych tras - przekierowanie do React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

// Uruchomienie serwera
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serwer uruchomiony na porcie ${PORT}`);
});