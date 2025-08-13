"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const authChecker_1 = __importDefault(require("../middleware/authChecker/authChecker"));
const errorHandler_1 = __importDefault(require("../middleware/errorHandler/errorHandler"));
const constants_1 = require("../utils/miscellaneous/constants");
const templates_1 = require("../utils/templates/templates");
const router_1 = __importDefault(require("./router"));
class App {
    constructor(port) {
        this.origin = constants_1.origin;
        this.authChecker = new authChecker_1.default();
        this.app = (0, express_1.default)();
        this.port = port;
        this.initMiddleware();
        this.initRouter();
        this.modulesRouter();
        this.notFoundRouter();
        this.handleError();
    }
    listenServer() {
        this.app.listen(this.port, () => {
            console.log(`server is listening at http://localhost:${this.port}`);
        });
    }
    initMiddleware() {
        this.app.use((0, helmet_1.default)());
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use((0, morgan_1.default)('dev'));
        this.app.use((0, cors_1.default)({ origin: this.origin, credentials: true }));
    }
    initRouter() {
        this.app.get('/', (_req, res) => {
            res.send(templates_1.loading);
        });
    }
    modulesRouter() {
        /**
         * @auth checker
         */
        // this.app.use(this.authChecker.check);
        this.app.use('/api/v1', new router_1.default().v1Router);
    }
    notFoundRouter() {
        this.app.use('*', (req, res) => {
            res.status(404).json({
                error: {
                    type: 'RouteNotFound',
                    message: 'The requested route does not exist.',
                    status: 404,
                },
            });
        });
    }
    handleError() {
        this.app.use(new errorHandler_1.default().handleError);
    }
}
exports.default = App;
