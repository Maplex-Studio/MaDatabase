# Maplex Database

A lightweight and intuitive wrapper around Sequelize that simplifies database setup and CRUD operations. Ideal for rapid prototyping, internal tools, and small to medium applications.

---

## ✨ Features

* ✅ **Simple Setup** – Just create an instance and connect
* 🔄 **Auto Schema Handling** – Auto-generates `id`, `createdAt`, and `updatedAt`
* 🔧 **Flexible Table Definitions** – Create and manage models easily
* 📥 **Easy Data Insertion** – Insert single or multiple records
* 🔍 **Basic Querying** – Fetch, count, and query by primary key
* 🛠️ **Update & Delete** – Easily update or remove records
* 📦 **Raw SQL Support** – Execute custom SQL queries
* 🔌 **Access Sequelize Internals** – Direct access to Sequelize models and instance

---

## 📦 Installation

```bash
npm install maplex-database sequelize sqlite3
```

---

## 🚀 Getting Started

```ts
import { Database, DataTypes } from "maplex-database";

async function main() {
  const db = new Database();

  await db.connect();

  db.createTable("User", {
    username: { type: DataTypes.STRING, unique: true },
    email: { type: DataTypes.STRING, unique: true },
    age: DataTypes.INTEGER,
  });

  await db.syncTables();

  await db.insert("User", {
    username: "john",
    email: "john@example.com",
    age: 25,
  });

  const users = await db.find("User", { where: { age: 25 } });
  console.log(users);
}

main();
```

---

## ⚙️ Configuration

### Database Options

```ts
const db = new Database({
  dialect: "sqlite",               // Optional (default)
  storage: "./database.sqlite",    // Path to SQLite file
  logging: false,                  // Show SQL logs (default: false)
});
```

### Supported Dialects

* ✅ SQLite (default)
* ✅ PostgreSQL (`npm install pg pg-hstore`)
* ✅ MySQL / MariaDB (`npm install mysql2` / `mariadb`)
* ✅ Microsoft SQL Server (`npm install tedious`)

---

## 📚 API Overview

### `new Database(options?)`

Create a new database instance.

### `await db.connect()`

Authenticate the connection.

### `await db.syncTables(force = false)`

Create or sync all defined tables.

* `force = true` will drop and recreate tables.

---

### Table Management

#### `db.createTable(tableName, schema, options?)`

Define a table/model.

```ts
db.createTable("User", {
  username: DataTypes.STRING,
  age: DataTypes.INTEGER,
});
```

**Note:** Adds `id`, `createdAt`, and `updatedAt` by default.

---

### Insert Methods

#### `await db.insert(tableName, data)`

Insert a single record.

#### `await db.insertMany(tableName, dataArray)`

Insert multiple records.

---

### Querying

#### `await db.find(tableName, options)`

Find all records matching options.

#### `await db.findOne(tableName, options)`

Find a single record matching options.

#### `await db.findById(tableName, id)`

Find a record by primary key.

#### `await db.count(tableName, options?)`

Count records matching conditions.

---

### Updating & Deleting

#### `await db.update(tableName, data, where, options?)`

Update records matching a `where` clause.

#### `await db.delete(tableName, where, options?)`

Delete records matching a `where` clause.

---

### Raw Queries

#### `await db.query(sql, options?)`

Execute raw SQL queries.

---

### Utility Methods

#### `db.getModel(tableName)`

Get the Sequelize model instance.

#### `db.getSequelize()`

Access the raw Sequelize instance.

#### `db.getTables()`

Get a list of all defined table names.

#### `db.getTableInfo(tableName)`

Return schema and associations of a table.

#### `await db.close()`

Close the database connection.

---

## ✅ Example

```ts
const db = new Database({ storage: "./app.sqlite" });

await db.connect();

db.createTable("Todo", {
  title: DataTypes.STRING,
  completed: { type: DataTypes.BOOLEAN, defaultValue: false },
});

await db.syncTables();

await db.insert("Todo", { title: "Finish README" });

const todos = await db.find("Todo");
console.log(todos);
```

---

## 📘 Notes

* All models are defined and cached internally.
* Timestamps and primary keys are added automatically.
* Error handling is built-in; failures will throw detailed exceptions.

---

## 📄 License

MIT License

