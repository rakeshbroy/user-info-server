import { table } from "../enum/table";
import { SqlService } from "./sql/sql-service";
import { QueryBuilderService } from "./sql/query-builder-service";
import _ from 'lodash';
import { UserModel } from "../models/models";
import bcrypt from "bcrypt";

export class UserService {
  constructor() {}

  async existingUser(user) {
    let condition = ` where email = '${user.email}' limit 1`;
    let query = `select * from ${table.users} ${condition}`;
    let fetchedUser = await SqlService.executeQuery(query);
    return !_.isEmpty(fetchedUser);
  }

  async isExistingUserWithThisEmail(user) {
    let condition = ` where users.id <> ${user.id} and email = '${user.email}' limit 1`;
    let query = `select * from ${table.users} ${condition}`;
    let fetchedUser = await SqlService.executeQuery(query);
    return _.isEmpty(fetchedUser);
  }

  async addUser(user) {
    let query = await QueryBuilderService.getInsertQuery(table.users, new UserModel(user.firstName, user.lastName, user.email, user.mobile, user.password));
    await SqlService.executeQuery(query);
  }

  async getUserByEmail(user) {
    let condition = ` where email = '${user.email}' limit 1`;
    let query = `select * from ${table.users} ${condition}`;
    let users = await SqlService.executeQuery(query);
    return users[0];
  }

  async getAllUsers() {
    const condition = ' where deletedAt is null';
    let query = `select id, firstName, lastName, email, mobile from ${table.users} ${condition}`;
    return await SqlService.executeQuery(query);
  }

  async updateUser(user) {
    const condition = ` where id = ${user.id}`;
    let query = await QueryBuilderService.getUpdateQuery(table.users, new UserModel(user.firstName, user.lastName, user.email, user.mobile, user.password), condition);
    return await SqlService.executeQuery(query);
  }

  async getUserById(user) {
    let condition = ` where id = '${user.id}' limit 1`;
    let query = `select * from ${table.users} ${condition}`;
    let users = await SqlService.executeQuery(query);
    return users[0];
  }

  async deletesUser(user) {
    const condition = ` where id = ${user.id}`;
    let query = `update ${table.users} set deletedAt = utc_timestamp() ${condition}`
    return await SqlService.executeQuery(query);
  }
}
