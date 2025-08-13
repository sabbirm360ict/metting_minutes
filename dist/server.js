"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app/app"));
const config_1 = __importDefault(require("./utils/config/config"));
// import cluster from 'node:cluster';
// import os from 'os';
// const totalCpu = os.cpus().length;
// let app = new App(config.PORT);
// if (cluster.isPrimary) {
//   for (let i = 0; i < totalCpu; i++) {
//     cluster.fork();
//   }
// } else {
//   app = new App(config.PORT);
//   app.listenServer();
// }
// export default app?.app;
const app = new app_1.default(config_1.default.PORT);
app.listenServer();
exports.default = app.app;
