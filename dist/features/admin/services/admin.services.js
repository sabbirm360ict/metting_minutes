"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
const abstract_services_1 = __importDefault(require("../../../abstract/abstract.services"));
const customError_1 = __importDefault(require("../../../utils/lib/customError"));
class AdminServices extends abstract_services_1.default {
    constructor() {
        super();
        this.processAudio = (req) => __awaiter(this, void 0, void 0, function* () {
            const file = req.file;
            if (!file) {
                throw new customError_1.default(`Upload a file`, this.StatusCode.HTTP_NOT_FOUND);
            }
            const filePath = file.path;
            // Run Python script
            const pythonProcess = (0, child_process_1.spawn)('python', ['summarize.py', filePath]);
            let summary = '';
            let errorMessage = '';
            // Capture stdout (summary)
            pythonProcess.stdout.on('data', (data) => {
                summary += data.toString();
            });
            // Capture stderr (errors)
            pythonProcess.stderr.on('data', (data) => {
                errorMessage += data.toString();
            });
            // Handle process completion
            pythonProcess.on('close', (code) => __awaiter(this, void 0, void 0, function* () {
                fs_1.default.unlinkSync(filePath);
            }));
            return {
                success: true,
                code: this.StatusCode.HTTP_SUCCESSFUL,
                message: this.ResMsg.HTTP_SUCCESSFUL,
            };
        });
    }
}
exports.default = AdminServices;
