// Add excerpt based on the first paragraph

var fs = require('fs'),
  path = require('path'),
  matter = require('gray-matter'),
  removeMd = require('remove-markdown'),
  argv = require('yargs').argv;

var postsDir = argv.postsDir;
var hasError = false;

if (postsDir === undefined || postsDir.length === 0) {
  console.error('ERROR: Specify the path to the Jekyll posts directory using the postsDir argument');
  hasError = true;
}

if (hasError) {
  console.log();
  console.log('Sample usage:');
  console.log('node index.js --postsDir=./_posts');
  process.exit();
}

const postFiles = fs.readdirSync(postsDir);
postFiles.forEach(f => {
  console.log('Processing ' + f + '...');
  const filePath = path.resolve(postsDir, f);
  const postFile = fs.readFileSync(filePath, 'utf-8');
  const file = matter(postFile);
  if (file.data.excerpt && file.data.excerpt.trim().length > 0) {
    console.log('- has excerpt');
    return;
  }

  const firstP = removeMd(file.content.trim().split('\n')[0]);
  file.data.excerpt = firstP;
  fs.writeFileSync(filePath, file.stringify(), 'utf-8');
  console.log('- DONE');
});