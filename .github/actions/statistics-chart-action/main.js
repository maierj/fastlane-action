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

    let runCountForMonth = 0;

    let uniqueRepositoriesValues = [];
    let totalRunsValues = [];

    console.log(`Iterating through all ${actionRuns.length} action runs.`);
    for (let runIndex = 0; runIndex < actionRuns.length; runIndex++) {
        console.log(`Reading action run ${runIndex}.`);
        runCountForMonth += 1;

        const actionRun = actionRuns[runIndex];
        let monthName = actionRun.createdAt.toLocaleDateString("en-US", { month: "numeric", year: "numeric" });

        console.log(`Month name: ${monthName}.`);

        if (runIndex === actionRuns.length - 1) {
            uniqueRepositories.add(actionRun.repository);

            uniqueRepositoriesValues.push({
                month: monthName,
                count: uniqueRepositories.size
            });

            totalRunsValues.push({
                month: monthName,
                count: runCountForMonth
            });
        } else if (processedMonths.size > 0 && !processedMonths.includes(monthName)) {
            uniqueRepositoriesValues.push({
                month: monthName,
                count: uniqueRepositories.size
            });

            totalRunsValues.push({
                month: monthName,
                count: runCountForMonth
            });

            runCountForMonth = 0;
        }

        processedMonths.add(monthName);
        uniqueRepositories.add(actionRun.repository);

        console.log(`Unique repositories data: ${JSON.stringify(uniqueRepositoriesValues)}.`);
        console.log(`Total runs data: ${JSON.stringify(totalRunsValues)}.`);
    }

    const vega = require('vega');
    const fs = require('fs');
    let uniqueRepositoriesSpec = require(__dirname + '/vega-specs/unique-repositories');
    let totalRunsSpec = require(__dirname + '/vega-specs/total-runs');

    uniqueRepositoriesSpec.data[0].values = uniqueRepositoriesValues;
    totalRunsSpec.data[0].values = totalRunsValues;

    const uniqueRepositoriesChartView = new vega.View(vega.parse(uniqueRepositoriesSpec), {renderer: 'none'});
    const totalRunsChartView = new vega.View(vega.parse(totalRunsSpec), {renderer: 'none'});

    fs.mkdirSync("chart-output");

    uniqueRepositoriesChartView.toCanvas()
        .then(function(canvas) {
            canvas.createPNGStream().pipe(fs.createWriteStream('chart-output/unique-repositories.png'));
        })
        .catch(function(err) {
            setFailed(err);
        });

    totalRunsChartView.toCanvas()
        .then(function(canvas) {
            canvas.createPNGStream().pipe(fs.createWriteStream('chart-output/total-runs.png'));
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