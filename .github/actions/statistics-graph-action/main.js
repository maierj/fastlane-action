const core = require('@actions/core');
const {Firestore} = require('@google-cloud/firestore');

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