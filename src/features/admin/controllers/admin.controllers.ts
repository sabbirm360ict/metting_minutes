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
}
export default AdminControllers;
