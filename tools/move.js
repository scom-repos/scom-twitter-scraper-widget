const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '..', 'src', 'lib');
const targetDir = path.join(__dirname, '..', 'lib', 'lib');

function moveFiles(sourceDir, targetDir) {
  try {
    // Create the target directory if it doesn't exist
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Get a list of all JavaScript files in the source directory
    const files = fs.readdirSync(sourceDir).filter((file) => path.extname(file) === '.js');

    // Move each file to the target directory
    files.forEach((file) => {
      const sourceFile = path.join(sourceDir, file);
      const targetFile = path.join(targetDir, file);
      fs.renameSync(sourceFile, targetFile);
    });

  } catch (error) {
    console.error('Error moving files:', error);
  }
}

moveFiles(sourceDir, targetDir);