import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const copyFile = (source, target) => {
  fs.copyFileSync(source, target);
  console.log(`Copied ${source} to ${target}`);
};

const sourceDir = path.join(__dirname, 'public');
const targetDir = path.join(__dirname, 'dist', 'public');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

copyFile(
  path.join(sourceDir, 'joystick.html'),
  path.join(targetDir, 'joystick.html')
);
