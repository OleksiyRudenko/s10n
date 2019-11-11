const outputTypeCast = {
  toString: function() {
    return this.value;
  },
  toNumber: function() {
    return this.value.length ? +this.value : 0;
  }
};

export default outputTypeCast;
