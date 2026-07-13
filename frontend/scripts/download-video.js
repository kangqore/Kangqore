const https = require('https');
const fs = require('fs');
const path = require('path');

const fileId = '1JEIakdEzkD1uTTFEhe5GQf03A3uPxNrZ';
const dest = path.join(__dirname, '../public/videos/hero-bg.mp4');

// Ensure directory exists
const dir = path.dirname(dest);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

if (fs.existsSync(dest)) {
  // Check if file is valid (not the tiny HTML file) by verifying it's > 10MB
  const stats = fs.statSync(dest);
  if (stats.size > 10 * 1024 * 1024) {
    console.log('Homepage background video already exists and is valid. Skipping download.');
    process.exit(0);
  } else {
    console.log('Found invalid or corrupted video file. Re-downloading...');
    fs.unlinkSync(dest);
  }
}

function downloadFile(id, destination) {
  const url = `https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=t`;
  
  console.log(`Downloading homepage background video from Google Drive to local assets...`);
  const file = fs.createWriteStream(destination);
  
  function getRequest(targetUrl) {
    https.get(targetUrl, (response) => {
      // Handle redirects
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        getRequest(response.headers.location);
        return;
      }
      
      if (response.statusCode !== 200) {
        console.error(`Failed to download file: Status Code ${response.statusCode}`);
        process.exit(1);
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log('Video download completed successfully.');
        process.exit(0);
      });
    }).on('error', (err) => {
      fs.unlink(destination, () => {});
      console.error(`Error downloading video: ${err.message}`);
      process.exit(1);
    });
  }

  getRequest(url);
}

downloadFile(fileId, dest);
