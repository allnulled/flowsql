### `FlowsqlBrowser.constructor(options:Object)`

Método que construye una instancia `FlowsqlBrowser`.

El parámetro `options:Object` sobreescribirá las `this.constructor.defaultOptions`.

El parámetro `options.databaseOptions:Object` sobreescribirá las `this.constructor.defaultDatabaseOptions`.

Luego, además, llama a `this.connect()` directamente. Es decir que en el momento de crear la instancia, ya se abre la conexión sqlite.

### `FlowsqlBrowser.defaultOptions:Object`

```js
{
 trace: false,
 traceSql: false,
 filename: "db.sqlite"
}
```

### `Flowsql.dependencies:Object`

Objeto que sirve para inyectar framework externos en la instancia de `Flowsql`.

Tiene los siguientes valores:

```js
{

}
```

### `FlowsqlBrowser.prototype._compactResults(input:Array)`

Método para compactar los resultados de una query tipo `SELECT` en el entorno de navegador.

Este método hace homogénea la salida de `sql.js` en el browser y `better-sqlite3` en node.js.

Pasa de [{column,values}] ===> [{column,value},...]

### `FlowsqlBrowser.prototype.fetchSql(sql:string)`

En la versión de browser de `flowsql`, el `prototype.fetch` tiene que compactar los resultados para homogeneizar las salidas.

Para esto llama a `this._compactResults(data1)` si lo devuelto es un `Array`.

### `FlowsqlBrowser.prototype.insertSql(sql:string)`

En principio hace lo mismo, devuelve los ids insertados.

Este método creo que no está completado todavía, porque hay alguna diferencia con la otra API.

### `FlowsqlBrowser.prototype.runSql(sql:string)`

En principio hace lo mismo, porque este método no tiene que devolver nada.

Pero se sobreescribe para tener todas las entradas de SQL sobreescritas fácilmente..

### `FlowsqlBrowser.prototype.connect()`

Método que llama, en entorno browser, a `SQL = await initSqlJs({ locateFile: file => "sql-wasm.wasm" })`.

Después, llama a `this.$database = new SQL.Database(this.$options.databaseOptions)`.

Después hace el `_ensureBasicMetadata()` igual que en la versión de node.js.

Después hace el `_loadSchema()` igual que en la versión de node.js.

### `FlowsqlBrowser.prototype.dehydrate():String`

En la versión de node.js este método no existe, porque ya se está trabajando con un fichero `sqlite`.

En la versión de browser de `flowsql`, el `prototype.dehydrate` pasa la base de datos a string.

Esto lo hace llamando a 3 funciones:

 - `SqlDatabase.prototype.export()`
 - `String.fromCharCode(...exportedData)`
 - `btoa(charcodedData)`

### `FlowsqlBrowser.prototype.hydrate(base64:String):String`

En la versión de node.js este método no existe, porque ya se está trabajando con un fichero `sqlite`.

En la versión de browser de `flowsql`, el `prototype.hydrate` cambia la instancia de la base de datos según la base de datos resultante del string en base64 proporcionado.

Esto lo hace llamando a 3 funciones:

 - `Uint8Array.from(...)`
 - `atob(base64)`
 - `new SQL.Database(binaryData)`

#### `new Flowsql.DataProxy(dataset:Array, database:Flowsql|FlowsqlBrowser)`

Método para crear un data proxy de flowsql.

Los data proxy permiten iterar sobre un conjunto de datos mediante method chaining o procesar matrices de operaciones, entre otras.

Los data proxy pueden necesitar acceso a la base de datos, por lo cual se pide como segundo parámetro `database:Flowsql|FlowsqlBrowser`.

### `async DataProxy.prototype.map(callback):Promise<DataProxy>`

Método para hacer mapeos asíncronos.

### `DataProxy.prototype.mapSync():DataProxy`

Método para...

### `async DataProxy.prototype.mapByEval(code:String):Promise<DataProxy>`

Método para hacer mapeos asíncronos por evaluación de código en texto.

### `async DataProxy.prototype.filter(callback):Promise<DataProxy>`

Método para hacer filtrados asíncronos.

### `DataProxy.prototype.filterSync(callback:Function):DataProxy`

Método para...

### `async DataProxy.prototype.filterByEval(code:String):Promise<DataProxy»`

Método para...

### `async DataProxy.reduce():Promise<DataProxy»`

Método para...

### `DataProxy.prototype.reduceSync():DataProxy`

Método para...

### `async DataProxy.reduceByEval(code:String):Promise<DataProxy»`

Método para reducir como con `Array.prototype.reduce` pero asíncronamente y mediante un string de código js.

El método seguirá devolviendo un array, pero lo puedes decorar a placer.

### `async DataProxy.prototype.modify():Promise<DataProxy»`

Método para...

### `DataProxy.prototype.modifySync():DataProxy`

Método para...

### `async DataProxy.prototype.modifyByEval():Promise<DataProxy»`

Método para...

### `async DataProxy.amplify(callback:Function):Promise<DataProxy»`

Método para...

### `DataProxy.prototype.amplifySync(callback:Function):DataProxy`

Método para...

### `async DataProxy.prototype.amplifyByEval(code:String):Promise<DataProxy»`

Método para...

### `DataProxy.prototype.setMemory(keys:Object):DataProxy`

### `DataProxy.prototype.byMatrix(matrix:Array):DataProxy`

