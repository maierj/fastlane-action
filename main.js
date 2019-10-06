const core = require('@actions/core');
const shell = require('shelljs');
const fs = require('fs');

function run() {
    try {
        const lane = core.getInput('lane', { required: true });
        const subdirectory = core.getInput('subdirectory', { required: false });

        console.log(`Executing lane ${lane}.`);

        if (subdirectory) {
            if (subdirectory.startsWith("/")) {
                setFailed(new Error("Specified subdirectory path is not relative."));
            }

            if (fs.existsSync(`${process.cwd()}/${subdirectory}`)) {
                console.log(`Moving to subdirectory ${subdirectory}`);
                shell.cd(subdirectory);
            } else {
                setFailed(new Error(`Specified subdirectory ${subdirectory} does not exist.`));
            }
        }

        if (shell.exec(`fastlane ${lane}`).code !== 0) {
            setFailed(new Error(`Executing lane ${lane} failed.`));
        }
    } catch (error) {
        core.error(error);
        core.setFailed(error.message);
    }
}

function setFailed(error) {
    core.error(error);
    core.setFailed(error.message);
}

run();