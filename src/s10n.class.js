/**
 * @exports S10n
 */

/**
 * @typedef {Object} entities
 * @property {string} whitespaceAny
 * @property {string} whitespaceNotLineBreak
 * @property {string|undefined} whitespace
 */

/**
 * @typedef {Object} modifiers
 * @property {boolean} preserveLineBreaks
 * @property {string} lineBreakCharacter
 */

/**
 * This callback takes transformable string, S10n instance optionally and arbitrary arguments.
 * Returns transformed string
 * @callback s10nTransformerCallback
 * @param {string} value
 * @param {S10n} s10n - s10n instance
 * @param {...*} rest - arbitrary arguments, supplied via S10n#apply
 * @returns {string}
 */

/**
 * @class
 */
class S10n {
  /**
   * Constructor
   * @param {string} [input=""]
   */
  constructor(input = "") {
    /**
     * @type {string}
     * @public
     */
    this.value = input.toString();
    /**
     * @type {entities}
     * @private
     */
    this._entities = {
      whitespaceAny: "[\\s\\u200B\\u200C\\u200D\\u2060\\uFEFF\\xA0\\t]",
      whitespaceNotLineBreak: "(?:(?![\\n|\\r])[\\s\\u200B\\u200C\\u200D\\u2060\\uFEFF\\xA0\\t])",
      whitespace: undefined
    };
    /**
     * @type {modifiers}
     * @private
     */
    this._modifiers = {
      preserveLineBreaks: false,
      lineBreakCharacter: "\n"
    };
    this.disregardLineBreaks();
  }

  /**
   * Creates a regexp object with extended charset on \s token
   * function external:S10n._regexp
   * @param {string|RegExpConstructor} pattern
   * @param {string} [flags="gu"]
   * @returns {RegExp}
   */
  _regexp(pattern, flags = "gu") {
    return new RegExp(pattern.replace(/\\s/, this._entities.whitespace), flags);
  }

  /**
   * Sets flag for subsequent transformers respect line breaks
   * @returns {S10n}
   */
  preserveLineBreaks() {
    this._modifiers.preserveLineBreaks = true;
    this._entities.whitespace = this._entities.whitespaceNotLineBreak;
    return this;
  }
  /**
   * Sets flag for subsequent transformers disregard line breaks
   * @returns {S10n}
   */
  disregardLineBreaks() {
    this._modifiers.preserveLineBreaks = false;
    this._entities.whitespace = this._entities.whitespaceAny;
    return this;
  }
  /**
   * Assigns linebreak character used for line breaks normalization
   * @returns {S10n}
   */
  setLineBreakCharacter(lineBreakCharacter = "\n") {
    this._modifiers.lineBreakCharacter = lineBreakCharacter;
    return this;
  }

  /**
   * Applies a custom transformation with s10n object reference and arbitrary parameters
   * @param {s10nTransformerCallback} transformer
   * @param {...*} rest
   * @returns {S10n}
   */
  apply(transformer, ...rest) {
    this.value = transformer(this.value, this, ...rest);
    return this;
  }

  // Elementary transformers

  /**
   * Trims leading and trailing whitespaces
   * @returns {S10n}
   */
  trim() {
    this.value = this.value.replace(this._regexp("^\\s+|\\s+$"), "");
    return this;
  }
  /**
   * Trims leading and trailing newline characters
   * @returns {S10n}
   */
  trimLineBreaks() {
    // this method disregards _modifiers.preserveLineBreaks setting
    this.value = this.value.replace(/^[\r\n]+|[\r\n]+$/gu, "");
    return this;
  }
  /**
   * Merges consecutive sequences of newline characters
   * @returns {S10n}
   */
  mergeLineBreaks() {
    return this.normalizeLineBreaks().replace(
      new RegExp(`${this._modifiers.lineBreakCharacter}+`, "g"),
      this._modifiers.lineBreakCharacter
    );
  }
  /**
   * Replaces extended whitespaces set with space character (\0x20)
   * @returns {S10n}
   */
  normalizeWhitespaces() {
    this.value = this.value.replace(this._regexp("\\s"), " ");
    return this;
  }
  /**
   * Merges consecutive sequences of whitespaces
   * @returns {S10n}
   */
  mergeWhitespaces() {
    this.normalizeWhitespaces();
    this.value = this.value.replace(this._regexp("\\s+"), " ");
    return this;
  }
  /**
   * Removes all whitespaces
   * @returns {S10n}
   */
  stripWhitespaces() {
    this.value = this.value.replace(this._regexp("\\s"), "");
    return this;
  }
  /**
   * Converts all newline characters to a predefined newline character
   * as per _modifiers.lineBreakCharacter or lineBreakCharacter argument if any defined
   * @param {string} [lineBreakCharacter=undefined]
   * @returns {S10n}
   */
  normalizeLineBreaks(lineBreakCharacter = undefined) {
    lineBreakCharacter = lineBreakCharacter || this._modifiers.lineBreakCharacter;
    this.value = this.value.replace(/\r\n/g, lineBreakCharacter);
    const needle = this._modifiers.lineBreakCharacter === "\n" ? "\r" : "\n";
    this.value = this.value.replace(new RegExp(needle, "gu"), this._modifiers.lineBreakCharacter);
    return this;
  }
  /**
   * Removes whitespaces before and after any newline characters
   * @returns {S10n}
   */
  normalizeMultiline() {
    const preserveLineBreaksState = this._modifiers.preserveLineBreaks;
    this.preserveLineBreaks();
    this.value = this.value
      .replace(this._regexp("\r\\s+"), "\r")
      .replace(this._regexp("\n\\s+"), "\n")
      .replace(this._regexp("\\s+\r"), "\r")
      .replace(this._regexp("\\s+\n"), "\n");
    this._modifiers.preserveLineBreaks = preserveLineBreaksState;
    return this;
  }
  /**
   * Keeps only allowed listed characters
   * @param {string|RegExpConstructor} [allowedChars="-A-Za-z0-9_\\x20.,}{\\]\\[)("]
   * @param {string} [regexpFlags]
   * @returns {S10n}
   */
  keepOnlyCharset(allowedChars = "-A-Za-z0-9_\\x20.,}{\\]\\[)(", regexpFlags) {
    this.value = this.value.replace(
      allowedChars instanceof RegExp
        ? new RegExp(allowedChars, regexpFlags)
        : this._regexp(`[^${allowedChars}]`, regexpFlags),
      ""
    );
    return this;
  }
  /**
   * Keeps only what is allowed by a regexp
   * @param {string|RegExp} [allowedChars="[-A-Za-z0-9_\\x20.,}{\\]\\[)(]"]
   * @param {string} [regexpFlags]
   * @returns {S10n}
   */
  keepOnlyRegexp(allowedChars = "[-A-Za-z0-9_\\x20.,}{\\]\\[)(]", regexpFlags) {
    this.value = [
      ...this.value.matchAll(
        allowedChars instanceof RegExp ? new RegExp(allowedChars, regexpFlags) : this._regexp(allowedChars, regexpFlags)
      )
    ]
      .map(entry => entry[0])
      .join("");
    return this;
  }
  /**
   * Removes disallowed characters
   * @param {string|RegExp} disallowedChars
   * @param {string} [regexpFlags]
   * @returns {S10n}
   */
  remove(disallowedChars, regexpFlags) {
    return this.replace(
      disallowedChars instanceof RegExp
        ? new RegExp(disallowedChars, regexpFlags)
        : this._regexp(`[${disallowedChars}]`, regexpFlags),
      "",
      regexpFlags
    );
  }
  /**
   * Replaces a needle with a replacement string
   * @param {string|RegExp} needle
   * @param {string} [replacement=""]
   * @param {string} [regexpFlags]
   * @returns {S10n}
   */
  replace(needle, replacement = "", regexpFlags) {
    this.value = this.value.replace(
      needle instanceof RegExp ? new RegExp(needle, regexpFlags) : this._regexp(`${needle}`, regexpFlags),
      replacement
    );
    return this;
  }
  /**
   * Converts core value string to lower case
   * @returns {S10n}
   */
  toLowerCase() {
    this.value = this.value.toLowerCase();
    return this;
  }
  /**
   * Converts core value string to upper case
   * @returns {S10n}
   */
  toUpperCase() {
    this.value = this.value.toUpperCase();
    return this;
  }

  // Compound transformers
  /**
   * Keeps 0-9 characters only
   * @returns {S10n}
   */
  keepBase10Digits() {
    return this.keepOnlyCharset("0-9");
  }
  /**
   * Keeps 0-9, A-F and a-f characters only
   * @returns {S10n}
   */
  keepBase16Digits() {
    return this.keepOnlyCharset("0-9A-Fa-f");
  }
  /**
   * Keeps 0-9, A-F and a-f characters only.
   * Alias for S10n#keep16BaseDigits
   * @alias S10n#keep16BaseDigits
   * @returns {S10n}
   */
  keepHexDigits() {
    return this.keepBase16Digits();
  }
  /**
   * Minimizes whitespaces
   * @returns {S10n}
   */
  minimizeWhitespaces() {
    return this.normalizeLineBreaks()
      .mergeWhitespaces()
      .normalizeMultiline()
      .mergeLineBreaks()
      .trim()
      .trimLineBreaks();
  }

  // Semantic sanitizers
  /**
   * Keeps only characters as per typical popular email format
   * @returns {S10n}
   */
  keepOnlyEmailPopularCharset() {
    return this.keepOnlyCharset("A-Za-z0-9_@.-");
  }
  /**
   * Keeps only characters as per extended email format (popular + plus sign, parentheses)
   * @returns {S10n}
   */
  keepOnlyEmailExtendedCharset() {
    return this.keepOnlyCharset("A-Za-z0-9_@.+)(-");
  }
  /**
   * Keeps only characters from the charset as per RFC
   * @returns {S10n}
   */
  keepOnlyEmailRfcCharset() {
    return this.keepOnlyCharset("A-Za-z0-9_\\-@.+)( \":;<>\\\\,\\[\\]}{!#$%&'*/=?^`\\|~").trim();
  }
  /**
   * Keeps only a-z, A-Z, 0-9, _ and optionally replaces a space with a parametrized value
   * @param {string} [whiteSpaceReplacement=""]
   * @returns {S10n}
   */
  keepUsername(whiteSpaceReplacement = "") {
    const allowedChars = `a-zA-Z0-9_${whiteSpaceReplacement.length ? " " : ""}\\-`;
    return this.trim()
      .keepOnlyCharset(allowedChars)
      .mergeWhitespaces()
      .replace(" ", whiteSpaceReplacement);
  }
  /**
   * Keeps only a-z, A-Z, 0-9, _ and optionally replaces a space with a parametrized value
   * and converts all to lower case
   * @param {string} [whiteSpaceReplacement=""]
   * @returns {S10n}
   */
  keepUsernameLC(whiteSpaceReplacement = "") {
    return this.keepUsername(whiteSpaceReplacement).toLowerCase();
  }

  // Terminal methods

  // Output type casting
  /**
   * Returns value
   * @returns {string}
   */
  toString() {
    return this.value;
  }
  /**
   * Converts value to Number
   * @returns {number}
   */
  toNumber() {
    return this.value.length ? +this.value : 0;
  }
}

export default S10n;
