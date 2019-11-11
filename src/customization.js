const customization = {
  apply: function(transformer, ...rest) {
    this.value = transformer(this.value, this, ...rest);
    return this;
  }
};

export default customization;
