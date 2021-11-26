import { Environment } from "./enum/common-enum";

export class Config {
  static version = {
    majorRevision: 1,
    minorRevision: 1,
    bugFixes: 1,
  };
  static serverUrl = {
    prod: `https://${process.env.HOSTNAME}`,
    test: `https://${process.env.HOSTNAME}`,
    dev: "http://localhost:9004",
    base: "",
  };
  static dbDev = {
    host: `127.0.0.1`,
    user: `root`,
    password: `root`,
    database: `binay`,
    multipleStatements: true,
  };
  static dbTest = {
    host: `127.0.0.1`,
    user: `root`,
    password: `root`,
    database: `binay`,
    multipleStatements: true,
  };
  static dbProd = {
    host: `127.0.0.1`,
    user: `root`,
    password: `root`,
    database: `binay`,
    multipleStatements: true,
  };
}
