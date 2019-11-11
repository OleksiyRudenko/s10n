# Changelog

All notable changes to this project are documented in this file.

The format is based on
[Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to
[Semantic Versioning](http://semver.org/spec/v2.0.0.html).

<!-- ## [Unreleased] -->

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

[0.1.0]: https://github.com/OleksiyRudenko/s10n/compare/v0.0.0...v0.1.0
