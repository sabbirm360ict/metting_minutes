import { Knex } from 'knex';
import AdminModels from '../features/admin/models/admin.models';

class Models {
  public db: Knex;
  constructor(db: Knex) {
    this.db = db;
  }

  public adminModels(trx?: Knex.Transaction) {
    return new AdminModels(trx || this.db);
  }
}
export default Models;
