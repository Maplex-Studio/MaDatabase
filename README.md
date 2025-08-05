# MaDatabase

A simple, powerful wrapper around Sequelize that makes database operations intuitive and straightforward. Perfect for rapid prototyping and small to medium applications.

## Features

- 🚀 **Simple Setup** - Get started with just a few lines of code
- 🔍 **Powerful Search** - Multiple search methods with advanced filtering
- 📊 **Easy CRUD** - Intuitive create, read, update, delete operations
- 🗂️ **Auto Schema** - Automatic ID, timestamps, and table management
- 💾 **SQLite by Default** - Zero configuration database setup
- 🔧 **Sequelize Compatible** - Access underlying Sequelize for advanced features

## Installation

```bash
npm install @maplex-studio/madatabase sequelize sqlite3 path
```

## Quick Start

```javascript
import { Database, DataTypes } from '@maplex-studio/madatabase';

async function main() {
  // Create database instance
  const db = new Database();
  
  // Connect to database
  await db.connect();
  
  // Create a table
  db.createTable('User', {
    username: { type: DataTypes.STRING, unique: true },
    email: { type: DataTypes.STRING, unique: true },
    age: DataTypes.INTEGER
  });
  
  // Sync tables to database
  await db.syncTables();
  
  // Insert data
  await db.insert('User', { 
    username: 'john', 
    email: 'john@example.com', 
    age: 25 
  });
  
  // Search data
  const users = await db.search('User', { age: 25 });
  console.log(users);
}

main().catch(console.error);
```

## Configuration

### Database Options

```javascript
const db = new Database({
  dialect: 'sqlite',                    // Database type
  storage: './myapp.sqlite',            // SQLite file path
  logging: false,                       // Disable SQL logging
  host: 'localhost',                    // For other databases
  port: 5432,                          // Database port
  username: 'user',                    // Database user
  password: 'pass',                    // Database password
  database: 'mydb'                     // Database name
});
```

### Supported Databases

- **SQLite** (default) - No setup required
- **PostgreSQL** - `npm install pg pg-hstore`
- **MySQL** - `npm install mysql2`
- **MariaDB** - `npm install mariadb`
- **Microsoft SQL Server** - `npm install tedious`

## API Reference

### Connection Management

#### `new Database(options)`
Create a new database instance.

```javascript
const db = new Database({
  storage: './myapp.sqlite',
  logging: false
});
```

#### `await db.connect()`
Establish connection to the database.

```javascript
const connected = await db.connect();
if (connected) {
  console.log('Connected successfully!');
}
```

#### `await db.close()`
Close the database connection.

```javascript
await db.close();
```

### Table Management

#### `db.createTable(tableName, schema, options)`
Define a table structure.

```javascript
db.createTable('User', {
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  email: DataTypes.STRING,
  age: DataTypes.INTEGER,
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});
```

**Note:** `id`, `createdAt`, and `updatedAt` fields are added automatically.

#### `await db.syncTables(force)`
Create tables in the database.

```javascript
await db.syncTables();        // Create missing tables
await db.syncTables(true);    // Drop and recreate all tables
```

### Data Operations

#### `await db.insert(tableName, data)`
Insert a single record.

```javascript
const user = await db.insert('User', {
  username: 'alice',
  email: 'alice@example.com',
  age: 30
});
console.log(user.id); // Auto-generated ID
```

#### `await db.insertMany(tableName, dataArray)`
Insert multiple records at once.

```javascript
await db.insertMany('User', [
  { username: 'bob', email: 'bob@example.com', age: 22 },
  { username: 'carol', email: 'carol@example.com', age: 28 }
]);
```

#### `await db.update(tableName, data, where)`
Update existing records.

```javascript
// Update single field
await db.update('User', { age: 26 }, { username: 'alice' });

// Update multiple fields
await db.update('User', 
  { age: 35, isActive: false }, 
  { email: 'alice@example.com' }
);
```

#### `await db.delete(tableName, where)`
Delete records.

```javascript
// Delete specific user
await db.delete('User', { username: 'alice' });

// Delete multiple users
await db.delete('User', { isActive: false });
```

### Search & Query Methods

#### `await db.search(tableName, conditions)`
Simple search with exact matches.

```javascript
// Find users with specific age
const users = await db.search('User', { age: 25 });

// Multiple conditions (AND)
const activeUsers = await db.search('User', { 
  age: 25, 
  isActive: true 
});
```

#### `await db.searchText(tableName, field, searchTerm)`
Search for text within a field (partial matching).

```javascript
// Find users whose username contains 'john'
const users = await db.searchText('User', 'username', 'john');

// Case-insensitive search
const posts = await db.searchText('Post', 'title', 'database');
```

#### `await db.advancedSearch(tableName, conditions)`
Advanced search with operators.

```javascript
// Age greater than 25
const users = await db.advancedSearch('User', {
  age: { gt: 25 }
});

// Age between 18 and 65
const adults = await db.advancedSearch('User', {
  age: { gte: 18, lte: 65 }
});

// Username contains 'admin' AND age > 21
const adminUsers = await db.advancedSearch('User', {
  username: { like: '%admin%' },
  age: { gt: 21 }
});
```

**Available Operators:**
- `gt` - greater than
- `gte` - greater than or equal
- `lt` - less than
- `lte` - less than or equal
- `ne` - not equal
- `like` - pattern matching (use with % wildcards)
- `in` - value in array
- `between` - between two values

#### `await db.searchFields(tableName, conditions, fields)`
Search and return only specific fields.

```javascript
// Only return username and email
const users = await db.searchFields('User', 
  { isActive: true }, 
  ['username', 'email']
);
```

#### `await db.searchPaginated(tableName, conditions, page, limit)`
Search with pagination support.

```javascript
// Get page 2 with 10 results per page
const result = await db.searchPaginated('User', 
  { isActive: true }, 
  2,  // page number
  10  // results per page
);

console.log(result.data);     // Array of results
console.log(result.total);    // Total count
console.log(result.page);     // Current page
console.log(result.pages);    // Total pages
console.log(result.hasMore);  // More pages available?
```

### Utility Methods

#### `await db.findOne(tableName, options)`
Find a single record.

```javascript
const user = await db.findOne('User', { 
  where: { username: 'alice' } 
});
```

#### `await db.findById(tableName, id)`
Find record by primary key.

```javascript
const user = await db.findById('User', 5);
```

#### `await db.count(tableName, options)`
Count records.

```javascript
const totalUsers = await db.count('User');
const activeUsers = await db.count('User', { 
  where: { isActive: true } 
});
```

#### `await db.query(sql, options)`
Execute raw SQL queries.

```javascript
const { results } = await db.query(
  'SELECT username, COUNT(*) as post_count FROM users u JOIN posts p ON u.id = p.userId GROUP BY u.id'
);
```

#### `db.getTables()`
Get list of all defined tables.

```javascript
const tables = db.getTables();
console.log(tables); // ['User', 'Post', 'Comment']
```

#### `db.getTableInfo(tableName)`
Get detailed information about a table.

```javascript
const info = db.getTableInfo('User');
console.log(info.attributes); // Field definitions
```

## Data Types

Import `DataTypes` for field definitions:

```javascript
const { Database, DataTypes } = require('easy-database');

db.createTable('Product', {
  name: DataTypes.STRING,
  description: DataTypes.TEXT,
  price: DataTypes.DECIMAL(10, 2),
  quantity: DataTypes.INTEGER,
  isAvailable: DataTypes.BOOLEAN,
  launchDate: DataTypes.DATE,
  metadata: DataTypes.JSON,
  categories: DataTypes.ARRAY(DataTypes.STRING), // PostgreSQL only
});
```

**Common Data Types:**
- `DataTypes.STRING` - Variable length string
- `DataTypes.TEXT` - Long text
- `DataTypes.INTEGER` - Integer number
- `DataTypes.DECIMAL(precision, scale)` - Decimal number
- `DataTypes.BOOLEAN` - True/false
- `DataTypes.DATE` - Date and time
- `DataTypes.JSON` - JSON data (not supported in all databases)

## Examples

### User Management System

```javascript
const { Database, DataTypes } = require('easy-database');

async function createUserSystem() {
  const db = new Database({ storage: './users.sqlite' });
  await db.connect();

  // Define tables
  db.createTable('User', {
    username: { type: DataTypes.STRING, unique: true },
    email: { type: DataTypes.STRING, unique: true },
    password: DataTypes.STRING,
    role: { type: DataTypes.STRING, defaultValue: 'user' },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    lastLogin: DataTypes.DATE
  });

  db.createTable('Post', {
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    published: { type: DataTypes.BOOLEAN, defaultValue: false },
    userId: {
      type: DataTypes.INTEGER,
      references: { model: 'User', key: 'id' }
    }
  });

  await db.syncTables();

  // Create admin user
  await db.insert('User', {
    username: 'admin',
    email: 'admin@example.com',
    password: 'hashedpassword',
    role: 'admin'
  });

  // Find admin user
  const admin = await db.search('User', { role: 'admin' });
  
  // Create a post
  await db.insert('Post', {
    title: 'Welcome Post',
    content: 'Welcome to our platform!',
    published: true,
    userId: admin[0].id
  });

  // Search published posts
  const publishedPosts = await db.search('Post', { published: true });
  
  // Advanced search: users who logged in recently
  const recentUsers = await db.advancedSearch('User', {
    lastLogin: { 
      gt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) 
    }
  });

  return db;
}
```

### E-commerce Product Catalog

```javascript
async function createProductCatalog() {
  const db = new Database({ storage: './products.sqlite' });
  await db.connect();

  db.createTable('Category', {
    name: { type: DataTypes.STRING, unique: true },
    description: DataTypes.TEXT
  });

  db.createTable('Product', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.DECIMAL(10, 2),
    stock: DataTypes.INTEGER,
    categoryId: {
      type: DataTypes.INTEGER,
      references: { model: 'Category', key: 'id' }
    }
  });

  await db.syncTables();

  // Add categories
  const electronics = await db.insert('Category', {
    name: 'Electronics',
    description: 'Electronic devices and gadgets'
  });

  // Add products
  await db.insertMany('Product', [
    {
      name: 'iPhone 15',
      description: 'Latest iPhone model',
      price: 999.99,
      stock: 50,
      categoryId: electronics.id
    },
    {
      name: 'MacBook Pro',
      description: 'Professional laptop',
      price: 1999.99,
      stock: 25,
      categoryId: electronics.id
    }
  ]);

  // Search products
  const expensiveProducts = await db.advancedSearch('Product', {
    price: { gt: 1000 }
  });

  const searchResults = await db.searchText('Product', 'name', 'iPhone');
  
  return db;
}
```

## Advanced Usage

### Access Underlying Sequelize

For advanced operations, access the underlying Sequelize instance:

```javascript
const sequelize = db.getSequelize();
const UserModel = db.getModel('User');

// Use Sequelize directly
const users = await UserModel.findAll({
  include: ['Posts'],
  order: [['createdAt', 'DESC']]
});
```

### Relationships

Define relationships between tables:

```javascript
// After creating tables
const User = db.getModel('User');
const Post = db.getModel('Post');

User.hasMany(Post, { foreignKey: 'userId' });
Post.belongsTo(User, { foreignKey: 'userId' });

// Now you can use includes
const usersWithPosts = await db.find('User', {
  include: [{ model: Post }]
});
```

## Error Handling

The database class includes built-in error handling:

```javascript
try {
  await db.insert('User', { username: 'duplicate' });
} catch (error) {
  if (error.name === 'SequelizeUniqueConstraintError') {
    console.log('Username already exists');
  }
}
```

## Best Practices

1. **Always await connections**: Use `await db.connect()` before operations
2. **Handle errors**: Wrap database operations in try-catch blocks
3. **Close connections**: Call `await db.close()` when done
4. **Use transactions**: For multiple related operations
5. **Index frequently searched fields**: Add indexes for better performance
6. **Validate input**: Always validate data before inserting

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details.