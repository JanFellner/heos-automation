const fs = require('fs');
const path = require('path');

function deleteESLintCache(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.lstatSync(fullPath).isDirectory()) {
      deleteESLintCache(fullPath);
    } else if (file === '.eslintcache') {
      fs.unlinkSync(fullPath);
      console.log(`Deleted: ${fullPath}`);
    }
  });
}

// Start from the current directory
deleteESLintCache(process.cwd());