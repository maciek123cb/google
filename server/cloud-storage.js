const { Storage } = require('@google-cloud/storage');

// Inicjalizacja klienta Cloud Storage
const storage = new Storage();
const bucketName = process.env.CLOUD_STORAGE_BUCKET || 'wiktoriabeuty-uploads';
console.log('Używam bucketa Cloud Storage:', bucketName);
const bucket = storage.bucket(bucketName);

/**
 * Przesyła plik do Cloud Storage
 * @param {Object} file - Obiekt pliku z multer
 * @returns {Promise<string>} - URL do przesłanego pliku
 */
async function uploadFile(file) {
  try {
    const blob = bucket.file(`uploads/metamorphoses/${Date.now()}-${file.originalname}`);
    const blobStream = blob.createWriteStream({
      resumable: false,
      contentType: file.mimetype
    });

    return new Promise((resolve, reject) => {
      blobStream.on('error', (err) => {
        console.error('Błąd przesyłania pliku:', err);
        reject(err);
      });

      blobStream.on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
        resolve(publicUrl);
      });

      blobStream.end(file.buffer);
    });
  } catch (error) {
    console.error('Błąd uploadFile:', error);
    throw error;
  }
}

/**
 * Usuwa plik z Cloud Storage
 * @param {string} fileUrl - URL pliku do usunięcia
 * @returns {Promise<void>}
 */
async function deleteFile(fileUrl) {
  try {
    // Wyciągnij nazwę pliku z URL
    const urlParts = fileUrl.split(`${bucketName}/`);
    if (urlParts.length < 2) {
      console.error('Nieprawidłowy URL pliku:', fileUrl);
      return;
    }
    
    const fileName = urlParts[1];
    await bucket.file(fileName).delete();
    console.log(`Plik ${fileName} został usunięty`);
  } catch (error) {
    console.error('Błąd deleteFile:', error);
    throw error;
  }
}

module.exports = {
  uploadFile,
  deleteFile,
  bucketName
};