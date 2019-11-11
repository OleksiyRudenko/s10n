const semanticSanitizers = {
  keepOnlyEmailPopularCharset: function() {
    return this.keepOnlyCharset("A-Za-z0-9_@.-");
  },
  keepOnlyEmailExtendedCharset: function() {
    return this.keepOnlyCharset("A-Za-z0-9_@.+)(-");
  },
  keepOnlyEmailRfcCharset: function() {
    return this.keepOnlyCharset("A-Za-z0-9_\\-@.+)( \":;<>\\\\,\\[\\]}{!#$%&'*/=?^`\\|~").trim();
  },
  keepUsername: function(whiteSpaceReplacement = "") {
    const allowedChars = `a-zA-Z0-9_${whiteSpaceReplacement.length ? " " : ""}\\-`;
    return this.trim()
      .keepOnlyCharset(allowedChars)
      .mergeWhitespaces()
      .replace(" ", whiteSpaceReplacement);
  },
  keepUsernameLC: function(whiteSpaceReplacement = "") {
    return this.keepUsername(whiteSpaceReplacement).toLowerCase();
  }
};

export default semanticSanitizers;
