// const { exec } = require('child_process');

// module.exports = function(ctx) {
//   if (ctx.opts.platforms.indexOf('ios') < 0) {
//     return false;
//   }

//   const path = ctx.requireCordovaModule('path');
//   const deferral = ctx.requireCordovaModule('q').defer();

//   exec(
//     'npm run env -- applive',
//     {
//       cwd: ctx.opts.projectRoot
//     },
//     function(error, stdout, stderr) {
//       if (error) {
//         deferral.reject('Setting up environment...');
//       } else {
//         console.log(stdout);
//         deferral.resolve();
//       }
//     }
//   );

//   return deferral.promise;
// };
