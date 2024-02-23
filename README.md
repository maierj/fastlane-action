# GitHub Action: Fastlane

[![Actions Status](https://github.com/maierj/fastlane-action-test/workflows/Fastlane%20action%20test/badge.svg)](https://github.com/maierj/fastlane-action-test/actions)

This action executes the lane that is passed.

## Migration to v3

* The parameter `bundle-install-path` has been removed from this action. This parameter was mostly intended to enable caching of `bundle install` results.
For that reason and also, because this action no longer installs the `Gemfile` dependencies, anyone using this action should set the `bundler-cache` parameter of the `ruby/setup-ruby` step to `true` (see [Example Usage](#example-usage)). 
* If you are using the `subdirectory` of this action, you should also set the `working-directory` of `ruby/setup-ruby`, so the action is knows where to look for the `Gemfile`.

## Inputs

### `lane`

**Required** The lane that should be executed.

### `options`

**Optional** The options that should be passed as arguments to the lane. The options should be serialized as a JSON object.

### `subdirectory`

**Optional** The relative path from the project root to the subdirectory where the fastlane folder is located.

### `verbose`

**Optional** If set to true, adds the verbose option to the fastlane command for extended log output.

### `env`

**Optional** If used, adds the env option to the fastlane command to use fastlane env files (see [Fastlane environment variables](https://docs.fastlane.tools/advanced/other/)).

## Example Usage

Basic usage for executing a lane in the root directory without arguments.

```
- uses: actions/checkout@v3
- uses: ruby/setup-ruby@v1
  with:
    ruby-version: '3.0'
    bundler-cache: true
- uses: maierj/fastlane-action@v3.1.0
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
- uses: maierj/fastlane-action@v3.1.0
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
    ruby-version: '3.0'
    bundler-cache: true
    working-directory: 'ios'
- uses: maierj/fastlane-action@v3.1.0
  with:
    lane: 'beta'
    subdirectory: 'ios'
```
\
Use the env option for fastlane env files:

```
- uses: actions/checkout@v3
- uses: ruby/setup-ruby@v1
  with:
    ruby-version: '3.0'
    bundler-cache: true
- uses: maierj/fastlane-action@v3.1.0
  with:
    lane: beta
    env: staging
```
## Support & Limitations

The action generally supports 
* `ubuntu-18.04`
* `ubuntu-20.04`
* `ubuntu-22.04`
* `macOS-10.15`
* `macOS-11`
* `macOS-12`
* `windows-2019`
* `windows-2022`

There may be further limitations depending on what your lanes are doing, but that's outside the scope of this action.
