module.exports = function (sql) {
  if (this.$options.traceSql) {
    console.log("[sql]", sql);
  }
  return this.$database.prepare(sql).all();
};