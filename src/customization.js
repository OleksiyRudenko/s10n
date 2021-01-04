/**
 * @typedef { import("./s10n").s10nInstance } s10nInstance
 */

const customization = {
  apply: function(transformer, ...rest) {
    this.value = transformer(this.value, this, ...rest);
    return this;
  }
};

export default customization;
