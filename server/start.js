const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const fs = require('fs');

async function start() {
  const dataDir = process.env.DATA_DIR || path.join(__dirname, 'data');
  const usersFile = path.join(dataDir, 'users.json');

  if (!fs.existsSync(usersFile)) {
    const { seed } = require('./seed');
    await seed();
  }

  require('./index');
}

start().catch(error => {
  console.error('Failed to initialize the application:', error);
  process.exit(1);
});
