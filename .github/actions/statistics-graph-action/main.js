const core = require('@actions/core');
const {google} = require('googleapis');

const USER = "github.fastlane.action@gmail.com";

function listMessages(apiKey) {
    console.log("List messages");
    const gmail = google.gmail({
        version: "v1",
        auth: apiKey,
        labelIds: ["SENT"]
    });

    gmail.users.messages.list({
        userId: USER
    }).then(function(result) {
        console.log(result);
    }).catch(function(error) {
        console.log("Failed to list messages: " + error);
    });
}

function run() {
    try {
        const gmailApiKey = core.getInput('gmail-api-key', { required: true });

        listMessages(gmailApiKey);
    } catch (error) {
        setFailed(error);
    }
}

function setFailed(error) {
    core.error(error);
    core.setFailed(error.message);
}

run();