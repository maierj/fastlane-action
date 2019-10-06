const core = require('@actions/core');

function run() {
    try {
        const lane = core.getInput('lane', { required: true });

        console.log("Executing lane " + lane + ".")
    } catch (error) {
        core.error(error);
        core.setFailed(error.message);
    }
}

run();