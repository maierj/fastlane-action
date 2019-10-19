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

## Example usage

Basic usage for executing a lane in the root directory without arguments.

```
uses: maierj/fastlane-action@v0.10.0
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
uses: maierj/fastlane-action@v0.10.0
with:
  lane: 'beta'
  options: '{ "option1": "value1", "option2": "value2" }'
```
\
Usage for executing a lane in a context where the fastlane folder is in a subdirectory called `ios`.

```
uses: maierj/fastlane-action@v0.10.0
with:
  lane: 'beta'
  subdirectory: 'ios'
```

## Support & Limitations

The action support macOS and ubuntu as virtual environments.