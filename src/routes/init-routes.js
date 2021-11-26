import Utils from "../services/common/utils";
import { log } from "../services/common/logger-service";
import { SqlService } from "../services/sql/sql-service";
import { UserRoutes } from "./user-routes";

export class InitRoutes {
  constructor(app) {
    new SqlService();
    this.initTestApi(app);
    this.initRoutes(app);
  }
  initTestApi(app) {
    app.get("/", async (req, res) => {
      return res.json({
        version: Utils.getVersion(),
        system_time: new Date(),
        env: process.env.NODE_ENV,
      });
    });

    app.get("/db", async (req, res) => {
      try {
        await SqlService.getTable("users");
        return res.json({ message: "database working" });
      } catch (e) {
        log.e(`${req.method}: ${req.url}`, e);
        return res.status(HttpCode.internal_server_error).json(e);
      }
    });
  }
  initRoutes(app) {
    new UserRoutes(app);
  }
}
