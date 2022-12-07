# GitHub Action: Fastlane

[![Actions Status](https://github.com/maierj/fastlane-action-test/workflows/Fastlane%20action%20test/badge.svg)](https://github.com/maierj/fastlane-action-test/actions)

This action executes the lane that is passed.

## Migration to v3
* Usage move params to setup-ruby

## Inputs

### `lane`

**Required** The lane that should be executed.

### `options`

**Optional** The options that should be passed as arguments to the lane. The options should be serialized as a JSON object.

### `verbose`

**Optional** If set to true, adds the verbose option to the fastlane command for extended log output.

### `env`

**Optional** If used, adds the env option to the fastlane command to use fastlane env files (see [Fastlane environment variables](https://docs.fastlane.tools/advanced/other/)).

## Example usage

Basic usage for executing a lane in the root directory without arguments.

```
- uses: actions/checkout@v3
- uses: ruby/setup-ruby@v1
  with:
    ruby-version: '3.0'
- uses: maierj/fastlane-action@v3.0.0
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
- uses: actions/checkout@v3
- uses: ruby/setup-ruby@v1
  with:
    ruby-version: '3.0'
    bundler-cache: true
- uses: maierj/fastlane-action@v3.0.0
  with:
    lane: 'beta'
    options: '{ "option1": "value1", "option2": "value2" }'
```
\
Use the env option for fastlane env files:

```
- uses: actions/checkout@v3
- uses: ruby/setup-ruby@v1
  with:
    ruby-version: '3.0'
    bundler-cache: true
- uses: maierj/fastlane-action@v3.0.0
  with:
    lane: beta
    env: staging
```
## Support & Limitations

The action supports macOS and ubuntu as virtual environments.
