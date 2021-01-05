# Contributing to the project

## Codebase structure

Major project files are described below

| File / directory  | Description                   |
| ----------------- | ----------------------------- |
| `README.md`       | Project documentation         |
| `package.json`    | Project package configuration |
| `CHANGELOG.md`    | Code base change log          |
| `CONTRIBUTING.md` | Contribution guidelines       |
| `src/`            | Library core codebase         |

Library core codebase explained:

- `s10n.js` - library entry point
- `s10n.test.js` - tests
- other files are components to a `s10n` object
  grouped by designation

## Contributing

Run `yarn` to install dependencies.

Run `yarn upgrade` when critical vulnerabilities
in dev dependencies are discovered.

### Code, Tests and Documentation

Use a **feature branch** to contribute.

When changes implemented:

- add or update tests in `src/s10n.test.js`
- add or change JSDoc comments
- update documentation in `README.md`
  and run `yarn doctoc` to update its TOC
- run `yarn lint` to lint the code
- run `yarn test` to test the code
- update `CHANGELOG.md`

Open a pull request to have the changes reviewed and approved.

Once approved commits in a PR get squashed and
rebased onto or otherwise merged into the `master` branch.

## Release process

Every change to the library core codebase
or its dependencies (e.g. dependency upgrades)
merged into `master` constitutes a new version
of the library.

> Changes to the documentation or auxiliary codebase
> (e.g. sandbox app) may be merged into `master`
> yet not marked as a release.

This project adheres to
[Semantic Versioning](http://semver.org/spec/v2.0.0.html)

Given a version number MAJOR.MINOR.PATCH, increment the:

- MAJOR version when you make incompatible API changes,
- MINOR version when you add functionality in a backwards compatible manner, and
- PATCH version when you make backwards compatible bug fixes.

If the only changes are changes to documentation,
dev environment configuration, and/or dev dependencies
consider incrementing PATCH version only.

A new version is used in or as:

- `CHANGELOG.md` (in both main section and diffs links at the bottom)
- `package.json`
- tag to the relevant commit on `master`

Version labels (e.g. `-alpha`, `-beta` etc) are allowed
on commits that are not on `master` only.

### Tags

Once a new commit appears on `master` it should be tagged
with the following tags:

- current version (e.g. `v1.0.3`)
- major version tag that denotes a major version (e.g. `v1-latest`)
  current version belongs to
- the `latest` tag

Tags must be annotated, e.g. `git tag -m v2.1.5 v2.1.5`

Make sure tags are on remote with `git push --tags origin master`.

### Publishing

Run:

- `yarn build` to check if the package distribution builds as expected
- `yarn login:github-registry` to log in into registry
- `yarn publish` to build the distribution package
  and publish on npm registry
- `yarn publish:github` to build the distribution package
  and publish on github registry
