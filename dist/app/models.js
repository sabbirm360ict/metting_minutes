"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const admin_models_1 = __importDefault(require("../features/admin/models/admin.models"));
class Models {
    constructor(db) {
        this.db = db;
    }
    adminModels(trx) {
        return new admin_models_1.default(trx || this.db);
    }
}
exports.default = Models;
