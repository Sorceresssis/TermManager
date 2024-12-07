const nodeFs = require('node:fs');
const nodePath = require('node:path');


const copiedFiles = [
  '.env',
  '.env.development',
  '.env.production',
  '.env.test',
];

const workingDir = nodePath.join(__dirname, '../');

const distPath = nodePath.join(workingDir, 'dist');

function copyToDist() {
  for (const filename of copiedFiles) {
    const filePath = nodePath.join(workingDir, filename);

    if (nodeFs.existsSync(filePath)) {
      nodeFs.copyFileSync(filePath, nodePath.join(distPath, filename));
    }
  }
}


copyToDist();