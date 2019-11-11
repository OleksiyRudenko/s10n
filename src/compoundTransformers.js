const compoundTransformers = {
  keepBase10Digits: function() {
    return this.keepOnlyCharset("0-9");
  },
  keepBase16Digits: function() {
    return this.keepOnlyCharset("0-9A-Fa-f");
  },
  minimizeWhitespaces: function() {
    return this.normalizeLineBreaks()
      .mergeWhitespaces()
      .normalizeMultiline()
      .mergeLineBreaks()
      .trim()
      .trimLineBreaks();
  }
};

compoundTransformers.keepHexDigits = compoundTransformers.keepBase16Digits;

export default compoundTransformers;
