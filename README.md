# flowsql

Interfaz de base de datos en node.js basada en sqlite con soporte para listas y objetos referenciados.

## Índice

- [flowsql](#flowsql)
   - [Índice](#ndice)
   - [Instalación](#instalacin)
   - [API](#api)
      - [`Flowsql.constructor(options:Object)`](#flowsqlconstructoroptionsobject)
      - [`Flowsql.prototype._createRelationalTable(table:String, columnId:String, referredTable:String)`](#flowsqlprototype_createrelationaltabletablestring-columnidstring-referredtablestring)
      - [`Flowsql.prototype._ensureBasicMetadata()`](#flowsqlprototype_ensurebasicmetadata)
      - [`Flowsql.prototype._loadSchema()`](#flowsqlprototype_loadschema)
      - [`Flowsql.prototype._persistSchema()`](#flowsqlprototype_persistschema)
      - [`Flowsql.prototype._sqlForColumn(columnId:String, columnMetadata:Object)`](#flowsqlprototype_sqlforcolumncolumnidstring-columnmetadataobject)
      - [`Flowsql.prototype._sqlForInsertInto(table:String, row:Object)`](#flowsqlprototype_sqlforinsertintotablestring-rowobject)
      - [`Flowsql.prototype._sqlForInsertValues(table:String, row:Object)`](#flowsqlprototype_sqlforinsertvaluestablestring-rowobject)
      - [`Flowsql.prototype._sqlForWhere(table:String, filters:Array)`](#flowsqlprototype_sqlforwheretablestring-filtersarray)
      - [`Flowsql.prototype._validateFilters(table:String, filters:Array)`](#flowsqlprototype_validatefilterstablestring-filtersarray)
      - [`Flowsql.prototype._validateInstance(table:String, values:Object, operation:String)`](#flowsqlprototype_validateinstancetablestring-valuesobject-operationstring)
      - [`Flowsql.prototype.addColumn(table:String, columnId:String, partialSchema:Object)`](#flowsqlprototypeaddcolumntablestring-columnidstring-partialschemaobject)
      - [`Flowsql.prototype.addTable(table:String, partialSchema:Object)`](#flowsqlprototypeaddtabletablestring-partialschemaobject)
      - [`Flowsql.prototype.checkSchemaValidity(schema:Object)`](#flowsqlprototypecheckschemavalidityschemaobject)
      - [`Flowsql.prototype.connect()`](#flowsqlprototypeconnect)
      - [`Flowsql.prototype.deleteMany(table:String, filters:Array)`](#flowsqlprototypedeletemanytablestring-filtersarray)
      - [`Flowsql.prototype.deleteOne(table:String, id:String|Number)`](#flowsqlprototypedeleteonetablestring-idstringnumber)
      - [`Flowsql.prototype.dropColumn(table:String, columnId:String)`](#flowsqlprototypedropcolumntablestring-columnidstring)
      - [`Flowsql.prototype.dropTable(table:String)`](#flowsqlprototypedroptabletablestring)
      - [`Flowsql.prototype.extractSqlSchema()`](#flowsqlprototypeextractsqlschema)
      - [`Flowsql.prototype.insertMany(table:String, rows:Array)`](#flowsqlprototypeinsertmanytablestring-rowsarray)
      - [`Flowsql.prototype.insertOne(table:String, item:Object)`](#flowsqlprototypeinsertonetablestring-itemobject)
      - [`Flowsql.prototype.insertSql(sql:String)`](#flowsqlprototypeinsertsqlsqlstring)
      - [`Flowsql.prototype.renameColumn(table:String, columnId:String, newName:String)`](#flowsqlprototyperenamecolumntablestring-columnidstring-newnamestring)
      - [`Flowsql.prototype.renameTable(table:String, newName:String)`](#flowsqlprototyperenametabletablestring-newnamestring)
      - [`Flowsql.prototype.runSql(sql:String)`](#flowsqlprototyperunsqlsqlstring)
      - [`Flowsql.prototype.selectMany(table:String, filters:Array)`](#flowsqlprototypeselectmanytablestring-filtersarray)
      - [`Flowsql.prototype.selectOne(table:String, id:String|Number)`](#flowsqlprototypeselectonetablestring-idstringnumber)
      - [`Flowsql.prototype.trace(method:String, args:Array)`](#flowsqlprototypetracemethodstring-argsarray)
      - [`Flowsql.prototype.updateMany(table:String, filters:Array, values:Object)`](#flowsqlprototypeupdatemanytablestring-filtersarray-valuesobject)
      - [`Flowsql.prototype.updateOne(table:String, id:String|Number, values:Object)`](#flowsqlprototypeupdateonetablestring-idstringnumber-valuesobject)
      - [`new Flowsql.AssertionError(message:String)`](#new-flowsqlassertionerrormessagestring)
      - [`Flowsql.assertion(condition:boolean, errorMessage:String)`](#flowsqlassertionconditionboolean-errormessagestring)
      - [`Flowsql.copyObject(obj:Object)`](#flowsqlcopyobjectobjobject)
      - [`Flowsql.create(...args)`](#flowsqlcreateargs)
      - [`Flowsql.defaultDatabaseOptions:Object`](#flowsqldefaultdatabaseoptionsobject)
      - [`Flowsql.defaultOptions:Object`](#flowsqldefaultoptionsobject)
      - [`Flowsql.dependencies:Object`](#flowsqldependenciesobject)
      - [`Flowsql.escapeId(value:any)`](#flowsqlescapeidvalueany)
      - [`Flowsql.escapeValue(value:any)`](#flowsqlescapevaluevalueany)
      - [`Flowsql.getSqlType(columnType:String, columnMetadata:Object)`](#flowsqlgetsqltypecolumntypestring-columnmetadataobject)
      - [`Flowsql.knownOperators:Array`](#flowsqlknownoperatorsarray)
      - [`Flowsql.knownTypes:Array`](#flowsqlknowntypesarray)
   - [Uso](#uso)


## Instalación

```sh
npm i -s @allnulled/flowsql
```

## API

### `Flowsql.constructor(options:Object)`

Método que...





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

### `Flowsql.prototype._ensureBasicMetadata()`

Método que construye las tablas necesarias para gestionar los metadatos de `flowsql`.

Con este método se crea la tabla `Database_metadata` y se inserta el esquema con:

- `name=db.schema` este es el campo de la clave o id del parámetro del metadato.
- `value=...` iría el esquema de datos dentro en formato JSON

### `Flowsql.prototype._loadSchema()`

Método para cargar el `this.$schema` de la instancia `Flowsql` con el valor que hay en la base de datos, en `Database_metadata` con `name=db.schema`.

### `Flowsql.prototype._persistSchema()`

Método para actualizar el dato del esquema en la base de datos (tabla `Database_metadata`, clave `db.schema`) con el valor actual de la instancia Flowsql, en `this.$schema`. Se guarda en formato JSON.

Hace el proceso inverso de `Flowsql.prototype._loadSchema()`: de instancia a base de datos.

### `Flowsql.prototype._sqlForColumn(columnId:String, columnMetadata:Object)`

Método que devuelve el código `sql` que describe la columna especificada.

Consultará los valores:

- `columnMetadata.type`
- `columnMetadata.unique`
- `columnMetadata.nullable`
- `columnMetadata.defaultBySql`

### `Flowsql.prototype._sqlForInsertInto(table:String, row:Object)`

Método que devuelve el código `sql` correspondiente a `INSERT INTO (...)` dada una tabla y una fila.

Se consultarán y omitirán las columnas relacionales en el `this.$schema.tables[table]`.

### `Flowsql.prototype._sqlForInsertValues(table:String, row:Object)`

Método que devuelve el código `sql` correspondiente a ` VALUES (...)` de un `insert` dada una tabla y una fila.

Consultará y omitirá las columnas relacionales en el `this.$schema`.

### `Flowsql.prototype._sqlForWhere(table:String, filters:Array)`

Método que devuelve el código `sql` correspondiente a un `WHERE` de un select/update/delete.

El parámetro `filters:Array` tiene que ser un filtro aceptado por `Flowsql.prototype.selectMany(table, filters)`. Se explica más en profundidad en ese método.

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

Método que...

### `Flowsql.prototype.addTable(table:String, partialSchema:Object)`

Método que...

### `Flowsql.prototype.checkSchemaValidity(schema:Object)`

Método que...

### `Flowsql.prototype.connect()`

Método que...

### `Flowsql.prototype.deleteMany(table:String, filters:Array)`

Método que...

### `Flowsql.prototype.deleteOne(table:String, id:String|Number)`

Método que...

### `Flowsql.prototype.dropColumn(table:String, columnId:String)`

Método que...

### `Flowsql.prototype.dropTable(table:String)`

Método que...

### `Flowsql.prototype.extractSqlSchema()`

Método que...



### `Flowsql.prototype.insertMany(table:String, rows:Array)`

Método que...

### `Flowsql.prototype.insertOne(table:String, item:Object)`

Método que...

### `Flowsql.prototype.insertSql(sql:String)`

Método que...

### `Flowsql.prototype.renameColumn(table:String, columnId:String, newName:String)`

Método que...

### `Flowsql.prototype.renameTable(table:String, newName:String)`

Método que...

### `Flowsql.prototype.runSql(sql:String)`

Método que...

### `Flowsql.prototype.selectMany(table:String, filters:Array)`

Método que...

### `Flowsql.prototype.selectOne(table:String, id:String|Number)`

Método que...

### `Flowsql.prototype.trace(method:String, args:Array)`

Método que...

### `Flowsql.prototype.updateMany(table:String, filters:Array, values:Object)`

Método que...

### `Flowsql.prototype.updateOne(table:String, id:String|Number, values:Object)`

Método que...

### `new Flowsql.AssertionError(message:String)`

Método que...



### `Flowsql.assertion(condition:boolean, errorMessage:String)`

Método que...

### `Flowsql.copyObject(obj:Object)`

Método que...

### `Flowsql.create(...args)`

Método que...

### `Flowsql.defaultDatabaseOptions:Object`

Método que...

### `Flowsql.defaultOptions:Object`

Método que...

### `Flowsql.dependencies:Object`

Objeto que...

### `Flowsql.escapeId(value:any)`

Método que...

### `Flowsql.escapeValue(value:any)`

Método que...

### `Flowsql.getSqlType(columnType:String, columnMetadata:Object)`

Método que...

### `Flowsql.knownOperators:Array`

Array que...

### `Flowsql.knownTypes:Array`

Array que...

## Uso

Aquí se explicarán ejemplos de uso de la interfaz.