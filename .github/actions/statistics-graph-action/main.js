const core = require('@actions/core');

function run() {
    try {
        console.log("test");
    } catch (error) {
        setFailed(error);
    }
}

function setFailed(error) {
    core.error(error);
    core.setFailed(error.message);
}

run();