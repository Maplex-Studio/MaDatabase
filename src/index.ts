import {
  Sequelize,
  DataTypes,
  Model,
} from "sequelize";

import type {
  ModelAttributes,
  FindOptions,
  CreateOptions,
  UpdateOptions,
  DestroyOptions,
  CountOptions,
  QueryOptions,
  Dialect,
  WhereOptions,
  ModelStatic,
} from "sequelize";

import path from "path";


export interface DatabaseOptions {
  dialect?: Dialect;
  storage?: string;
  logging?: boolean;
}

export class Database {
  private sequelize: Sequelize;
  private models: { [key: string]: ModelStatic<Model<any, any>> };
  private isConnected: boolean;

  constructor(options: DatabaseOptions = {}) {
    const defaultOptions: DatabaseOptions = {
      dialect: "sqlite",
      storage: path.join(process.cwd(), "database.sqlite"),
      logging: false,
      ...options,
    };

    if (options.logging === undefined) {
      defaultOptions.logging = false;
    }

    this.sequelize = new Sequelize({
      dialect: defaultOptions.dialect,
      storage: defaultOptions.storage,
      logging: defaultOptions.logging,
    });
    this.models = {};
    this.isConnected = false;
  }

  async connect(): Promise<boolean> {
    try {
      await this.sequelize.authenticate();
      this.isConnected = true;
      console.log("✅ Database connection established successfully");
      return true;
    } catch (error) {
      console.error("❌ Unable to connect to database:", error);
      return false;
    }
  }

  createTable<T extends Model<any, any>>(
    tableName: string,
    schema: ModelAttributes,
    options: object = {}
  ): ModelStatic<T> {
    if (this.models[tableName]) {
      console.log(`ℹ️ Table '${tableName}' already defined`);
      return this.models[tableName] as ModelStatic<T>;
    }

    const defaultSchema: ModelAttributes = {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      ...schema,
    };

    this.models[tableName] = this.sequelize.define(tableName, defaultSchema, {
      tableName: tableName.toLowerCase(),
      ...options,
    });

    console.log(`✅ Table '${tableName}' created`);
    return this.models[tableName] as ModelStatic<T>;
  }

  async syncTables(force: boolean = false): Promise<boolean> {
    try {
      await this.sequelize.sync({ force });
      console.log("✅ All tables synced successfully");
      return true;
    } catch (error) {
      console.error("❌ Error syncing tables:", error);
      return false;
    }
  }

  async insert<T extends Model<any, any>>(
    tableName: string,
    data: Record<string, any>,
    options?: CreateOptions
  ): Promise<T> {
    if (!this.models[tableName]) {
      throw new Error(`Table '${tableName}' not found`);
    }

    try {
      const result = (await this.models[tableName].create(data, options)) as T;
      console.log(`✅ Data inserted into '${tableName}'`);
      return result;
    } catch (error) {
      console.error(`❌ Error inserting into '${tableName}':`, error);
      throw error;
    }
  }

  async insertMany<T extends Model<any, any>>(
    tableName: string,
    dataArray: Record<string, any>[],
    options?: CreateOptions
  ): Promise<T[]> {
    if (!this.models[tableName]) {
      throw new Error(`Table '${tableName}' not found`);
    }

    try {
      const results = (await this.models[tableName].bulkCreate(
        dataArray,
        options
      )) as T[];
      console.log(`✅ ${results.length} records inserted into '${tableName}'`);
      return results;
    } catch (error) {
      console.error(`❌ Error bulk inserting into '${tableName}':`, error);
      throw error;
    }
  }

  async find<T extends Model<any, any>>(
    tableName: string,
    options: FindOptions = {}
  ): Promise<T[]> {
    if (!this.models[tableName]) {
      throw new Error(`Table '${tableName}' not found`);
    }

    try {
      const results = (await this.models[tableName].findAll(options)) as T[];
      return results;
    } catch (error) {
      console.error(`❌ Error finding records in '${tableName}':`, error);
      throw error;
    }
  }

  async findOne<T extends Model<any, any>>(
    tableName: string,
    options: FindOptions = {}
  ): Promise<T | null> {
    if (!this.models[tableName]) {
      throw new Error(`Table '${tableName}' not found`);
    }

    try {
      const result = (await this.models[tableName].findOne(options)) as T | null;
      return result;
    } catch (error) {
      console.error(`❌ Error finding record in '${tableName}':`, error);
      throw error;
    }
  }

  async findById<T extends Model<any, any>>(
    tableName: string,
    id: number
  ): Promise<T | null> {
    if (!this.models[tableName]) {
      throw new Error(`Table '${tableName}' not found`);
    }

    try {
      const result = (await this.models[tableName].findByPk(id)) as T | null;
      return result;
    } catch (error) {
      console.error(`❌ Error finding record by ID in '${tableName}':`, error);
      throw error;
    }
  }

  async update(
    tableName: string,
    data: Record<string, any>,
    where: WhereOptions<any>,
    options?: UpdateOptions
  ): Promise<number> {
    if (!this.models[tableName]) {
      throw new Error(`Table '${tableName}' not found`);
    }

    try {
      const [affectedRows] = await this.models[tableName].update(data, {
        where,
        ...options,
      });
      console.log(`✅ ${affectedRows} records updated in '${tableName}'`);
      return affectedRows;
    } catch (error) {
      console.error(`❌ Error updating records in '${tableName}':`, error);
      throw error;
    }
  }

  async delete(
    tableName: string,
    where: WhereOptions<any>,
    options?: DestroyOptions
  ): Promise<number> {
    if (!this.models[tableName]) {
      throw new Error(`Table '${tableName}' not found`);
    }

    try {
      const deletedRows = await this.models[tableName].destroy({ where, ...options });
      console.log(`✅ ${deletedRows} records deleted from '${tableName}'`);
      return deletedRows;
    } catch (error) {
      console.error(`❌ Error deleting records from '${tableName}':`, error);
      throw error;
    }
  }

  async count(tableName: string, options: CountOptions = {}): Promise<number> {
    if (!this.models[tableName]) {
      throw new Error(`Table '${tableName}' not found`);
    }

    try {
      const count = await this.models[tableName].count(options);
      return count;
    } catch (error) {
      console.error(`❌ Error counting records in '${tableName}':`, error);
      throw error;
    }
  }

  async query(
    sql: string,
    options: QueryOptions = {}
  ): Promise<{ results: any; metadata: any }> {
    try {
      const [results, metadata] = await this.sequelize.query(sql, options);
      return { results, metadata };
    } catch (error) {
      console.error("❌ Error executing raw query:", error);
      throw error;
    }
  }

  getTableInfo(tableName: string): object | null {
    if (!this.models[tableName]) {
      return null;
    }
    return {
      tableName,
      attributes: this.models[tableName].rawAttributes,
      associations: this.models[tableName].associations,
    };
  }

  getTables(): string[] {
    return Object.keys(this.models);
  }

  async close(): Promise<void> {
    try {
      await this.sequelize.close();
      this.isConnected = false;
      console.log("✅ Database connection closed");
    } catch (error) {
      console.error("❌ Error closing database:", error);
    }
  }

  getSequelize(): Sequelize {
    return this.sequelize;
  }

  getModel<T extends Model<any, any>>(tableName: string): ModelStatic<T> {
    return this.models[tableName] as ModelStatic<T>;
  }
}
