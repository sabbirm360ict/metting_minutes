"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_routers_1 = __importDefault(require("../features/admin/routers/admin.routers"));
class RootRouter {
    constructor() {
        this.v1Router = (0, express_1.Router)();
        this.callRouter();
    }
    callRouter() {
        this.v1Router.use('/tenant', new admin_routers_1.default().router);
    }
}
exports.default = RootRouter;
