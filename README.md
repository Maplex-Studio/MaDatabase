# README.md

# MaDatabase

MaDatabase is a TypeScript library that provides a simple and efficient way to manage database connections and operations using Sequelize. It includes methods for connecting to the database, creating tables, inserting data, querying records, and managing the database lifecycle.

## Features

- Connect to various databases using Sequelize.
- Create and manage tables with customizable schemas.
- Perform CRUD operations (Create, Read, Update, Delete) on database records.
- Execute raw SQL queries.
- Sync database tables with the defined models.

## Installation

To install MaDatabase, you can use npm:

```bash
npm install MaDatabase
```

## Usage

Here is a basic example of how to use MaDatabase:

```typescript
import { Database } from 'MaDatabase';

const db = new Database({
  dialect: 'sqlite',
  storage: 'path/to/database.sqlite',
});

async function main() {
  await db.connect();

  // Create a new table
  db.createTable('users', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });

  // Insert a new user
  await db.insert('users', { name: 'John Doe', email: 'john@example.com' });

  // Find all users
  const users = await db.find('users');
  console.log(users);

  // Close the database connection
  await db.close();
}

main().catch(console.error);
```

## TypeScript Support

MaDatabase is written in TypeScript and provides type definitions for all its methods. You can import the types from the `types` directory to enhance your development experience.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.