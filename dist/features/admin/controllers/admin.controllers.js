"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_controllers_1 = __importDefault(require("../../../abstract/abstract.controllers"));
const admin_services_1 = __importDefault(require("../services/admin.services"));
const admin_validator_1 = __importDefault(require("../validator/admin.validator"));
class AdminControllers extends abstract_controllers_1.default {
    constructor() {
        super();
        this.validator = new admin_validator_1.default();
        this.services = new admin_services_1.default();
    }
}
exports.default = AdminControllers;
