const modifiers = {
  _modifiers: {
    preserveLineBreaks: false,
    lineBreakCharacter: "\n"
  },
  preserveLineBreaks: function() {
    this._modifiers.preserveLineBreaks = true;
    this._entities.whitespace = this._entities.whitespaceNotLineBreak;
    return this;
  },
  disregardLineBreaks: function() {
    this._modifiers.preserveLineBreaks = false;
    this._entities.whitespace = this._entities.whitespaceAny;
    return this;
  },
  setLineBreakCharacter: function(lineBreakCharacter = "\n") {
    this._modifiers.lineBreakCharacter = lineBreakCharacter;
    return this;
  }
};

export default modifiers;
