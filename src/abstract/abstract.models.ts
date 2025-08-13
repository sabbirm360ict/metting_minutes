import { TDB } from '../utils/interfaces/common';

class AbstractModels {
  protected db: TDB;

  constructor(db: TDB) {
    this.db = db;
  }

  protected query() {
    return this.db.queryBuilder();
  }
}
export default AbstractModels;
