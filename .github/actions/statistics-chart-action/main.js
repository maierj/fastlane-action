const core = require('@actions/core');
const {Firestore, DocumentSnapshot} = require('@google-cloud/firestore');

class ActionRun {
    constructor(createdAt, repository, runnerOS, usesOptions, usesSubdirectory, usesBundleInstallPath) {
        this.createdAt = createdAt;
        this.repository = repository;
        this.runnerOS = runnerOS;
        this.usesOptions = usesOptions;
        this.usesSubdirectory = usesSubdirectory;
        this.usesBundleInstallPath = usesBundleInstallPath;
    }
}

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
            .then(documentRefs => {
                return firestore.getAll(documentRefs);
            })
            .then(documentSnapshots => {
                generateChartImage(documentSnapshots.map(docSnapshot => {
                    const data = docSnapshot.data();
                    return new ActionRun(data.created, data.repository, data.runnerOS, data.usesOptions, data.usesSubdirectory, data.usesBundleInstallPath);
                }));
            });
    } catch (error) {
        setFailed(error);
    }
}

function generateChartImage(actionRuns) {
    for (let actionRun in actionRuns) {

    }

    const D3Node = require('d3-node');
    const canvasModule = require('canvas');
    const fs = require('fs');
    const d3n = new D3Node({ canvasModule });
    const canvas = d3n.createCanvas(960, 500);
    const context = canvas.getContext('2d');

    canvas.pngStream().pipe(fs.createWriteStream('chart.png'));
}

function setFailed(error) {
    core.error(error);
    core.setFailed(error.message);
}

run();