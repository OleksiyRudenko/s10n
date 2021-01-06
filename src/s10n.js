import S10n from "./s10n.class";

/**
 * Creates an s10n object
 * @param {string} [input=""]
 * @returns {S10n}
 */
const s10n = function(input = "") {
  return new S10n(input);
};

/**
 * This callback can take arbitrary arguments. Must return <this> if chainable
 * or an arbitrary value if terminal
 * @callback s10nExtensionCallback
 * @param {...*} arbitraryArguments
 * @returns {S10n|*}
 */

/**
 * Extends s10n instance set of transformation/sanitization methods
 * @name s10n.extend
 * @param {string} methodName
 * @param {s10nExtensionCallback} method
 */
s10n.extend = function(methodName, method) {
  S10n.prototype[methodName] = method;
};

export default s10n;
