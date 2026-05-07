const https = require('https');
const fs = require('fs');

const options = {
  hostname: 'bankofindia.bank.in',
  path: '/o/boi-global-theme/images/boi/logos/boi_en_US_logo.png',
  method: 'GET',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Connection': 'keep-alive',
  }
};

const req = https.request(options, (res) => {
  if (res.statusCode === 200) {
    const file = fs.createWriteStream('frontend/public/assets/logos/bank-of-india.png');
    res.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log('Download Completed');
    });
  } else {
    console.log(`Failed: ${res.statusCode}`);
  }
});

req.on('error', (e) => {
  console.error(`Problem: ${e.message}`);
});
req.end();
