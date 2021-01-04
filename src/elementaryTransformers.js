/**
 * @typedef { import("./s10n").s10nInstance } s10nInstance
 */

const elementaryTransformers = {
  trim: function() {
    this.value = this.value.replace(this._regexp("^\\s+|\\s+$"), "");
    return this;
  },
  trimLineBreaks: function() {
    // this method disregards _modifiers.preserveLineBreaks setting
    this.value = this.value.replace(/^[\r\n]+|[\r\n]+$/gu, "");
    return this;
  },
  mergeLineBreaks: function() {
    this.normalizeLineBreaks().replace(
      new RegExp(`${this._modifiers.lineBreakCharacter}+`, "g"),
      this._modifiers.lineBreakCharacter
    );
    return this;
  },
  normalizeWhitespaces: function() {
    this.value = this.value.replace(this._regexp("\\s"), " ");
    return this;
  },
  mergeWhitespaces: function() {
    this.normalizeWhitespaces();
    this.value = this.value.replace(this._regexp("\\s+"), " ");
    return this;
  },
  stripWhitespaces: function() {
    this.value = this.value.replace(this._regexp("\\s"), "");
    return this;
  },
  normalizeLineBreaks: function(lineBreakCharacter = undefined) {
    lineBreakCharacter = lineBreakCharacter || this._modifiers.lineBreakCharacter;
    this.value = this.value.replace(/\r\n/g, lineBreakCharacter);
    const needle = this._modifiers.lineBreakCharacter === "\n" ? "\r" : "\n";
    this.value = this.value.replace(new RegExp(needle, "gu"), this._modifiers.lineBreakCharacter);
    return this;
  },
  normalizeMultiline: function() {
    const preserveLineBreaksState = this._modifiers.preserveLineBreaks;
    this.preserveLineBreaks();
    this.value = this.value
      .replace(this._regexp("\r\\s+"), "\r")
      .replace(this._regexp("\n\\s+"), "\n")
      .replace(this._regexp("\\s+\r"), "\r")
      .replace(this._regexp("\\s+\n"), "\n");
    this._modifiers.preserveLineBreaks = preserveLineBreaksState;
    return this;
  },
  keepOnlyCharset: function(allowedChars = "-A-Za-z0-9_\\x20.,}{\\]\\[)(", regexpFlags) {
    this.value = this.value.replace(
      allowedChars instanceof RegExp
        ? new RegExp(allowedChars, regexpFlags)
        : this._regexp(`[^${allowedChars}]`, regexpFlags),
      ""
    );
    return this;
  },
  keepOnlyRegexp: function(allowedChars = "[-A-Za-z0-9_\\x20.,}{\\]\\[)(]", regexpFlags) {
    const matches = Array.from(
      this.value.matchAll(
        allowedChars instanceof RegExp ? new RegExp(allowedChars, regexpFlags) : this._regexp(allowedChars, regexpFlags)
      )
    );
    this.value = matches.map(entry => entry[0]).join("");
    return this;
  },
  remove: function(disallowedChars, regexpFlags) {
    return this.replace(
      disallowedChars instanceof RegExp
        ? new RegExp(disallowedChars, regexpFlags)
        : this._regexp(`[${disallowedChars}]`, regexpFlags),
      "",
      regexpFlags
    );
  },
  replace: function(needle, replacement = "", regexpFlags) {
    this.value = this.value.replace(
      needle instanceof RegExp ? new RegExp(needle, regexpFlags) : this._regexp(`${needle}`, regexpFlags),
      replacement
    );
    return this;
  },
  toLowerCase: function() {
    this.value = this.value.toLowerCase();
    return this;
  },
  toUpperCase: function() {
    this.value = this.value.toUpperCase();
    return this;
  }
};

export default elementaryTransformers;
