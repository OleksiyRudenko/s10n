const utils = {
  _regexp: function(pattern, flags = "gu") {
    return new RegExp(pattern.replace(/\\s/, this._entities.whitespace), flags);
  }
};

export default utils;
