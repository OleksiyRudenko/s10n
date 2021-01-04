/**
 * @typedef { import("./s10n").s10nInstance } s10nInstance
 */

const utils = {
  _regexp: function(pattern, flags = "gu") {
    return new RegExp(pattern.replace(/\\s/, this._entities.whitespace), flags);
  }
};

export default utils;
