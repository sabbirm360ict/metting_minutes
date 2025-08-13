"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_models_1 = __importDefault(require("../../../features/configuration/subModules/user/user.models"));
const work_type_modules_1 = __importDefault(require("../../../features/configuration/subModules/work_type/work_type.modules"));
const airline_models_1 = __importDefault(require("../../../features/configuration/subModules/airline/airline.models"));
const subscription_type_model_1 = require("../../../features/configuration/subModules/subscription_type/subscription_type.model");
const investment_companies_models_1 = require("../../../features/configuration/subModules/invenstment_companies/investment_companies.models");
class ConfigModels {
    constructor(db) {
        this.db = db;
    }
    userModel(trx) {
        return new user_models_1.default(trx || this.db);
    }
    workTypeModel(trx) {
        return new work_type_modules_1.default(trx || this.db);
    }
    airlineModel(trx) {
        return new airline_models_1.default(trx || this.db);
    }
    subscriptionTypeModel(trx) {
        return new subscription_type_model_1.SubscriptionTypeModel(trx || this.db);
    }
    investmentCompaniesModels(trx) {
        return new investment_companies_models_1.InvestmentCompaniesModels(trx || this.db);
    }
}
exports.default = ConfigModels;
