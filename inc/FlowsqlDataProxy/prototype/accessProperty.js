/**
 * 
 * ### `async DataProxy.accessProperty(name:String):Promise<DataProxy»`
 * 
 * Método para cambiar el `$dataset` a una propiedad interna.
 * 
 * Si la 
 * 
 */
module.exports = async function(name) {
  if(Array.isArray(this.$dataset)) {
    const output = [];
    for(let indexRow=0; indexRow<this.$dataset.length; indexRow++) {
      const row = this.$dataset[indexRow];
      const value = row[name];
      if(Array.isArray(value)) {
        for(let indexItem=0; indexItem<value.length; indexItem++) {
          const item = value[indexItem];
          output.push(item);
        }
      } else {
        output.push(value);
      }
    }
    return output;
  }
  return this.$dataset[name];
};