# Fastlane action

This action executes the lane that is passed.

## Inputs

### `lane`

**Required** The lane that should be executed.

### `subdirectory`

**Optional** The relative path from the project root to the subdirectory where the fastlane folder is located.

## Example usage

```
uses: maierj/fastlane-action@v0.9.3
with:
  lane: 'beta'
```

or

```
uses: maierj/fastlane-action@v0.9.3
with:
  lane: 'beta'
  subdirectory: 'ios'
```