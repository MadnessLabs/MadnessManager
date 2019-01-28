const fs = require('fs-extra');
const package = require(process.cwd() + '/package.json');
const { exec } = require('child_process');
const xml2js = require('xml2js');

const environmentsDir = 'environments';
const type = process.argv[2];

if (!type) {
  console.log(`${package.name} - v${package.version}`);
  return false;
}

if (type !== 'minor' && type !== 'patch') {
  console.error(`Version must be either minor or patch!`);
  return false;
}

function zeroPad(num, places) {
  num = parseInt(num);
  var zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join('0') + num;
}

exec(`npm version ${type} --git-tag-version=false`, (err, stdout, stderr) => {
  if (err) {
    console.error(err.message);
    return false;
  }

  const versionNumber = stdout.substring(1);
  const [major, minor, patch] = versionNumber.split('.');
  const version = `${parseInt(major)}.${parseInt(minor)}.${parseInt(patch)}`;
  const versionCode = `040${zeroPad(major, 2)}${zeroPad(minor, 2)}${zeroPad(
    patch,
    2
  )}`;

  console.log(`Updated version in package.json...`);

  function editConfig(filePath) {
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        console.log(err.message);
        return false;
      }

      xml2js.parseString(data, (err, json) => {
        if (err) {
          console.log(err);
          return false;
        }

        json.widget.$.version = version;
        json.widget.$['android-versionCode'] = versionCode;

        const builder = new xml2js.Builder();
        const xml = builder.buildObject(json);

        fs.writeFile(filePath, xml, (err, data) => {
          if (err) {
            console.log(err.message);
            return false;
          }

          console.log(`Updated version and code in ${filePath}...`);
        });
      });
    });
  }

  function editEnv(filePath) {
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        console.log(err.message);
        return false;
      }

      data = data.replace(
        /version: ?['"]([0-9.]{1,})["']/g,
        `version: '${version}'`
      );

      fs.writeFile(filePath, data, (err, data) => {
        if (err) console.log(err);

        console.log(`Updated version in ${filePath}...`);
      });
    });
  }

  fs.readdirSync(environmentsDir).forEach(file => {
    const filePath = `${environmentsDir}/${file}`;
    if (file.indexOf('.xml') >= 0) {
      editConfig(filePath);
    } else if (file.indexOf('enjin') >= 0) {
      editEnv(filePath);
    }
  });
});
