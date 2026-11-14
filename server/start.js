const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const fs = require('fs');

function copyBundledUploads() {
  const sourceDir = path.resolve(__dirname, '..', 'client', 'public', 'uploads');
  const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, 'uploads');

  if (!fs.existsSync(sourceDir)) {
    return;
  }

  fs.mkdirSync(uploadDir, { recursive: true });
  for (const filename of fs.readdirSync(sourceDir)) {
    const sourcePath = path.join(sourceDir, filename);
    const destinationPath = path.join(uploadDir, filename);
    if (fs.statSync(sourcePath).isFile() && !fs.existsSync(destinationPath)) {
      fs.copyFileSync(sourcePath, destinationPath);
    }
  }
}

async function start() {
  const dataDir = process.env.DATA_DIR || path.join(__dirname, 'data');
  const usersFile = path.join(dataDir, 'users.json');

  if (!fs.existsSync(usersFile)) {
    const { seed } = require('./seed');
    await seed();
  }

  copyBundledUploads();
  require('./index');
}

start().catch(error => {
  console.error('Failed to initialize the application:', error);
  process.exit(1);
});
