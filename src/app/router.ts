import { Router } from 'express';
import AdminRouter from '../features/admin/routers/admin.routers';

class RootRouter {
  public v1Router = Router();

  constructor() {
    this.callRouter();
  }

  private callRouter() {
    this.v1Router.use('/tenant', new AdminRouter().router);
  }
}
export default RootRouter;
