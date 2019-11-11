import utils from "./utils";
import modifiers from "./modifiers";
import customization from "./customization";
import elementaryTransformers from "./elementaryTransformers";
import compoundTransformers from "./compoundTransformers";
import semanticSanitizers from "./semanticSanitizers";
import outputTypeCast from "./outputTypeCast";

let customTransformers = {};

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

s10n.extend = function(methodName, method) {
  customTransformers[methodName] = method;
};

const initialize = function() {
  this.disregardLineBreaks();
  this._entities.whitespace = this._entities.whitespaceAny;
};

export default s10n;
