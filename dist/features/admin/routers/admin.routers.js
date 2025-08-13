"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const abstract_router_1 = __importDefault(require("../../../abstract/abstract.router"));
const admin_controllers_1 = __importDefault(require("../controllers/admin.controllers"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uploadPath = path_1.default.resolve('uploads');
if (!fs_1.default.existsSync(uploadPath))
    fs_1.default.mkdirSync(uploadPath, { recursive: true });
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath); // saves in uploads folder
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    },
});
const upload = (0, multer_1.default)({ storage });
class AdminRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controllers = new admin_controllers_1.default();
        this.callRouter();
    }
    callRouter() {
        this.router.post('/process-audio', upload.single('file'), this.controllers.processAudio);
    }
}
exports.default = AdminRouter;
