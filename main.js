const core = require('@actions/core');
const shell = require('shelljs');

function run() {
    try {
        const lane = core.getInput('lane', { required: true });

        console.log(`Executing lane ${lane}.`);

        shell.exec('echo $PWD');
        shell.ls().forEach(function (file) {
            console.log(file);
        });
    } catch (error) {
        core.error(error);
        core.setFailed(error.message);
    }
}

run();