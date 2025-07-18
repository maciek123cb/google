// Moduł do obsługi Google Cloud Storage
const { Storage } = require('@google-cloud/storage');
const path = require('path');
const os = require('os');
const fs = require('fs');

// Inicjalizacja Cloud Storage
const storage = new Storage();
const bucketName = process.env.CLOUD_STORAGE_BUCKET || 'beauty-salon-uploads';

// Funkcja do przesyłania pliku do Cloud Storage
async function uploadFile(file) {
  try {
    // Sprawdź czy bucket istnieje, jeśli nie - utwórz go
    try {
      await storage.bucket(bucketName).get();
    } catch (error) {
      if (error.code === 404) {
        await storage.createBucket(bucketName, {
          location: 'europe-west3',
          storageClass: 'STANDARD'
        });
        console.log(`Bucket ${bucketName} został utworzony.`);
      } else {
        throw error;
      }
    }

    const bucket = storage.bucket(bucketName);
    const fileName = `metamorphoses/${Date.now()}-${file.originalname}`;
    const blob = bucket.file(fileName);
    
    // Utwórz strumień zapisu
    const blobStream = blob.createWriteStream({
      resumable: false,
      contentType: file.mimetype
    });
    
    // Obsługa błędów i zakończenia przesyłania
    return new Promise((resolve, reject) => {
      blobStream.on('error', (error) => {
        reject(error);
      });
      
      blobStream.on('finish', () => {
        // Ustaw plik jako publicznie dostępny
        blob.makePublic().then(() => {
          const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
          resolve(publicUrl);
        }).catch(reject);
      });
      
      // Przesyłanie pliku
      blobStream.end(file.buffer);
    });
  } catch (error) {
    console.error('Błąd przesyłania pliku do Cloud Storage:', error);
    throw error;
  }
}

// Funkcja do usuwania pliku z Cloud Storage
async function deleteFile(fileUrl) {
  try {
    if (!fileUrl || !fileUrl.includes('storage.googleapis.com')) {
      console.warn('Nieprawidłowy URL pliku:', fileUrl);
      return;
    }
    
    // Wyodrębnij nazwę pliku z URL
    const urlParts = fileUrl.split('/');
    const fileName = urlParts.slice(4).join('/'); // Pomijamy 'https://storage.googleapis.com/bucket-name/'
    
    await storage.bucket(bucketName).file(fileName).delete();
    console.log(`Plik ${fileName} został usunięty.`);
  } catch (error) {
    console.error('Błąd usuwania pliku z Cloud Storage:', error);
    throw error;
  }
}

module.exports = {
  uploadFile,
  deleteFile,
  bucketName
};