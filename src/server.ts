import App from './app/app';
import config from './utils/config/config';
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

const app = new App(config.PORT);
app.listenServer();
export default app.app;
