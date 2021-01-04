/**
 * @typedef { import("./s10n").s10nInstance } s10nInstance
 */

const outputTypeCast = {
  toString: function() {
    return this.value;
  },
  toNumber: function() {
    return this.value.length ? +this.value : 0;
  }
};

export default outputTypeCast;
