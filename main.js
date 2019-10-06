const core = require('@actions/core');
const shell = require('shelljs');

function run() {
    try {
        const lane = core.getInput('lane', { required: true });

        console.log(`Executing lane ${lane}.`);

        if (shell.exec(`fastlane ${lane}`).code !== 0) {
            core.setFailed(`Executing lane ${lane} failed.`);
        }
    } catch (error) {
        core.error(error);
        core.setFailed(error.message);
    }
}

run();