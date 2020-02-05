const core = require('@actions/core');
const tc = require('@actions/tool-cache');
const shell = require('shelljs');
const fs = require('fs');

function run() {
    try {
        const lane = core.getInput('lane', { required: true });
        const optionsInput = core.getInput('options', { required: false });
        const subdirectory = core.getInput('subdirectory', { required: false });
        const bundleInstallPath = core.getInput('bundle-install-path', { required: false });
        const skipTracking = core.getInput('skip-tracking', { required: false });

        console.log(`Executing lane ${lane} on ${process.env.RUNNER_OS}.`);

        if (skipTracking !== "true") {
            shell.exec(`curl -s -X POST -H \"Content-Type:application/json\" https://us-central1-github-fastlane-action.cloudfunctions.net/registerActionRun -d '{\"repository\":\"${process.env["GITHUB_REPOSITORY"]}\", \"runnerOS\":\"${process.env["RUNNER_OS"]}\", \"usesOptions\":\"${!!optionsInput}\", \"usesSubdirectory\":\"${!!subdirectory}\", \"usesBundleInstallPath\":\"${!!bundleInstallPath}\"}'`);
        }

        if (subdirectory) {
            if (subdirectory.startsWith("/")) {
                setFailed(new Error("Specified subdirectory path is not relative."));
                return;
            }

            if (fs.existsSync(`${process.cwd()}/${subdirectory}`)) {
                console.log(`Moving to subdirectory ${subdirectory}`);
                shell.cd(subdirectory);
            } else {
                setFailed(new Error(`Specified subdirectory ${subdirectory} does not exist.`));
                return;
            }
        }

        let deserializedOptions;
        if (optionsInput) {
            try {
                deserializedOptions = JSON.parse(optionsInput);
            } catch(e) {
                setFailed(new Error(`Input value "options" cannot be parsed into a JSON object.`));
                return;
            }
        } else {
            deserializedOptions = {};
        }

        const supposedGemfilePath = `${process.cwd()}/Gemfile`;
        let fastlaneCommand;
        if (fs.existsSync(supposedGemfilePath)) {
            installBundleDependencies(supposedGemfilePath, bundleInstallPath);

            fastlaneCommand = "bundle exec fastlane";
        } else {
            installFastlaneIfNecessary();

            fastlaneCommand = "fastlane"
        }

        let fastlaneOptions = [];
        for (let optionKey in deserializedOptions) {
            if (Object.prototype.hasOwnProperty.call(deserializedOptions, optionKey)) {
                fastlaneOptions.push(`${optionKey}:"${deserializedOptions[optionKey]}"`);
            }
        }

        let fastlaneExecutionResult;
        if (fastlaneOptions.length === 0) {
            fastlaneExecutionResult = shell.exec(`${fastlaneCommand} ${lane}`);
        } else {
            fastlaneExecutionResult = shell.exec(`${fastlaneCommand} ${lane} ${fastlaneOptions.join(" ")}`);
        }

        if (fastlaneExecutionResult.code !== 0) {
            setFailed(new Error(`Executing lane ${lane} failed.`));
        }
    } catch (error) {
        setFailed(error);
    }
}

function installBundleDependencies(pathToGemFile, customInstallPath) {
    installBundlerIfNeeded();
    configureBundler(customInstallPath);

    const initialDirectory = process.cwd();
    const pathToGemFileFolder = pathToGemFile.split("/").slice(0, -1).join("/");
    shell.cd(pathToGemFileFolder);
    shell.exec("bundle install --jobs 2");
    shell.cd(initialDirectory);
}

function installFastlaneIfNecessary() {
    if (!shell.which("fastlane")) {
        installUsingRubyGems("fastlane");
    }
}

function installBundlerIfNeeded() {
    if (!shell.which('bundle')) {
        installUsingRubyGems("bundler");
    }
}

function installUsingRubyGems(packageName) {
    setupRubyGemsIfNecessary();

    shell.exec(`sudo gem install ${packageName}`);
}

function setupRubyGemsIfNecessary() {
    if (!shell.which("gem")) {
        const rubyInstallationDirectory = tc.find('Ruby', '>= 2.6');
        const rubyBinaryDirectory = `${rubyInstallationDirectory}/bin`;

        core.addPath(rubyBinaryDirectory);
    }
}

function configureBundler(customInstallPath) {
    if (customInstallPath) {
        shell.exec(`bundle config path ${customInstallPath}`);
    }
}

function setFailed(error) {
    core.error(error);
    core.setFailed(error.message);
}

run();