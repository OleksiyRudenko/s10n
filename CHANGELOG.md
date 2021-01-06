# Changelog

All notable changes to this project are documented in this file.

The format is based on
[Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to
[Semantic Versioning](http://semver.org/spec/v2.0.0.html).

<!-- ## [Unreleased] -->

## [0.2.0] - 2021-01-12

### Changed

- Aggregate core methods into S10n class to minimize
  possible effect on performance and to ensure consistent
  type annotations

## [0.1.2] - 2021-01-04

### Changed

- Chores: Upgraded dependencies for building and testing
- Docs(CONTRIBUTING):
  - changed latest major version tag requirement
  - changed `yarn build` as a pre-publishing step

## [0.1.1] - 2021-01-04

### Added

- JSDoc API documentation comments
- Tests: added test cases to covering `s10n#toNumber` implementation
- Docs (README.md):
  - added description for `s10n#keepUsername` and `s10n#keepUsername`
  - added Development and Publishing section
- Other:
  - added testing on CI stage
  - added GitHub issue and PR templates

### Changed

- Entities: moved email-related charsets to relevant functions
- Docs (README.md):
  - changed description for `s10n#toNumber`
  - made some statements more explicit
  - fixed typos and grammar
- Contribution guidelines (CONTRIBUTING.md):
  - added contribution guidelines

## [0.1.0] - 2020-10-01

### Added

- Modifiers:
  - preserveLineBreaks
  - disregardLineBreaks
  - setLineBreakCharacter
- Entities:
  - whitespaceAny
  - whitespaceNotLineBreak
  - whitespace
  - emailCommon
  - emailRfc
- Elementary transformers:
  - trim
  - trimLineBreaks
  - mergeLineBreaks
  - normalizeWhitespaces
  - mergeWhitespaces
  - stripWhitespaces
  - normalizeLineBreaks
  - normalizeMultiline
  - keepOnlyCharset
  - keepOnlyRegexp
  - remove
  - replace
  - toLowerCase
  - toUpperCase
- Compound transformers:
  - keepBase10Digits
  - keepBase16Digits (keepHexDigits alias)
  - minimizeWhitespaces
- Semantic sanitizers:
  - keepOnlyEmailPopularCharset
  - keepUsername
  - keepUsernameLC
- Custom transformations:
  - apply
  - extend (callable on s10n object itself)
- Output casting:
  - toString
  - toNumber
- Utils:
  - \_regexp
- Tests

<!-- [unreleased]: https://github.com/OleksiyRudenko/s10n/compare/v0.1.0...HEAD -->

[0.2.0]: https://github.com/OleksiyRudenko/s10n/compare/v0.1.2...v0.2.0
[0.1.2]: https://github.com/OleksiyRudenko/s10n/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/OleksiyRudenko/s10n/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/OleksiyRudenko/s10n/compare/v0.0.0...v0.1.0
