const fs = require('fs-extra');

const configFile = `environments/config.${process.argv[2]}.xml`;
fs.pathExists(configFile, (err, exists) => {
  if (exists) {
    fs.copySync(configFile, `config.xml`);
  }
});

const enjinFile = `environments/enjin.${process.argv[2]}.ts`;
fs.pathExists(enjinFile, (err, exists) => {
  if (exists) {
    fs.copySync(enjinFile, `src/global/environment.ts`);
  }
});

const googleServicesFile = `environments/google-services.${
  process.argv[2]
}.json`;
fs.pathExists(googleServicesFile, (err, exists) => {
  if (exists) {
    fs.copySync(googleServicesFile, `google-services.json`);
  }
});

const plistFile = `environments/GoogleService-Info.${process.argv[2]}.plist`;
fs.pathExists(plistFile, (err, exists) => {
  if (exists) {
    fs.copySync(plistFile, `GoogleService-Info.plist`);
  }
});

const indexFile = `environments/index.${process.argv[2]}.html`;
fs.pathExists(indexFile, (err, exists) => {
  if (exists) {
    fs.copySync(indexFile, 'src/index.html');
  }
});

const androidWebHookFile = `environments/android_web_hook.${
  process.argv[2]
}.html`;
fs.pathExists(androidWebHookFile, (err, exists) => {
  if (exists) {
    fs.copySync(
      androidWebHookFile,
      'ul_web_hooks/android/android_web_hook.html'
    );
  }
});
