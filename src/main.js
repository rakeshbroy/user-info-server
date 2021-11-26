import express from "express";
import BodyParser from "body-parser";
import * as dotenv from "dotenv";
import cors from "cors";
import path from 'path';
import { log } from "./services/common/logger-service";
import { Config } from "./config";
import AppOverrides from './services/common/app-override';
import { InitRoutes } from './routes/init-routes';

dotenv.config();

const app = express();

app.use("/assets", express.static(path.resolve("assets")));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

new AppOverrides(app);
new InitRoutes(app);

const port = process.env.PORT || 9004;
const server = app.listen(port, () => {
  log.i(`Server listening on port ${port}`);
  log.i(`Access server at ${Config.serverUrl.base}`);
});