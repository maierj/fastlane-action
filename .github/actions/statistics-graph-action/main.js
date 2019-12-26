const core = require('@actions/core');
const {google} = require('googleapis');

const USER = "github.fastlane.action@gmail.com";

function listMessages(client) {
    console.log("List messages");
    const gmail = google.gmail({
        version: "v1",
        auth: client,
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

        const client = new google.auth.JWT();
        client.fromAPIKey(gmailApiKey);

        listMessages(client);
    } catch (error) {
        setFailed(error);
    }
}

function setFailed(error) {
    core.error(error);
    core.setFailed(error.message);
}

run();