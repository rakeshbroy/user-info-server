import express from "express";
import { UserService } from "../services/user-service";
import bcrypt from "bcrypt";
import { log } from "../services/common/logger-service";
const userRouter = express();

export class UserRoutes {
  constructor(app) {
    app.use("/user", userRouter);
    this.initRoutes(userRouter);
    this.userService = new UserService();
  }
  initRoutes(app) {
    app
      .post("/add-user", async (req, res) => {
        const userData = req.body;
        try {
          if (await this.userService.existingUser(userData)) {
            return res.json({
              error: true,
              message: "User Already Exist, Try another email",
              data: [],
            });
          } else {
            userData.password = await bcrypt.hash(userData.password, 10);
            await this.userService.addUser(userData);
            return res.json({
              error: false,
              message: "Registered succesfully.",
              data: [],
            });
          }
        } catch (e) {
          log.e(`${req.method}: ${req.url}`, e);
          return res.sendStatus(e);
        }
      })
      .post("/edit-user", async (req, res) => {
        const userData = req.body;
        try {
          if (!(await this.userService.isExistingUserWithThisEmail(userData))) {
            return res.json({
              error: true,
              message: "Email is already in use, Try another",
              data: [],
            });
          } else {
            let user = await this.userService.getUserById(userData);
            if (user) {
              userData.password = await bcrypt.hash(userData.password, 10);
              let result = await this.userService.updateUser(userData);
              if (result) {
                return res.json({
                  error: false,
                  message: "Updated successfully.",
                  data: [],
                });
              } else {
                return res.json({
                  error: true,
                  message: "Updation failed",
                  data: [],
                });
              }
            }
          }
        } catch (e) {
          log.e(`${req.method}: ${req.url}`, e);
          return res.sendStatus(e);
        }
      })
      .get('/list-user', async (req, res) => {
        try {
          let users = await this.userService.getAllUsers();
          if (users) {
            return res.json({
              error: false,
              message: "List of users",
              data: {
                users
              },
            });
          } else {
            return res.json({
              error: false,
              message: "List of users",
              data: {
                users: []
              },
            });
          }
        } catch(e) {
          log.e(`${req.method}: ${req.url}`, e);
          return res.sendStatus(e);
        }
      })
      .post('/delete-user', async (req, res) => {
        try {
          const userData = req.body;
          let user = await this.userService.getUserById(userData);
          if (user) {
            let result = await this.userService.deletesUser(userData);
              if (result) {
                return res.json({
                  error: false,
                  message: "Deleted successfully.",
                  data: [],
                });
              } else {
                return res.json({
                  error: true,
                  message: "Deletion failed",
                  data: [],
                });
              }
          }

        } catch(e) {
          log.e(`${req.method}: ${req.url}`, e);
          return res.sendStatus(e);
        }
      });
  }
}
