// Move top image from the body to front matter

var fs = require('fs'),
  path = require('path'),
  matter = require('gray-matter'),
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
  if (file.data.image) {
    console.log('- has image');
    return;
  }
  const m = file.content.match(/^\s*<img[^>]+src="([^"]+)"[^>]*>.*/)
  if (!m || !m[1]) {
    console.log('- no image found');
    return;
  }

  file.data.image = m[1];
  file.content = file.content.replace(m[0], '');
  fs.writeFileSync(filePath, file.stringify(), 'utf-8');
  console.log('- DONE');
});