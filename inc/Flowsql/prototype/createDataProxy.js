module.exports = function(dataset, memory) {
  return new this.constructor.DataProxy(dataset, this, memory);
};