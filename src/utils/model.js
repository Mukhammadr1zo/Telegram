import fs from 'fs';
import path from 'path';

function read(fileName) {
  return JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src', 'db', fileName + '.json'), 'utf-8'));
}

function write(fileName, data) {
  fs.writeFileSync(path.join(process.cwd(), 'src', 'db', fileName + '.json'), JSON.stringify(data, null, 4));
  return true;
}

export {
  read, write
}
