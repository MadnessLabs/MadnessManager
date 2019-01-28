const package = require(process.cwd() + '/package.json');
const { exec } = require('child_process');

console.log('Building android release...');
exec(`cordova build --release android`, (err, stdout, stderr) => {
  console.log('Signing the release with keystore...');
  exec(
    `jarsigner -storepass 100%Luck7 -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ./certs/android/my-release-key.keystore ./platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk alias_name`,
    (err, stdout, stderr) => {
      console.log(`Packaging release v${package.version}...`);
      exec(
        `zipalign -v 4 ./platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk ./releases/ReferAFlood-v${
          package.version
        }.apk`,
        (err, stdout, stderr) => {
          console.log('Finished creating release build for Android!');
        }
      );
    }
  );
});
