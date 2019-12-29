const core = require('@actions/core');
const {Firestore} = require('@google-cloud/firestore');

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
            .orderBy("created", "asc")
            .get()
            .then(querySnapshot => {
                let actionRuns = [];
                querySnapshot.forEach(docSnapshot => {
                    const data = docSnapshot.data();
                    actionRuns.push(new ActionRun(data.created.toDate(), data.repository, data.runnerOS, data.usesOptions, data.usesSubdirectory, data.usesBundleInstallPath));
                });

                generateChartImage(actionRuns);
            });
    } catch (error) {
        setFailed(error);
    }
}

function generateChartImage(actionRuns) {
    let processedMonths = new Set();
    let uniqueRepositories = new Set();

    let values = [];

    for (let runIndex = 0; runIndex < actionRuns.length; runIndex++) {
        const actionRun = actionRuns[runIndex];
        let monthName = actionRun.createdAt.toLocaleDateString("en-US", { month: "numeric", year: "numeric" });

        if (runIndex === actionRuns.length - 1) {
            uniqueRepositories.add(actionRun.repository);

            values.push({
                month: monthName,
                count: uniqueRepositories.size
            });
        } else if (processedMonths.length > 0 && !processedMonths.includes(monthName)) {
            values.push({
                month: monthName,
                count: uniqueRepositories.size
            });
        }

        processedMonths.add(monthName);
        uniqueRepositories.add(actionRun.repository);
    }

    const vega = require('vega');
    const fs = require('fs');
    let spec = require(__dirname + '/vega-specs/unique-repositories');

    spec.data[0].values = values;

    const view = new vega.View(vega.parse(spec), {renderer: 'none'});

    fs.mkdirSync("chart-output");

    view.toCanvas()
        .then(function(canvas) {
            canvas.createPNGStream().pipe(fs.createWriteStream('chart-output/unique-repositories.png'));
        })
        .catch(function(err) {
            setFailed(err);
        });

}

function setFailed(error) {
    core.error(error);
    core.setFailed(error.message);
}

run();