import { Config } from "../../config";
import * as mysql from "mysql";
import { Environment } from "../../enum/common-enum";
import _ from "lodash";
import { log } from "../common/logger-service";

let db;
if (process.env.NODE_ENV === Environment.test) {
  db = Config.dbTest;
} else if (process.env.NODE_ENV === Environment.prod) {
  db = Config.dbProd;
} else {
  db = Config.dbDev;
}
const pool = mysql.createPool(db);

export class SqlService {
  constructor() {
    const query = "SET NAMES utf8mb4";
    SqlService.executeQuery(query);
  }
  static executeQuery(query) {
    log.sql(query);
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          reject(err);
          return;
        } else {
          connection.query(query, (err1, rows) => {
            if (err1) {
              connection.release();
              reject(err1);
              return;
            }
            const str = JSON.stringify(rows);
            const result = JSON.parse(str);
            connection.release();
            resolve(result);
          });
        }
      });
    });
  }

  static executeMultipleQueries(queries) {
    let bigQuery = ``;
    queries.forEach((query) => {
      if (!_.isEmpty(query)) {
        bigQuery += query;
      }
    });
    return this.executeQuery(bigQuery);
  }

  static getSingle(query) {
    log.sql(query);
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          reject(err);
          return;
        } else {
          connection.query(query, (err1, rows) => {
            if (err1) {
              connection.release();
              reject(err1);
              return;
            }

            const str = JSON.stringify(rows);
            let result = JSON.parse(str);
            if (result && result.length > 0) {
              result = result[0];
            } else {
              result = {};
            }
            connection.release();
            resolve(result);
          });
        }
      });
    });
  }

  static getTable(tableName, recordCount = 1) {// 0 to get all
    const query = `select * from ${tableName};`;
    if (recordCount === 1) {
      return this.getSingle(query);
    } else {
      return this.executeQuery(query);
    }
  }
}
