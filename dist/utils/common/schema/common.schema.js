"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.companyTreadSchema = exports.tread_schema = exports.passport_schema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.passport_schema = joi_1.default.array().items(joi_1.default.object({
    passport_id: joi_1.default.number().integer().required(),
    amount: joi_1.default.number().required(),
}));
exports.tread_schema = joi_1.default.array().items(joi_1.default.object({
    work_id: joi_1.default.number().integer().required(),
    amount: joi_1.default.number().required(),
}));
exports.companyTreadSchema = joi_1.default.array().items(joi_1.default.object({
    work_type_id: joi_1.default.number().integer().required(),
    work_quantity: joi_1.default.number().integer().required(),
    work_unit_price: joi_1.default.number().required(),
})
    .min(1)
    .required());
