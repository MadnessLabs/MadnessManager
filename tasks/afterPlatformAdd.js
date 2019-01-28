const { exec } = require('child_process');

module.exports = function(ctx) {
  if (ctx.opts.platforms.indexOf('ios') < 0) {
    return false;
  }

  const path = ctx.requireCordovaModule('path');
  const deferral = ctx.requireCordovaModule('q').defer();

  const platformRoot = path.join(ctx.opts.projectRoot, 'platforms/ios');

  exec(
    'pod install',
    {
      cwd: platformRoot
    },
    function(error, stdout, stderr) {
      if (error) {
        deferral.reject('Failed to install pods...');
      } else {
        console.log(stdout);
        deferral.resolve();
      }
    }
  );

  return deferral.promise;
};
