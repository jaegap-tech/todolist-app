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

module.exports = { readData, writeData };
