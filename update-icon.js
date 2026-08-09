const fs = require('fs');
const path = require('path');

const srcIcon = path.join(__dirname, 'public', 'icon.png');
const targetFavicon = path.join(__dirname, 'src', 'app', 'favicon.ico');
const targetAppIcon = path.join(__dirname, 'src', 'app', 'icon.png');

try {
  if (fs.existsSync(srcIcon)) {
    fs.copyFileSync(srcIcon, targetFavicon);
    fs.copyFileSync(srcIcon, targetAppIcon);
    console.log('Copied public/icon.png to src/app/favicon.ico and src/app/icon.png');
  }
} catch (err) {
  console.error('Error copying icon:', err);
}
