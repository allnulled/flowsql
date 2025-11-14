/**
 * 
 * ### `Flowsql.arrayContainsAnyOf(list1:Array, list2:Array):Boolean`
 * 
 * Método que comprueba si hay elementos comunes entre 2 listas de elementos.
 * 
 */
module.exports = function(a, b) {
  if (a.length > b.length) {
    [a, b] = [b, a]; // iterar la más corta
  }
  const set = new Set(b);
  for (let i = 0; i < a.length; i++) {
    if (set.has(a[i])) return true;
  }
  return false;
};