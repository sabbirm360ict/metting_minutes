import { Request, Response } from 'express';
import AbstractControllers from '../../../abstract/abstract.controllers';
import AdminServices from '../services/admin.services';
import AdminValidator from '../validator/admin.validator';

class AdminControllers extends AbstractControllers {
  private validator = new AdminValidator();
  private services = new AdminServices();

  constructor() {
    super();
  }

  public processAudio = this.asyncWrapper.wrap(
    null,
    async (req: Request, res: Response) => {
      const { code, ...rest } = await this.services.processAudio(req);

      res.status(code).json(rest);
    }
  );
}
export default AdminControllers;
