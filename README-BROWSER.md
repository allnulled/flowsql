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

### `await FlowsqlBrowser.prototype._ensureBasicMetadata():Promise`

Método que construye las tablas necesarias para gestionar los metadatos de `flowsql`.

Con este método se crea la tabla `Database_metadata` y se inserta el esquema con:

- `name=db.schema` este es el campo de la clave o id del parámetro del metadato.
- `value=...` iría el esquema de datos dentro en formato JSON

### `FlowsqlBrowser.prototype._loadSchema()`

Método para cargar el `this.$schema` de la instancia `Flowsql` con el valor que hay en la base de datos, en `Database_metadata` con `name=db.schema`.

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

Método que crea una instancia de `sqlite3` y actualiza el esquema.

Este método utiliza los siguientes parámetros:

- `this.$options.filename:String` como ruta al fichero `*.sqlite`
- `this.$options.databaseOptions:Object` como parámetros para la instancia `sqlite3`

Luego, además, asegura que existen los metadatos básicos en la base de datos con `Flowsql.prototype._ensureBasicMetadata()`.

Luego, además, recarga el esquema propio con el existente en la base de datos, con `Flowsql.prototype._loadSchema()`.

