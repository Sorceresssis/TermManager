const nodeFs = require('node:fs');
const nodePath = require('node:path');


const tagExplanationDir = String.raw``;

// const reg = /\s*<!-- version="[\s\S]*?编辑文档\s*<\/a>\s*<\/div>\s*<\/div>\s*<\/div>/;


nodeFs.readdir(tagExplanationDir, (err, files) => {
  if (err) throw err;

  files.forEach(file => {
    const filePath = nodePath.join(tagExplanationDir, file);
    nodeFs.stat(filePath, (err, stats) => {
      if (err) throw err;
      if (stats.isDirectory()) return;
      const fileBasename = nodePath.basename(file, '.md');

      nodeFs.readFile(filePath, 'utf8', (err, data) => {
        if (err) throw err;

        // nodeFs.writeFile(filePath, '', 'utf8', err => {
        //   if (err) throw err;
        //   console.log('File updated:', fileBasename);
        // });

      });
    });
  });

});
