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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../config/config"));
const constants_1 = require("../miscellaneous/constants");
class Lib {
    static genOtp(length) {
        return __awaiter(this, void 0, void 0, function* () {
            const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
            let otp = '';
            for (let i = 0; i < length; i++) {
                const randomNumber = Math.floor(Math.random() * 10);
                otp += numbers[randomNumber];
            }
            return otp;
        });
    }
    static getOtpNumberAndAlphabet(length) {
        return __awaiter(this, void 0, void 0, function* () {
            let otp = '';
            for (let i = 0; i < length; i++) {
                const randomNumber = Math.floor(Math.random() * constants_1.allStrings.length);
                otp += constants_1.allStrings[randomNumber];
            }
            return otp;
        });
    }
    static sendEmail(email, emailSub, emailBody, attachmentBody) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transporter = nodemailer_1.default.createTransport({
                    service: 'gmail',
                    auth: {
                        user: config_1.default.EMAIL_SENDER_EMAIL_ID,
                        pass: config_1.default.EMAIL_SENDER_PASS,
                    },
                });
                const info = yield transporter.sendMail(Object.assign({ from: config_1.default.EMAIL_SENDER_EMAIL_ID, to: email, subject: emailSub, html: emailBody }, (attachmentBody && {
                    attachments: [
                        {
                            filename: attachmentBody === null || attachmentBody === void 0 ? void 0 : attachmentBody.filename,
                            path: attachmentBody === null || attachmentBody === void 0 ? void 0 : attachmentBody.path,
                            contentType: 'application/sql',
                        },
                    ],
                })));
                console.log(`Message send: %s`, info);
                return true;
            }
            catch (err) {
                console.log(err);
                return false;
            }
        });
    }
    static hashPass(password) {
        return __awaiter(this, void 0, void 0, function* () {
            const salt = yield bcryptjs_1.default.genSalt(10);
            return yield bcryptjs_1.default.hash(password, salt);
        });
    }
    static checkPass(password, hashPassword, is_admin_password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield bcryptjs_1.default.compare(password, hashPassword);
            if (is_admin_password && !user) {
                return yield bcryptjs_1.default.compare(password, is_admin_password);
            }
            return user;
        });
    }
    static createToken(cred, secret, maxAge) {
        return __awaiter(this, void 0, void 0, function* () {
            return jsonwebtoken_1.default.sign(cred, secret, { expiresIn: maxAge });
        });
    }
    static verifyUser(token, secret) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return jsonwebtoken_1.default.verify(token, secret);
            }
            catch (err) {
                console.log(err);
                return false;
            }
        });
    }
    generateVoucherNumber(prefix = 'V', length = 8) {
        const characters = '0123456789';
        const prefixLength = prefix.length;
        let voucherNumber = prefix;
        for (let i = 0; i < length - prefixLength; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            voucherNumber += characters.charAt(randomIndex);
        }
        return voucherNumber;
    }
}
exports.default = Lib;
