const core = require('@actions/core');
const shell = require('shelljs');

function run() {
    try {
        const lane = core.getInput('lane', { required: true });

        console.log(`Executing lane ${lane}.`);

        shell.exec(`fastlane ${lane}`);
    } catch (error) {
        core.error(error);
        core.setFailed(error.message);
    }
}

run();