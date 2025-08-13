import AbstractRouter from '../../../abstract/abstract.router';
import AdminControllers from '../controllers/admin.controllers';

class AdminRouter extends AbstractRouter {
  private controllers = new AdminControllers();
  constructor() {
    super();
    this.callRouter();
  }

  private callRouter() {}
}
export default AdminRouter;
