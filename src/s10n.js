import utils from "./utils";
import modifiers from "./modifiers";
import customization from "./customization";
import elementaryTransformers from "./elementaryTransformers";
import compoundTransformers from "./compoundTransformers";
import semanticSanitizers from "./semanticSanitizers";
import outputTypeCast from "./outputTypeCast";

let customTransformers = {};

/**
 * @typedef {{
 *
 * value: string,
 * _initialize: initialize,
 * _entities: {whitespaceNotLineBreak: string, whitespace: undefined|string, whitespaceAny: string},
 *
 * _regexp: function(*, *=): RegExp,
 *
 * _modifiers: {preserveLineBreaks: boolean, lineBreakCharacter: string},
 * preserveLineBreaks: function(): s10nInstance,
 * disregardLineBreaks: function(): s10nInstance,
 * setLineBreakCharacter: function(*=): s10nInstance,
 *
 * apply: function(function(string, s10nInstance, ...[*]):string, ...[*]): s10nInstance,
 *
 * trim: function(): s10nInstance,
 * trimLineBreaks: function(): s10nInstance,
 * mergeLineBreaks: function(): s10nInstance,
 * normalizeWhitespaces: function(): s10nInstance,
 * mergeWhitespaces: function(): s10nInstance,
 * stripWhitespaces: function(): s10nInstance,
 * normalizeLineBreaks: function(*=): s10nInstance,
 * normalizeMultiline: function(): s10nInstance,
 * keepOnlyCharset: function(*=, *=): s10nInstance,
 * keepOnlyRegexp: function(*=, *=): s10nInstance,
 * remove: function(*=, *=): s10nInstance,
 * replace: function(*=, *=, *=): s10nInstance,
 * toLowerCase: function(): s10nInstance,
 * toUpperCase: function(): s10nInstance,
 *
 * keepBase10Digits: function(): s10nInstance,
 * keepBase16Digits: function(): s10nInstance,
 * keepHexDigits: function(): s10nInstance,
 * minimizeWhitespaces: function(): s10nInstance,
 *
 * keepOnlyEmailPopularCharset: function(): s10nInstance,
 * keepOnlyEmailExtendedCharset: function(): s10nInstance,
 * keepOnlyEmailRfcCharset: function(): s10nInstance,
 * keepUsername: function(*=): s10nInstance,
 * keepUsernameLC: function(*=): s10nInstance,
 *
 * toString: function(): string,
 * toNumber: function(): number
 *
 * }} s10nInstance
 */

/**
 * s10n constructor
 * @param input
 * @returns {s10nInstance}
 */
const s10n = function(input = "") {
  const s10n = {
    value: input.toString(),
    _initialize: initialize,
    _entities: {
      whitespaceAny: "[\\s\\u200B\\u200C\\u200D\\u2060\\uFEFF\\xA0\\t]",
      whitespaceNotLineBreak: "(?:(?![\\n|\\r])[\\s\\u200B\\u200C\\u200D\\u2060\\uFEFF\\xA0\\t])",
      whitespace: undefined
    },
    ...utils,
    ...modifiers,
    ...customization,
    ...elementaryTransformers,
    ...compoundTransformers,
    ...semanticSanitizers,
    ...outputTypeCast,
    ...customTransformers
  };

  s10n._initialize();

  return s10n;
};

/**
 * @callback extensionCallback
 */

/**
 * Extends s10n instance set of transformation/sanitization methods
 * @param {string} methodName
 * @param {function():s10nInstance} method
 */
s10n.extend = function(methodName, method) {
  customTransformers[methodName] = method;
};

/**
 * Initializes s10n instance object at construction time
 */
const initialize = function() {
  this.disregardLineBreaks();
  this._entities.whitespace = this._entities.whitespaceAny;
};

export default s10n;
