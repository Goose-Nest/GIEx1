const { copyFileSync, mkdirSync, rmSync } = require('fs');
const { join } = require('path');

const nativeUpdaterModule = require('./updater');

const log = (...args) => console.log(`[GIEx1]`, ...args);

log('got required');

log('nativeUpdaterModule', nativeUpdaterModule);

class Updater extends nativeUpdaterModule.Updater {
  /*
    Options: {
      release_channel: 'stable' | 'ptb' | 'canary' | 'development',
      platform: 'osx' | 'win' | 'linux',
      repository_url: 'https://discord.com/api/updates/' | '<custom>',
      root_path: '<discord root dir, above app-X.Y.Z dirs>',
      response_handler: discord's js func
    }
  */

  constructor(options) {
    log('constructor', options);
    
    log(`setting repo url to gooseupdate w/ goosemod - original was (${options.repository_url})`);
    options.repository_url = `https://updates.goosemod.com/goosemod/`;

    const originalHandler = options.response_handler;

    options.response_handler = (response) => {
      // console.log('response hook', response);

      const [_id, detail] = JSON.parse(response);

      // console.log(detail);

      if (detail['TaskProgress'] != null) {
        const TaskProgress = detail['TaskProgress'];

        if (TaskProgress[0].HostInstall && TaskProgress[1] === 'Complete') { // A host update has been installed, install this hook into it
          log('!!! detected host update install complete, rehooking');

          // __dirname is like: %LocalAppData%\discord<suffix>\app-X.Y.Z\updater
          const newAppDir = join(__dirname, '..', '..', `app-${TaskProgress[0].HostInstall.version.version.join('.')}`);
          const injectBase = join(newAppDir, 'updater');

          log('newAppDir', newAppDir);
          log('injectBase', injectBase)

          log('making new inject base dir...');

          mkdirSync(injectBase); // Make inject base dir

          log('copying this file...');
          
          copyFileSync(join(__dirname, 'index.js'), join(injectBase, 'index.js')); // Copy this file

          log('moving new native module into inject base...');

          copyFileSync(join(newAppDir, 'updater.node'), join(injectBase, 'updater.node')); // Move new native module from app base to inject base
          rmSync(join(newAppDir, 'updater.node'));

          log('rehooked!');
        }
      }

      return originalHandler(response);
    }

    super(options);
  }
}

module.exports = {
  Updater
};