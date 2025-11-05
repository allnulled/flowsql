





### `Flowsql.constructor(options:Object)`

Método que construye una instancia `Flowsql`.

El parámetro `options:Object` sobreescribirá las `this.constructor.defaultOptions`.

El parámetro `options.databaseOptions:Object` sobreescribirá las `this.constructor.defaultDatabaseOptions`.

Luego, además, llama a `this.connect()` directamente. Es decir que en el momento de crear la instancia, ya se abre la conexión sqlite.





### `Flowsql.prototype._createRelationalTable(table:String, columnId:String, referredTable:String)`

Método para generar el SQL y crear en la base de datos una tabla relacional.

Una tabla relacional es la que conecta una columna relacional con los ítems contenidos por esta.

Siempre tiene 3 campos:

- id_source: una referencia a la tabla origen
- id_destination: una referencia a la tabla referida
- sorter: un `Integer` con el número de prioridad, que a mayor, más prioridad, y que por defecto siempre es 1.

El parámetro `table:String` es el nombre de la tabla original.

El parámetro `columnId:String` es el nombre de la columna original.

El parámetro `referredTable:String` es el nombre de la tabla referida.

### `Flowsql.prototype._deleteMany(table:String, filters:Array, byMethod:String):Array`

Método que elimina múltiples filas a la vez.

Este método interno se usa por `Flowsql.prototype.deleteOne` y `Flowsql.prototype.deleteMany`. De ahí el parámetro `byMethod:String`.

El parámetro `filters:Array` es el mismo que en `Flowsql.prototype._selectMany`, ya que por debajo lo usa.

Devuelve un array con todos los ids eliminados.

### `Flowsql.prototype._ensureBasicMetadata()`

Método que construye las tablas necesarias para gestionar los metadatos de `flowsql`.

Con este método se crea la tabla `Database_metadata` y se inserta el esquema con:

- `name=db.schema` este es el campo de la clave o id del parámetro del metadato.
- `value=...` iría el esquema de datos dentro en formato JSON

### `Flowsql.prototype._insertMany(table:String, rows:Array, byMethod:String)`

Método que inserta múltiples filas a la vez.

Este método interno es usado por `Flowsql.prototype.insertOne` y `Flowsql.prototype.insertMany`. De ahí el parámetro `byMethod:String`.

Además de insertar el valor principal, insertará todos los elementos relacionales especificados también.

Devuelve un array con los ids de las filas (principales, no relacionales) insertadas.

### `Flowsql.prototype._loadSchema()`

Método para cargar el `this.$schema` de la instancia `Flowsql` con el valor que hay en la base de datos, en `Database_metadata` con `name=db.schema`.

### `Flowsql.prototype._persistSchema()`

Método para actualizar el dato del esquema en la base de datos (tabla `Database_metadata`, clave `db.schema`) con el valor actual de la instancia Flowsql, en `this.$schema`. Se guarda en formato JSON.

Hace el proceso inverso de `Flowsql.prototype._loadSchema()`: persiste de instancia a base de datos.

Por dentro, hace un `UPDATE` en sql.

### `Flowsql.prototype._selectMany(table:String, filters:Array, byMethod:String):Array`

Método que selecciona múltiples filas según criterios especificados en `filters:Array`.

Este método interno se usa en todos los métodos CRUD.

Retorna la instancia normal de la tabla, y, adjuntos, los campos que relacionales también.

Por lo cual, no es un `SELECT` simple en sql, sino que son (potencialmente, al menos) varios.

Los `filters:Array` son condiciones conjuntadas por un `AND` lógico.

Los filtros deben seguir la siguiente lógica:

- `filters[n][0]`: la columna contra la que se va a comprobar.
- `filters[n][1]`: el operador lógico que se va a usar. Se aceptan los especificados por `Flowsql.knownOperators`, que son:
   - `=`
   - `!=`
   - `<`
   - `<=`
   - `>`
   - `>=`
   - `is null`: no acepta complemento comparador
   - `is not null`: no acepta complemento comparador
   - `is like`: acepta String con `%` como en SQL.
   - `is not like`: acepta String con `%` como en SQL.
   - `is in`: el complemento comparador debe ser un Array
   - `is not in`: el complemento comparador debe ser un Array
   - `has`: solo contra columnas relacionales
   - `has not`: solo contra columnas relacionales
- `filters[n][2]`: el complemento comparador

Devuelve un array con las filas coincidentes.

### `Flowsql.prototype._sqlForColumn(columnId:String, columnMetadata:Object)`

Método que devuelve el código `sql` que describe la columna especificada.

Consultará los valores:

- `columnMetadata.type` que debe ser uno de los `Flowsql.knownTypes` donde se incluyen:
   - `"boolean"`
   - `"integer"`
   - `"real"`
   - `"string"`
   - `"blob"`
   - `"date"`
   - `"datetime"`
   - `"object"`
   - `"array"`
   - `"object-reference"`
   - `"array-reference"`
- `columnMetadata.unique` que por defecto sería `false`.
- `columnMetadata.nullable` que por defecto sería `false`, es decir, por defecto todas las columnas son `NOT NULL`.
- `columnMetadata.defaultBySql` que no tiene un valor por defecto.

### `Flowsql.prototype._sqlForInsertInto(table:String, row:Object)`

Método que devuelve el código `sql` correspondiente a `INSERT INTO (...)` dada una tabla y una fila.

Se consultarán y omitirán las columnas relacionales especificadas en el `this.$schema.tables[table].columns`.

### `Flowsql.prototype._sqlForInsertValues(table:String, row:Object)`

Método que devuelve el código `sql` correspondiente a ` VALUES (...)` de un `insert` dada una tabla y una fila.

Se consultarán y omitirán las columnas relacionales especificadas en el `this.$schema.tables[table].columns`.

### `Flowsql.prototype._sqlForUpdateSet(table:String, row:Object)`

Método que genera el código `sql` correspondiente a `UPDATE x SET x = y` dada una tabla y una fila.

Se consultarán y omitirán las columnas relacionales especificadas en el `this.$schema.tables[table].columns`.

### `Flowsql.prototype._sqlForWhere(table:String, filters:Array)`

Método que devuelve el código `sql` correspondiente a un `WHERE` de un select/update/delete.

El parámetro `filters:Array` tiene que ser un filtro aceptado por `Flowsql.prototype._selectMany(table, filters)`. Se explica más en profundidad en ese método.

### `Flowsql.prototype._updateMany(table:String, filters:Array, values:Object, byMethod:String)`

Método que actualiza múltiples filas a la vez.

Al encontrarse con columnas relacionales en `values:Object`, se eliminarán todos los registros relacionales y se volverán a insertar los nuevos especificados en la columna relacional de `values:Object`.

Este método se utiliza por `Flowsql.prototype.updateOne` y `Flowsql.prototype.updateMany`. De ahí el parámetro `byMethod:String`.

### `Flowsql.prototype._validateFilters(table:String, filters:Array)`

Método que sirve para validar los filtros que se le pasan a un `Flowsql.prototype.selectMany(table, filters)`.

Se comprobarán varios aspectos:

- que sea un array
- que contenga arrays
- que la columna exista en el esquema
- que el operador de regla exista entre los operadores conocidos
- que el operador de regla tenga coherencia con el tipo de la columna
- que el comparador de regla tenga coherencia con el tipo de la columna

### `Flowsql.prototype._validateInstance(table:String, values:Object, operation:String)`

Método que valida una instancia dado el nombre de la tabla y un objeto.

El tercer parámetro sirve para distinguir si está insertando o actualizando un dato, ya que hay algunas diferencias.

### `Flowsql.prototype.addColumn(table:String, columnId:String, partialSchema:Object)`

Método que añade una columna al esquema sql.

El parámetro `table:String` debe existir en el esquema.

El parámetro `columnId:String` no debe existir en el esquema de tabla correspondiente.

El parámetro `partialSchema:Object` debe cumplir las validaciones correspondientes a un esquema parcial de columna.

Por dentro, aparte de las validaciones pertinentes, este método:

- Desactiva las foreign keys de la base de datos.
- Renombra la tabla original con un nombre temporal.
- Crea la misma tabla con el nombre original y la nueva columna.
- Inserta todos los registros originales en la nueva tabla.
- Elimina la tabla original con nombre temporal.
- Activa otra vez las foreign keys.
- Crea las tablas relacionales pertinentes.
- Cambia el esquema interno (`this.$schema.tables[table]`) con el proporcionado.
- Persiste el nuevo esquema en la base de datos

Esto se hace así porque el sql no permite añadir limpiamente una columna con claves foráneas.

### `Flowsql.prototype.addTable(table:String, partialSchema:Object)`

Método que añade una nueva tabla al esquema sql.

El parámetro `table:String` debe existir en el esquema.

El parámetro `partialSchema:Object` debe cumplir con las validaciones correspondientes a un esquema parcial de tabla.

Además de crear la tabla principal, se crearán las tablas relacionales correspondientes a las columnas relacionales especificadas en `partialSchema:Object`.

### `Flowsql.prototype.checkSchemaValidity(schema:Object)`

Método que comprueba la validez de un esquema.

El parámetro `schema:Object` debe cumplir las validaciones correspondientes.

En este método se comprueba que:

- `schema:Object` es un Object
- `schema.tables:Object` es un Object
- `schema.tables[table]:Object` es un Object
- `schema.tables[table].columns:Object` es un Object
- `schema.tables[table].columns[columnId]:Object` es un Object
- `schema.tables[table].columns[columnId].type:String` es un String
- `schema.tables[table].columns[columnId].type:String` es un tipo conocido por `Flowsql.knownTypes`
- `schema.tables[table].columns[columnId].unique:Boolean` es un Boolean o no existe
- `schema.tables[table].columns[columnId].nullable:Boolean` es un Boolean o no existe
- `schema.tables[table].columns[columnId].defaultBySql:String` es un String o no existe
- `schema.tables[table].columns[columnId].defaultByJs:String` es un String o no existe
- `schema.tables[table].columns[columnId].maxLength:Number` es un Number o no existe
- Si la columna es un `object-reference` o un `array-reference`:
   - `columnMetadata.referredTable` es un String
   - `columnMetadata.referredTable` existe en `this.$schema.tables` como identificador de tabla.

Si alguna validación falla, lanza un error especificando el caso de fallo.

### `Flowsql.prototype.connect()`

Método que crea una instancia de `sqlite3` y actualiza el esquema.

Este método utiliza los siguientes parámetros:

- `this.$options.filename:String` como ruta al fichero `*.sqlite`
- `this.$options.databaseOptions:Object` como parámetros para la instancia `sqlite3`

Luego, además, asegura que existen los metadatos básicos en la base de datos con `Flowsql.prototype._ensureBasicMetadata()`.

Luego, además, recarga el esquema propio con el existente en la base de datos, con `Flowsql.prototype._loadSchema()`.

### `Flowsql.prototype.deleteMany(table:String, filters:Array):Array`

Método que elimina varias filas de golpe.

Este método llama a `Flowsql.prototype._deleteMany` por debajo.

Devuelve los ids de las filas eliminadas.

### `Flowsql.prototype.deleteOne(table:String, id:String|Number):Number`

Método que elimina 1 fila basándose en su campo `id`.

Este método llama a `Flowsql.prototype._deleteMany` por debajo.

Devuelve el id de la fila eliminada.

### `Flowsql.prototype.dropColumn(table:String, columnId:String)`

Método que elimina una columna de una tabla.

El parámetro `table:String` debe existir como tabla en el esquema de `this.$schema.tables`.

El parámetro `columnId:String` debe existir como columna en el esquema de `this.$schema.tables[table].columns`.

Si la columna es relacional, eliminará la tabla relacional entera.

### `Flowsql.prototype.dropTable(table:String)`

Método que elimina una tabla del esquema.

El parámetro `table:String` debe existir como tabla en el `this.$schema.tables`.

Si encuentra columnas relacionales dentro de la tabla, eliminará todas las tablas relacionales.

### `Flowsql.prototype.extractSqlSchema():Object`

Método que extrae el esquema del `sql`, no del `this.$schema`.

Esto se ha utilizado solamente con fines de debugging, en el framework no se utiliza, pero puede ser interesante para comprender la estructura `sql` que subyace al esquema.

### `Flowsql.prototype.fetchSql(sql:String):Array`

Método que ejecuta una sentencia sql de tipo `SELECT` y devuelve los registros.

Si `this.$options.traceSql` está en `true` imprimirá el código sql a ejecutar.

Devuelve un array con todos los elementos coincidentes.

### `Flowsql.prototype.insertMany(table:String, rows:Array):Array<Number>`

Método que inserta múltiples filas de golpe.

Por debajo llamara a `Flowsql.prototype._insertMany`.

Devuelve un array con todos los ítems insertados.

### `Flowsql.prototype.insertOne(table:String, item:Object):Number`

Método que inserta una fila.

Por debajo llama a `Flowsql.prototype._insertMany` pasándole `item:Object` dentro de un array, de 1 solo ítem.

Devuelve el identificador de la nueva fila recién insertada.

### `Flowsql.prototype.insertSql(sql:String):Number`

Método que ejecuta un `INSERT` en sql y devuelve el último id insertado.

### `Flowsql.prototype.renameColumn(table:String, columnId:String, newName:String)`

Método que renombra una columna del esquema.

El parámetro `table:String` debe ser una tabla del esquema.

El parámetro `columnId:String` debe ser una columna del esquema de la tabla.

El parámetro `newName:String` no puede ser una columna del esquema de la tabla.

### `Flowsql.prototype.renameTable(table:String, newName:String)`

Método que renombra una tabla del esquema.

El parámetro `table:String` debe ser una tabla del esquema.

El parámetro `newName:String` no puede ser una tabla del esquema.

Hará un `ALTER TABLE x RENAME TO y` a nivel de sql y cambiará y persistirá los cambios del esquema del `this.$schema`.

### `Flowsql.prototype.runSql(sql:String)`

Método que ejecuta un sql, sin devolver nada específico.

### `Flowsql.prototype.selectMany(table:String, filters:Array):Array`

Método que selecciona múltiples filas de una tabla.

Por debajo, usa `Flowsql.prototype._selectMany`.

### `Flowsql.prototype.selectOne(table:String, id:String|Number):Object`

Método que selecciona una fila de una tabla basándose en su id.

Por debajo, usa `Flowsql.prototype._selectMany`.

### `Flowsql.prototype.trace(method:String, args:Array)`

Método que imprime las trazas de los métodos llamados.

Utiliza el parámetro `this.$options.trace` para saber si debe o no imprimirlos.

### `Flowsql.prototype.updateMany(table:String, filters:Array, values:Object)`

Método que actualiza varias filas de golpe.

Por debajo utiliza `Flowsql.prototype._updateMany`.

### `Flowsql.prototype.updateOne(table:String, id:String|Number, values:Object)`

Método que actualiza una fila basándose en su id.

Por debajo utiliza `Flowsql.prototype._updateMany`.

### `new Flowsql.AssertionError(message:String)`

Clase que extiende de `Error`. Sirve para especificar errores de tipo aserción.

### `Flowsql.arrayContainsAnyOf(list1:Array, list2:Array):Boolean`

Método que comprueba si hay elementos comunes entre 2 listas de elementos.

### `Flowsql.assertion(condition:boolean, errorMessage:String)`

Método que hace una aserción y, de no cumplirse, lanza un mensaje de error.

Es un método utilitario usado por muchas partes de la aplicación.

Lanza errores de tipo `AssertionError`.

### `Flowsql.copyObject(obj:Object)`

Método que copia un objeto JSON y lo devuelve.

Utiliza `JSON.parse(JSON.stringify(obj))`.

### `Flowsql.create(...args)`

Método que construye una instancia con `Flowsql.constructor`.

Es un *wrapper* del constructor, para no tener que usar `new`.

### `Flowsql.defaultDatabaseOptions:Object`

Objeto con las opciones que se van a pasar a `better-sqlite3` por defecto.

Tiene estos valores:

```js
{
  readonly: false,
  fileMustExist: false,
  timeout: 5000,
  verbose: (...args) => { },
}
```

### `Flowsql.defaultOptions:Object`

Objeto con las opciones pasados al constructor `Flowsql.constructor` por defecto.

Tiene estos valores:

```js
{
  trace: false,
  traceSql: false,
  filename: require("path").resolve(process.cwd(), "db.sqlite"),
}
```

### `Flowsql.dependencies:Object`

Objeto que sirve para inyectar framework externos en la instancia de `Flowsql`.

Tiene los siguientes valores:

```js
{
  sqlite3: require("better-sqlite3"),
}
```

### `Flowsql.escapeId(value:any)`

Método que sirve para escapar identificadores en la sintaxis sql.

### `Flowsql.escapeValue(value:any)`

Método que escapa valores en la sintaxis sql.

### `Flowsql.getSqlType(columnType:String, columnMetadata:Object)`

Método que devuelve el código sql correspondiente a un tipo del `this.$schema[table].columns[columnId].type`.

Este método mapea los tipos de `flowsql` a `sql`.

Solo acepta los tipos:

 - `boolean`: a `INTEGER`
 - `real`: a `REAL`
 - `integer`: a `BLOB`
 - `string`: a `TEXT` o `VARCHAR`
 - `blob`: a `BLOB`
 - `date`: a `DATE`
 - `datetime`: a `DATETIME`
 - `object`: a `TEXT`
 - `array`: a `TEXT`
 - `object-reference`: a `INTEGER`
 - `array-reference`: este tipo no se acepta por este método, se procesan por otro lado.

### `Flowsql.knownOperators:Array`

Array que contiene los operadores conocidos por `flowsql`.

Tiene los siguientes valores:

```js
[
  "=",
  "!=",
  "<",
  "<=",
  ">",
  ">=",
  "is null",
  "is not null",
  "is in",
  "is not in",
  "is like",
  "is not like",
  "has",
  "has not",
];
```

### `Flowsql.knownTypes:Array`

Array que contiene los tipos conocidos por `flowsql`.

Tiene los siguientes valores:
```js
[
  "boolean",
  "integer",
  "real",
  "string",
  "blob",
  "date",
  "datetime",
  "object",
  "array",
  "object-reference",
  "array-reference",
];
```

