const fs = require('fs').promises;
const path = require('path');

const dbPath = path.join(__dirname, 'db.json');

async function readData() {
  try {
    const data = await fs.readFile(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // db.json이 없으면 초기 상태를 반환
      return { todos: [], settings: { theme: 'light' } };
    }
    throw error;
  }
}

async function writeData(data) {
  const tempPath = dbPath + '.tmp';
  try {
    await fs.writeFile(tempPath, JSON.stringify(data, null, 2), 'utf8');
    await fs.rename(tempPath, dbPath);
  } catch (error) {
    console.error('Error writing data:', error);
    // 임시 파일이 남아있으면 삭제
    try {
      await fs.unlink(tempPath);
    } catch (unlinkError) {
      // 임시 파일 삭제 실패는 무시
    }
    throw error;
  }
}

async function migrateData() {
  console.log('Checking data version for migration...');
  let data = await readData();

  if (!data.hasOwnProperty('version')) {
    console.log('Data is version 0. Migrating to version 1...');
    data.version = 1;
    await writeData(data);
    console.log('Migration to version 1 complete.');
  } else {
    console.log(`Data is already version ${data.version} or newer. No migration needed.`);
  }
}

module.exports = { readData, writeData, migrateData };
