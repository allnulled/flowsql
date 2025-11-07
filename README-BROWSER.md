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

### `FlowsqlBrowser.prototype.connect()`

Método que crea una instancia de `sqlite3` y actualiza el esquema.

Este método utiliza los siguientes parámetros:

- `this.$options.filename:String` como ruta al fichero `*.sqlite`
- `this.$options.databaseOptions:Object` como parámetros para la instancia `sqlite3`

Luego, además, asegura que existen los metadatos básicos en la base de datos con `Flowsql.prototype._ensureBasicMetadata()`.

Luego, además, recarga el esquema propio con el existente en la base de datos, con `Flowsql.prototype._loadSchema()`.

