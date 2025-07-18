console.log("Uruchamianie aplikacji...");

// Dodanie obsługi nieobsłużonych wyjątków
process.on('uncaughtException', (error) => {
  console.error('Nieobsłużony wyjątek:', error);
  console.error(error.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Nieobsłużona obietnica rejection:', reason);
  process.exit(1);
});

try {
  console.log("Próba załadowania server.js...");
  require("./server/server.js");
  console.log("Server.js załadowany pomyślnie");
} catch (error) {
  console.error("Błąd podczas ładowania server.js:", error);
  console.error(error.stack);
  process.exit(1);
}