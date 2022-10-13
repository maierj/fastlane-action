# GitHub Action: Fastlane

[![Actions Status](https://github.com/maierj/fastlane-action-test/workflows/Fastlane%20action%20test/badge.svg)](https://github.com/maierj/fastlane-action-test/actions)

This action executes the lane that is passed.

## Inputs

### `lane`

**Required** The lane that should be executed.

### `options`

**Optional** The options that should be passed as arguments to the lane. The options should be serialized as a JSON object.

### `subdirectory`

**Optional** The relative path from the project root to the subdirectory where the fastlane folder is located.

### `bundle-install-path`

**Optional** The directory where Ruby gems should be installed to and cached. If a relative path is specified, it's applied relative to the location of the `Gemfile`, which is either the project root or the directory from the `subdirectory` input option.

### `verbose`

**Optional** If set to true, adds the verbose option to the fastlane command for extended log output.

### `skip-tracking`

**Optional** The action tracks usage using Firebase by default (see [Tracking of usage statistics](https://github.com/maierj/fastlane-action#tracking-of-usage-statistics)). You can disable tracking by setting this input option to 'true'.

### `env`

**Optional** If used, adds the env option to the fastlane command to use fastlane env files (see [Fastlane environment variables](https://docs.fastlane.tools/advanced/other/)).

## Example usage

Basic usage for executing a lane in the root directory without arguments.

```
- uses: actions/checkout@v2
- uses: ruby/setup-ruby@v1
  with:
    ruby-version: '2.7.2'
- uses: maierj/fastlane-action@v2.3.0
  with:
    lane: 'beta'
```
\
Usage for executing a lane in the root directory with arguments.
For a lane called `beta` to be called like
```
fastlane beta option1:value1 option2:value2
```
the workflow step should look like
```
- uses: actions/checkout@v2
- uses: ruby/setup-ruby@v1
  with:
    ruby-version: '2.7.2'
- uses: maierj/fastlane-action@v2.3.0
  with:
    lane: 'beta'
    options: '{ "option1": "value1", "option2": "value2" }'
```
\
Usage for executing a lane in a context where the fastlane folder is in a subdirectory called `ios`.

```
- uses: actions/checkout@v2
- uses: ruby/setup-ruby@v1
  with:
    ruby-version: '2.7.2'
- uses: maierj/fastlane-action@v2.3.0
  with:
    lane: 'beta'
    subdirectory: 'ios'
```
\
Speed up execution time of your workflow by specifying a custom directory where Ruby gems are installed to and shared between multiple steps of the same workflow.

```
- uses: actions/checkout@v2
- uses: ruby/setup-ruby@v1
  with:
    ruby-version: '2.7.2'
- uses: maierj/fastlane-action@v2.3.0
  with:
    lane: 'beta'
    subdirectory: 'ios'
    bundle-install-path: 'vendor/bundle'
```

\
Use the env option for fastlane env files:

```
- uses: actions/checkout@v2
- uses: ruby/setup-ruby@v1
  with:
    ruby-version: '2.7.2'
- uses: maierj/fastlane-action@v2.3.0
  with:
    lane: beta
    env: staging
```
## Support & Limitations

The action supports macOS and ubuntu as virtual environments.

## Tracking of usage statistics

Usage of this action is tracked using Firebase. The information that is tracked is:
- If optional input `options` is used (not the value of the parameter)
- If optional input `subdirectory` is used (not the value of the parameter)
- If optional input `bundle-install-path` is used (not the value of the parameter)
- Operating System of the runner that executes this action (using environment variable `RUNNER_OS`)
- Name of the repository, that uses the action (using environment variable `GITHUB_REPOSITORY`)

Tracking can be disabled by using the input option `skip-tracking`.

## Usage statistics results

These charts are generated automatically every night using a GitHub action workflow. The earliest data points were created on 27.12.2019.

### Cumulative number of unique repositories that use the action
![Cumulative number of unique repositories that use the action](/../master/usage-statistics-charts/unique-repositories.png)

### Non-cumulative number of action runs
![Non-cumulative number of action runs](/../master/usage-statistics-charts/total-runs.png)
