# s10n

> **s10n** stands for _"sanitization"_.
> Just like _l10n_ stands for _"localization"_.
> See also [i18n, l10n et al](https://blog.mozilla.org/l10n/2011/12/14/i18n-vs-l10n-whats-the-diff/)

A library to make basic user input sanitization
and subsequent validation an easier job.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

## Table of Contents

- [Use cases](#use-cases)
  - [Example 1. Username](#example-1-username)
  - [Example 2. Arbitrary text](#example-2-arbitrary-text)
- [API](#api)
  - [Modifiers](#modifiers)
    - [Treating line break characters](#treating-line-break-characters)
    - [Line break character](#line-break-character)
  - [Elementary transformers](#elementary-transformers)
    - [Transform whitespaces](#transform-whitespaces)
    - [Handle line breaks](#handle-line-breaks)
    - [Keep/Remove/Replace](#keepremovereplace)
    - [Other transformations](#other-transformations)
  - [Compound transformers](#compound-transformers)
  - [Semantic sanitizers](#semantic-sanitizers)
  - [Custom transformations](#custom-transformations)
  - [Getting sanitized value](#getting-sanitized-value)
  - [Utility methods](#utility-methods)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
<!-- *generated with [DocToc](https://github.com/thlorenz/doctoc)* -->

## Use cases

Sanitization is **NOT** validation, but
it can help make validation an easier job
and/or help to suggest to a user an input variation
that better matches input expectations or requirements.

As with validation sanitization, if in place, should
be applied on both frontend and backend, since a user
can bypass sanitization and validation on frontend and
send input directly to a backend endpoint.

### Example 1. Username

Let's assume the following scenario of a username input.

The rule is that only a-z, A-Z, numbers, underscore and dash
are only expected in valid input.

A user submits a string of `#UsEr #$%"' NaMe 5_6-9`.
Input gets invalidated, the rule gets presented to the user
and the user expected to remove all invalid characters.
The input then becomes a valid string of `UsErNaMe5_6-9`.

Alternatively an app might have suggested (or enforced)
a valid input. Examples below are demonstration of
default and tuned behaviour of a relevant semantic sanitizer
(spaces get replaced with underscores).

```javascript
let input = "  UsEr #$%' NaMe  5_6-9  ";
s10n(input).keepUsername().value; // "UsErNaMe5_6-9"
s10n(input).keepUsernameLC().value; // "username5_6-9"
s10n(input).keepUsername("_").value; // "UsEr_NaMe_5_6-9"
s10n(input).keepUsernameLC("_").value; // "user_name_5_6-9"
```

Semantic sanitizers applied are a combination of elementary and compound
transformers with an optional parameter to replace spaces
(in this particular use case).

### Example 2. Arbitrary text

Let's assume the input received from a user is
`" \n\r\n \u200B\u200C\u200D\u2060 \t\uFEFF\xA0 Sensible text \n Line 2 \n\r\n\r\r "`

Here are issues worth attention and optimization:

- it contains problematic whitespaces
- it contains sequences of 2 or more whitespaces
- it contains leading and trailing whitespaces
- there is a variety of line break characters,
  potentially hazardous (CRLF injection)
- there are leading and trailing empty lines
- line break characters are invalid in a one line input

Any of the above can be considered as some unnecessarily
contaminated data.

Having all issues fixed the above input would have been:

- `"Sensible text\nLine 2"` for a multiline input
- `"Sensible text Line 2"` for a simple string input

```javascript
let input = "  \n\r\n \u200B\u200C\u200D\u2060 \t\uFEFF\xA0 Sensible   text  \n Line 2  \n\r\n\r\r  ";

s10n(input).minimizeWhitespaces().value; // "Sensible text Line 2"

s10n(input)
  .preserveLineBreaks() // modifier for subsequent methods to preserve line breaks
  .minimizeWhitespaces().value; // "Sensible text\nLine 2"
```

`minimizeWhitespaces` does the following:

- normalizes line break characters, i.e.
  CRLF (`\n\r`) and individual CR (`\r`)
  are converted into LF (`\n`) (default behaviour)
- normalizes whitespaces into standard space character (`\x20`)
- merges continuous whitespaces into a single space character
- normalizes lines in a multiline input
  (strips leading and trailing spaces in each line of a multiline input)
- trims leading and trailing whitespaces
- trims leading and trailing line breaks

[ [^^ Back to TOC ^^](#table-of-contents) ]

## API

`s10n` offers a number of elementary, compound and semantic
transformers and sanitizers as well as a method to apply
an arbitrary sanitizer.

Below are the usage examples to give a general impression
of the API.

```javascript
s10n("  Some text  \n Yet basically valid \n\n  ")
  .preserveLineBreaks()
  .minimizeWhitespaces().value; // "Some text\nYet basically valid"

s10n("  My User Name  ").keepUsernameLC("_").value; // "my_user_name"

let input = "  Some   arbitrary \t \xA0 text  ";

s10n(input)
  .normalizeWhitespaces()
  .trim().value; // "Some   arbitrary     text"

s10n(input)
  .mergeWhitespaces()
  .trim().value; // "Some arbitrary text"
```

[ [^^ Back to TOC ^^](#table-of-contents) ]

### Modifiers

Modifiers affect behaviour of subsequent transformers.

#### Treating line break characters

Defines whether to preserve or disregard line break
characters when applying transformers.

Default behaviour is to disregard line break characters.
This setting doesn't affect some transformers (e.g. **`trimLineBreaks()`**).
These are marked correspondingly.

```javascript
let input = " \n\n\n ";
s10n(input).trim().value; // ""
s10n(input)
  .preserveLineBreaks()
  .trim().value; // "\n\n\n"
```

Call `disregardLineBreaks` when subsequent sanitizers should
disregard line breaks after any preceding transformations
has been affected by `preserveLineBreaks`.

#### Line break character

By default, whenever any sanitizer affects line break characters
a `\n` is considered as a valid or target line break character.

This behaviour can be changed for subsequent sanitizers
(e.g. `setLineBreakCharacter('\r')`).
Whenever line breaks in a string get normalized
CRLF (`\r\n`) is converted into a single line break character
(`\n` by default, or a value assigned by `setLineBreakCharacter` method).

```javascript
let input = "\r\n\n\n\r\r";

s10n(input).normalizeLineBreaks().value; // "\n\n\n\n\n"

s10n(input)
  .setLineBreakCharacter("\r")
  .normalizeLineBreaks().value; // "\r\r\r\r\r"
```

[ [^^ Back to TOC ^^](#table-of-contents) ]

### Elementary transformers

Elementary transformers have a pretty limited scope of responsibility.
Normally used for basic transformations
and as building blocks by compound transformers,
semantic sanitizers and custom transformers/sanitizers.

#### Transform whitespaces

**s10n** treats an extended set of characters, including
`\x20\u200B\u200C\u200D\u2060\uFEFF\xA0` as whitespaces.
`\n` and `\r` are not considered whitespaces
when `preserveLineBreaks` modifier applied.

<!-- prettier-ignore -->
- **`trim()`** - removes leading and trailing whitespaces
- **`trimLineBreaks()`** - always removes leading and trailing
  line break characters, disregarding the **LineBreak** modifier setting
- **`mergeLineBreaks()`** - normalizes and merges consequent line breaks
  disregarding the **LineBreak** modifier setting
- **`normalizeWhitespaces()`** - all whitespaces are
  converted into space character ` ` (`\x20`)
- **`mergeWhitespaces()`** - merges continuous clusters of whitespaces
  into a single space character ` ` (`\x20`)
- **`stripWhitespaces()`** - strips all whitespaces from input
<!-- prettier-ignore-end -->

Examples:

```javascript
let input = "\n  Z\tY \x0A \n X W\uFEFFV \n\n  \n";

s10n(input).trim().value; // "Z\tY \x0A \n X W\uFEFFV"
s10n(input)
  .preserveLineBreaks()
  .trim().value; // <same as input>

s10n(input).trimLineBreaks().value; // "  Z\tY \x0A \n X W\uFEFFV \n\n  "
s10n(input)
  .preserveLineBreaks()
  .trimLineBreaks().value; // <same as with disregardNLineBreaks>

s10n("\n\r\r\r\n\nfoo\n\r\nbar\n\r\r\r\n\n").mergeLineBreaks().value; // "\nfoo\nbar\n"
s10n("\n \r\r\r\n\nfoo\n \r\nbar\n\r\r \r\n\n").mergeLineBreaks().value; // "\n \nfoo\n \nbar\n \n"

s10n(input).normalizeWhitespaces().value; // "   Z Y     X W V      "
s10n(input)
  .preserveLineBreaks()
  .normalizeWhitespaces().value; // "\n  Z Y   \n X W V \n\n  \n"

s10n(input).mergeWhitespaces().value; // " Z Y X W V "
s10n(input)
  .preserveLineBreaks()
  .mergeWhitespaces().value; // "\n Z Y \n X W V \n\n \n"

s10n(input).stripWhitespaces().value; // "ZYXWV"
s10n(input)
  .preserveLineBreaks()
  .stripWhitespaces()
  .value(); // "\nZY\nXWV\n\n\n"

s10n(input)
  .preserveLineBreaks()
  .normalizeWhitespaces()
  .mergeWhitespaces()
  .trimLineBreaks()
  .trim().value; // "Z Y \n X W V \n\n"
```

See also [`normalizeLineBreaks()`](#handle-line-breaks)

[ [^^ Back to TOC ^^](#table-of-contents) ]

#### Handle line breaks

- **`normalizeLineBreaks(lineBreakCharacter = undefined)`** -
  transforms CRLF, CR, LF into a line break character defined following the rules below:
  - as specified by param `lineBreakCharacter`
  - if param `lineBreakCharacter` is undefined then as set by `setLineBreakCharacter()`
  - if `setLineBreakCharacter()` wasn't applied then defaults to LF (`'\n'`)
- **`normalizeMultiline()`** -
  strips whitespaces that immediately precede
  or follow line break characters;
  ignores **LineBreak** modifier setting

Examples:

```javascript
let input = "\r\n\r  abc  \r\n  def   \r \t   ghi   \n \t\t  \n \r\n\n\r\n\n\r\r  \r\r\n";
s10n(input).normalizeLineBreaks().value; // "\n\n  abc  \n  def   \n \t   ghi   \n \t\t  \n \n\n\n\n\n\n  \n\n"
s10n(input).normalizeMultiline().value; // "\r\n\rabc\r\ndef\rghi\n\n\r\n\n\r\n\n\r\r\r\r\n"
s10n(input)
  .normalizeLineBreaks()
  .normalizeMultiline().value; // "\n\nabc\ndef\nghi\n\n\n\n\n\n\n\n\n\n"
```

See also [`minimizeWhitespaces()`](#compound-transformers)

[ [^^ Back to TOC ^^](#table-of-contents) ]

#### Keep/Remove/Replace

These methods' behaviour is **NOT** affected
by **LineBreak** modifier
(disregarded by default, i.e. `\s` RegExp token comprises `\r` and `\n`).
Specify `\n` and/or `\r`
explicitly whenever those should be kept or removed.

Method argument should follow RegExp character class
specification.

- **`keepOnlyCharset(allowedChars = "-A-Za-z0-9_\\x20.,}{\\]\\[)(", regexpFlags)`** -
  keep listed characters only
- **`keepOnlyRegExp(regexp, regexpFlags)`** - keep characters as per RegExp
  (RegExp object or regexp body as a string)
- **`remove(disallowedChars, regexpFlags)`** - remove listed characters
- **`replace(needle, replacement = "", regexpFlags)`** -
  replaces needle (a string or RegExp object) with replacement
  string

`regexpFlags` in the methods above is an optional parameter and
defaults to the falgs as specified in [`_regexp`](#utility-methods) ("gu").

Examples:

```javascript
let input = "ABCDabcd01239 _-.,(abcd){defg}[hijk]";
s10n(input1).keepOnlyCharset("}{][)(").value; // "(){}[]"
s10n(input1).keepOnlyRegexp(/\{.*?\}|\[.*?\]|\(.*?\)/gu).value; // "(abcd){defg}[hijk]"

let input2 = "ABCDEFGHabcdefghABCDEFGHabcdefgh";
s10n(input2).remove("ABCD").value; // "EFGHabcdefghEFGHabcdefgh"
s10n(input2).remove("ABCD", "giu").value; // "EFGHefghEFGHefgh"
s10n(input2).remove(/ABCD/).value; // "EFGHabcdefghABCDEFGHabcdefgh"
s10n(input2).remove(/ABCD/giu).value; // "EFGHefghEFGHefgh"
s10n(input2).remove(/ABCD/, "giu").value; // "EFGHefghEFGHefgh"
```

[ [^^ Back to TOC ^^](#table-of-contents) ]

#### Other transformations

- **`toLowerCase()`** - converts to lower case
- **`toUpperCase()`** - converts to upper case

Examples:

```javascript
let input = "aBcD01";
s10n(input).toLowerCase().value; // "abcd01"
s10n(input).toUpperCase().value; // "ABCD01"
```

[ [^^ Back to TOC ^^](#table-of-contents) ]

### Compound transformers

Compound transformers implement complex
transformation rules applying multiple transformations,
often using elementary transformers.

- **`keepBase10Digits()`** - strips out anything but `0-9`
- **`keepBase16Digits()`** - (alias: **`keepHexDigits()`**) -
  strips out anything but `0-9a-fA-F`;
  best combined chained with `toLowerCase()` or `toUpperCase()`
  for consistent result
- **`minimizeWhitespaces()`** - removes leading, trailing
  and continuous clusters of whitespaces and line breaks;
  when preceded with `preserveLineBreaks()` treats input as
  a multiline string and thus trims spaces in every line

Examples:

```javascript
let input1 = "  XYZ 20fE\n\n  ";

s10n(input1).keepBase10Digits().value; // 20
s10n(input1).keepBase16Digits().value; // 20fE
s10n(input1)
  .keepBase16Digits()
  .toLowerCase().value; // 20fe
s10n(input1)
  .keepHexDigits()
  .toLowerCase().value; // 20fE

let input2 = "  Some text  \n Yet basically valid \n\n  ";

s10n(input2).minimizeWhitespaces().value; // "Some text Yet basically valid"

s10n(input2)
  .preserveLineBreaks()
  .minimizeWhitespaces().value; // "Some text\nYet basically valid"
```

[ [^^ Back to TOC ^^](#table-of-contents) ]

### Semantic sanitizers

Semantic sanitizers implement semantically meaningful
yet heavily opinionated sanitization rules for particular use cases.

- **`keepOnlyEmailPopularCharset(commonUse = false)`** - by default keeps a charset
  as per rfc (`A-Za-z0-9_\\-@.+)( \":;<>\\\\,\\[\\]}{!#$%&'*/=?^`|~``);
  pass `true` if a lesser (more common) charset (`A-Za-z0-9_\-@.+)(`)
  fits better your particular use case
- **`keepUsername(whiteSpaceReplacement = "")`** -
- **`keepUsernameLC(whiteSpaceReplacement = "")`** -

Examples:

```javascript
let input = "  UsEr   #$%\"' NaMe +  5_6-9 @ .Co.Uk  ";

s10n(input).keepOnlyEmailPopularCharset(true).value; // "UsErNaMe+5_6-9@.co.uk"
s10n(input)
  .keepOnlyEmailPopularCharset(true)
  .toLowerCase().value; // "username+5_6-9@.co.uk"

s10n(input).keepUsername().value; // "UsErNaMe5_6-9CoUk"
s10n(input).keepUsernameLC().value; // "username5_6-9couk"
s10n(input).keepUsername("_").value; // "UsEr_NaMe_5_6-9_CoUk"
s10n(input).keepUsernameLC("_").value; // "user_name_5_6-9_couk"
```

Note: sanitized email input is still invalid but (arguably)
yet easier to double-check and fix.

What if those semantic sanitizers do not fit my needs?
Consider implementing a [customized transformer](#custom-transformations).

[ [^^ Back to TOC ^^](#table-of-contents) ]

### Custom transformations

Custom transformer is a method to apply complex sanitization
logic using elementary or compound transformers, semantic sanitizers
or applying a completely unique rule set.

- **`apply(callback, ...arguments)`** - call back will receive
  current value, calling context (reference to current s10n object as `this`),
  and any extra arguments passed
- **`extend(methodName, method)`** -
  registers a re-usable custom transformation method
  - this should be called on `s10n` object itself rather than in
    a sanitization chain
  - the method is accessible at every sanitization chain once registered
  - the method should transform `this.value` and/or call other
    built-in or registered custom transformers/sanitizers
  - the method should return `this` to make it chainable
  - do not define the method as an arrow function

Example:

```javascript
s10n("c00l").apply(
  (value, context, needle, replacement) => value.replace(context._regexp(needle), replacement),
  "0",
  "o"
).value; // "cool"

s10n.extend("makeCool", function() {
  // replaces 'o' and 'O' followed with whitespaces (extended set) with a single '0'
  this.replace(this._regexp("o\\s+", "gi"), "0");
  return this;
});
s10n("coO\x0A o\t l").makeCool().value; // "co00l"
```

[ [^^ Back to TOC ^^](#table-of-contents) ]

### Getting sanitized value

Getting sanitized value (as a string)
is as simple as terminating
transformation chain with `.value`.
E.g. `s10n(" my User Name ").usernameLC().value`.
In string context `.value` is optional as a string
is being returned by default.
E.g. `` `Username: ${s10n(" my User Name ").usernameLC()}` ``
or `s10n(" my User Name ").usernameLC() + ''`

Explicit value access methods:

- **`value`** - value as is
- **`toString()`** - same as `.value`
- **`toNumber()`** - converts sanitized string
  into a Number. Would work with `keepBase10Digits()`.
  Use with caution as it will return `NaN`
  if sanitized string contains anything else
  but base10 digits, decimal point and single
  `e` for scientific notation.

Examples:

```javascript
let input = "65";
s10n(input).value; // "65"
s10n(input).toString(); // "65"
`${s10n(input)}`; // "65"
s10n(input) + ""; // "65"
s10n(input).toNumber(); // 65
```

[ [^^ Back to TOC ^^](#table-of-contents) ]

### Utility methods

- **`_regexp(patternString, flags = "gu")`** -
  using this utility will ensure that `\s` entities
  in pattern string are replaced with an extended set
  of whitespaces. Recommended for use in `apply` callback.

Example:

```javascript
s10n("\t \xA0 ABC\n\t \uFEFF").apply((value, context) =>
  // replaces extended set of whitespaces with dashes
  value.replace(context._regexp("\\s"), "-")
).value; // "----ABC----"
```

[ [^^ Back to TOC ^^](#table-of-contents) ]
