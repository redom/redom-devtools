const fs = require('fs');
const archiver = require('archiver');

const pkg = require('./package.json');
const distPkg = require('./dist/manifest.json');

if (distPkg.version !== pkg.version) {
  console.log('changing', 'dist/package.json from', distPkg.version, 'to', pkg.version);
  distPkg.version = pkg.version;
  fs.writeFileSync('./dist/manifest.json', JSON.stringify(distPkg, null, 2));
}

console.log('Creating dist.zip');

const zip = fs.createWriteStream('./dist.zip');
const archive = archiver('zip', {
  zlib: { level: 9 }
});

zip.on('close', function () {
  console.log('done!');
});

archive.on('error', function (err) {
  throw err;
});

archive.pipe(zip);

fs.readdir('./dist', (err, files) => {
  if (err) {
    throw err;
  }
  files.forEach(file => {
    if (file[0] === '.') {
      return;
    }
    console.log(file);
    archive.append(fs.createReadStream('./dist/' + file), { name: file });
  });
  archive.finalize();
});
