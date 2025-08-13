"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../../abstract/abstract.router"));
const admin_controllers_1 = __importDefault(require("../controllers/admin.controllers"));
class AdminRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controllers = new admin_controllers_1.default();
        this.callRouter();
    }
    callRouter() { }
}
exports.default = AdminRouter;
