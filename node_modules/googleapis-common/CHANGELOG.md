# Changelog

[npm history][1]

[1]: https://www.npmjs.com/package/nodejs-googleapis-common?activeTab=versions

## v0.7.2

01-26-2019 21:18 PST

- fix: explicit push of finale for multipart/related streams to fix node.js 6 ([#82](https://github.com/googleapis/nodejs-googleapis-common/pull/82))

## v0.7.1

01-22-2019 11:22 PST

### Bug fixes
- fix(types): allow user agent directives in global options ([#78](https://github.com/googleapis/nodejs-googleapis-common/pull/78))
- fix(streams): reroute boundary insertion through transform stream ([#67](https://github.com/googleapis/nodejs-googleapis-common/pull/67))

## v0.7.0

01-21-2019 00:50 PST

### Features
- feat: add ability to augment the user agent ([#76](https://github.com/googleapis/nodejs-googleapis-common/pull/76))

## v0.6.0

- feat: export AuthPlus ([#70](https://github.com/googleapis/nodejs-googleapis-common/pull/70))
- feat: make it ready for use in browser ([#69](https://github.com/googleapis/nodejs-googleapis-common/pull/69))
- build: check for 404s in the docs ([#73](https://github.com/googleapis/nodejs-googleapis-common/pull/73))

### New Features

This release makes it possible to use this library in browser. 
It was actually possible before but with some nasty warnings
printed to JavaScript console. These warnings are now eliminated.

Also, now exporting `AuthPlus` and `OAuth2Client` which allows
APIs that use this common module to drop direct dependency on
`google-auth-library`.

### Internal / Testing Changes

Simple system tests and browser tests were added in this release.

## v0.4.0

11-02-2018 10:31 PDT


### Implementation Changes

### New Features
- add additionalProperties to SchemaItem ([#34](https://github.com/googleapis/nodejs-googleapis-common/pull/34))

### Dependencies
- fix(deps): update dependency pify to v4 ([#23](https://github.com/googleapis/nodejs-googleapis-common/pull/23))
- chore(deps): update dependency typescript to ~3.1.0 ([#20](https://github.com/googleapis/nodejs-googleapis-common/pull/20))

### Documentation
- chore: update issue templates ([#29](https://github.com/googleapis/nodejs-googleapis-common/pull/29))
- chore: remove old issue template ([#27](https://github.com/googleapis/nodejs-googleapis-common/pull/27))
- chore: update issue templates

### Internal / Testing Changes
- chore: update CircleCI config ([#37](https://github.com/googleapis/nodejs-googleapis-common/pull/37))
- chore: include build in eslintignore ([#33](https://github.com/googleapis/nodejs-googleapis-common/pull/33))
- build: run tests on node11 ([#25](https://github.com/googleapis/nodejs-googleapis-common/pull/25))
- chore(deps): update dependency nock to v10 ([#21](https://github.com/googleapis/nodejs-googleapis-common/pull/21))
- chores(build): run codecov on continuous builds ([#19](https://github.com/googleapis/nodejs-googleapis-common/pull/19))
- chores(build): do not collect sponge.xml from windows builds ([#22](https://github.com/googleapis/nodejs-googleapis-common/pull/22))
- build: fix codecov uploading on Kokoro ([#15](https://github.com/googleapis/nodejs-googleapis-common/pull/15))
- build: bring in Kokoro cfgs ([#13](https://github.com/googleapis/nodejs-googleapis-common/pull/13))
- Don't publish sourcemaps ([#12](https://github.com/googleapis/nodejs-googleapis-common/pull/12))
- Enable prefer-const in the eslint config ([#11](https://github.com/googleapis/nodejs-googleapis-common/pull/11))
- Enable no-var in eslint ([#10](https://github.com/googleapis/nodejs-googleapis-common/pull/10))
- Retry npm install in CI ([#9](https://github.com/googleapis/nodejs-googleapis-common/pull/9))

## v0.3.0

This release uses the 2.0 release of `google-auth-library`.  A summary of these changes (including breaking changes) can be found in the [release notes](https://github.com/google/google-auth-library-nodejs/releases/tag/v2.0.0).

### Dependencies
- Upgrade to google-auth-library 2.0 (#6)

## v0.2.1

### Fixes
- fix: use the latest google-auth-library (#4)

