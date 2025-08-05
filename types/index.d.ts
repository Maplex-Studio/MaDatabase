// filepath: c:\Users\Char\Desktop\Maplex\MaDatabase\types\index.d.ts
declare module 'MaDatabase' {
  import { Sequelize, Model, DataTypes } from 'sequelize';

  export interface DatabaseOptions {
    dialect?: string;
    storage?: string;
    logging?: boolean;
  }

  export class Database {
    constructor(options?: DatabaseOptions);
    connect(): Promise<boolean>;
    createTable(tableName: string, schema: object, options?: object): Model;
    syncTables(force?: boolean): Promise<boolean>;
    insert(tableName: string, data: object): Promise<Model>;
    insertMany(tableName: string, dataArray: object[]): Promise<Model[]>;
    find(tableName: string, options?: object): Promise<Model[]>;
    findOne(tableName: string, options?: object): Promise<Model | null>;
    findById(tableName: string, id: number): Promise<Model | null>;
    update(tableName: string, data: object, where: object): Promise<number>;
    delete(tableName: string, where: object): Promise<number>;
    count(tableName: string, options?: object): Promise<number>;
    query(sql: string, options?: object): Promise<{ results: any; metadata: any }>;
    getTableInfo(tableName: string): object | null;
    getTables(): string[];
    close(): Promise<void>;
    getSequelize(): Sequelize;
    getModel(tableName: string): Model;
  }
}