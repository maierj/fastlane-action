const core = require('@actions/core');
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
const USER = "github.fastlane.action@gmail.com";

function authorize(serviceAccountCredentials, callback) {
    const client = new google.auth.JWT(
        serviceAccountCredentials.client_email,
        null,
        serviceAccountCredentials.private_key,
        SCOPES,
        USER
    );

    client.authorize()
        .then(function(token) {
            client.setCredentials(token);
            callback(client)
        }).catch(function(error) {
            console.log("Failed to authorize: " + error);
        });
}

function listMessages(client) {
    console.log("List messages");
    const gmail = google.gmail({
        version: "v1",
        auth: client
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
        const serviceAccountCredentialData = core.getInput('service-account-credentials', { required: true });
        const serviceAccountCredentials = JSON.parse(serviceAccountCredentialData);

        authorize(serviceAccountCredentials, function(client) {
            listMessages(client);
        });
    } catch (error) {
        setFailed(error);
    }
}

function setFailed(error) {
    core.error(error);
    core.setFailed(error.message);
}

run();