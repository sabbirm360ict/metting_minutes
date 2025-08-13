"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AbstractModels {
    constructor(db) {
        this.db = db;
    }
    query() {
        return this.db.queryBuilder();
    }
}
exports.default = AbstractModels;
