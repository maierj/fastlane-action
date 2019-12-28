const core = require('@actions/core');
const {Firestore} = require('@google-cloud/firestore');

function run() {
    try {
        const firebaseServiceAccountEmail = core.getInput('firebase-service-account-email', { required: true });
        const firebaseServiceAccountPrivateKey = core.getInput('firebase-service-account-private-key', { required: true });

        const firestore = new Firestore({
            projectId: 'github-fastlane-action',
            credentials: {
                client_email: firebaseServiceAccountEmail,
                private_key: firebaseServiceAccountPrivateKey
            }
        });

        firestore
            .collection('action-runs')
            .listDocuments()
            .then(function(documents) {
                for (let document in documents) {
                    document
                        .get()
                        .then(function(documentSnapshot) {
                            console.log(documentSnapshot.id);
                        })
                }
            })
    } catch (error) {
        setFailed(error);
    }
}

function setFailed(error) {
    core.error(error);
    core.setFailed(error.message);
}

run();