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
exports.PassportProcessHelpers = void 0;
const abstract_services_1 = __importDefault(require("../../../abstract/abstract.services"));
const customError_1 = __importDefault(require("../../lib/customError"));
class PassportProcessHelpers extends abstract_services_1.default {
    constructor() {
        super();
        this.passportProcess = (body, helperTrx) => __awaiter(this, void 0, void 0, function* () {
            const { current, destination, status, passports, expire_date, update_date, user_id, tenant_id, code_no, ticket_fly_date, ticket_to_id, ticket_from_id, ticket_airline_id, ticket_flight_no, ticket_flight_time, charge_amount, type_id, } = body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const process_conn = this.models.processPassport(helperTrx || trx);
                const passport_conn = this.models.passportModels(helperTrx || trx);
                const airTicket_conn = this.models.airTicketModels(helperTrx || trx);
                let ids = [];
                if (passports) {
                    ids = passports.map((item) => {
                        return item.passport_id;
                    });
                }
                let c_message = 'Passport Process';
                let d_message = '';
                if (current === 'fingerprint') {
                    c_message = 'Fingerprint';
                    yield process_conn.updateFingerprintStatus(status, expire_date, ids);
                }
                else if (current === 'training') {
                    c_message = 'Training';
                    yield process_conn.updateTrainingStatus(status, expire_date, ids);
                }
                else if (current === 'send_to_dubai') {
                    c_message = 'Send To Dubai';
                    yield process_conn.updateDubaiPassportStatus(status, expire_date, ids);
                }
                else if (current === 'mofa') {
                    c_message = 'MOFA';
                    yield process_conn.updateMofaStatus(status, expire_date, ids);
                }
                else if (current === 'bmet_list') {
                    c_message = 'BMET';
                    yield process_conn.updateBMETStatus(status, ids);
                }
                else if (current === 'air_ticket') {
                    c_message = 'Air Ticket';
                    const data = {
                        ticket_airline_id: ticket_airline_id,
                        ticket_flight_no: ticket_flight_no,
                        ticket_fly_date: ticket_fly_date,
                        ticket_from_id: ticket_from_id,
                        ticket_status: status,
                        ticket_to_id: ticket_to_id,
                        ticket_flight_time: ticket_flight_time,
                    };
                    yield airTicket_conn.updateAirTicketStatus(data, ids);
                }
                else if (current === 'calling_list') {
                    c_message = 'Calling List';
                    yield process_conn.updateCallingListStatus(status, expire_date, ids);
                }
                else if (current === 'interview') {
                    c_message = 'Interview';
                    yield process_conn.updateInterviewStatus(status, update_date, ids);
                }
                else if (current === 'medical_test') {
                    c_message = 'Medical Test';
                    yield process_conn.updateMedicalStatus(status, expire_date, ids);
                }
                else if (current === 'passport') {
                    c_message = 'Passport';
                    yield passport_conn.updatePassportStatus(status === 'COMPLETE' ? 'COMPLETE' : 'IN_PROGRESS', ids);
                }
                else if (current === 'police_clearance') {
                    c_message = 'Police Clearance';
                    yield process_conn.updateVisaListFormStatus(status, expire_date, ids);
                }
                else if (current === 'tasheer_fingerprint') {
                    c_message = 'Tasheer Fingerprint';
                    yield process_conn.updateTasheerFingerprintStatus(status, ids);
                }
                else if (current === 'visa_list') {
                    c_message = 'Visa List';
                    yield process_conn.updateVisaListFormStatus(status, expire_date, ids);
                }
                else if (current === 'online_form') {
                    c_message = 'Online Form';
                    yield process_conn.updateOnlineFormStatus(status, ids);
                }
                else {
                    throw new customError_1.default(this.ResMsg.HTTP_UNPROCESSABLE_ENTITY, this.StatusCode.HTTP_UNPROCESSABLE_ENTITY);
                }
                if (status === 'APPROVED' || status === 'FIT' || status === 'COMPLETE') {
                    if (destination.includes('bmet_list')) {
                        d_message = 'BMET';
                        const checkPassports = yield process_conn.getVMETPassport(ids);
                        const vmetInfo = [];
                        for (const passport of passports) {
                            const { passport_id } = passport;
                            const isExist = checkPassports.find((item) => item === passport_id);
                            if (!isExist) {
                                const info = {
                                    bmet_tenant_id: tenant_id,
                                    bmet_passport_id: passport_id,
                                    bmet_updated_date: update_date,
                                    bmet_status: 'PENDING',
                                };
                                vmetInfo.push(info);
                            }
                        }
                        if (vmetInfo.length) {
                            yield process_conn.createVmet(vmetInfo);
                        }
                    }
                    if (destination.includes('air_ticket')) {
                        d_message = 'Air Ticket';
                        const checkPassports = yield process_conn.getAirTicketPassport(ids);
                        const vmetInfo = [];
                        for (const passport of passports) {
                            const { passport_id } = passport;
                            const isExist = checkPassports.find((item) => item === passport_id);
                            if (!isExist) {
                                const info = {
                                    ticket_tenant_id: tenant_id,
                                    ticket_passport_id: passport_id,
                                    ticket_sent_date: update_date,
                                    ticket_status: 'PENDING',
                                };
                                vmetInfo.push(info);
                            }
                        }
                        if (vmetInfo.length) {
                            yield airTicket_conn.createAirTicket(vmetInfo);
                        }
                    }
                    if (destination.includes('calling_list')) {
                        d_message = 'Calling List';
                        const checkPassports = yield process_conn.getCallingListPassport(ids);
                        const bulkOnlineInfo = [];
                        for (const passport of passports) {
                            const { passport_id } = passport;
                            const isExist = checkPassports.find((item) => item === passport_id);
                            if (!isExist) {
                                const info = {
                                    list_passport_id: passport_id,
                                    list_status: 'PENDING',
                                    list_tenant_id: tenant_id,
                                    list_updated_date: update_date,
                                    list_calling_no: code_no,
                                };
                                bulkOnlineInfo.push(info);
                            }
                        }
                        if (bulkOnlineInfo.length) {
                            yield process_conn.createCallingList(bulkOnlineInfo);
                        }
                    }
                    if (destination.includes('fingerprint')) {
                        d_message = 'Fingerprint';
                        const fingerprintInfo = [];
                        const checkPassports = yield process_conn.getFingerprintPassports(ids);
                        for (const passport of passports) {
                            const { passport_id } = passport;
                            const isExist = checkPassports.find((item) => item === passport_id);
                            if (!isExist) {
                                const info = {
                                    ft_passport_id: passport_id,
                                    ft_tenant_id: tenant_id,
                                    ft_date: update_date,
                                    ft_expired_date: null,
                                    ft_status: 'PENDING',
                                };
                                fingerprintInfo.push(info);
                            }
                        }
                        if (fingerprintInfo.length)
                            yield process_conn.createFingerprint(fingerprintInfo);
                    }
                    if (destination.includes('medical_test')) {
                        d_message = 'Medical Test';
                        const medicalTestInfo = [];
                        const checkPassports = yield process_conn.getMedicalTestPassport(ids);
                        for (const passport of passports) {
                            const { passport_id } = passport;
                            const isExist = checkPassports.find((item) => item === passport_id);
                            if (!isExist) {
                                const info = {
                                    medical_charge: charge_amount,
                                    medical_tenant_id: tenant_id,
                                    medical_status: 'PENDING',
                                    medical_passport_id: passport_id,
                                    medical_type_id: type_id,
                                    medical_updated_date: update_date,
                                };
                                medicalTestInfo.push(info);
                            }
                        }
                        if (medicalTestInfo.length)
                            yield passport_conn.createBulkMedicalTest(medicalTestInfo);
                    }
                    if (destination.includes('mofa')) {
                        d_message = 'MOFA';
                        const checkPassports = yield process_conn.getMofaPassports(ids);
                        const mofaInfo = [];
                        for (const passport of passports) {
                            const { passport_id } = passport;
                            const isExist = checkPassports.find((item) => item === passport_id);
                            if (!isExist) {
                                const info = {
                                    mofa_passport_id: passport_id,
                                    mofa_tenant_id: tenant_id,
                                    mofa_date: update_date,
                                    mofa_expired_date: expire_date,
                                    mofa_status: 'PENDING',
                                };
                                mofaInfo.push(info);
                            }
                        }
                        if (mofaInfo.length)
                            yield process_conn.createMofa(mofaInfo);
                    }
                    if (destination.includes('police_clearance')) {
                        d_message = 'Police Clearance';
                        const policeClearanceInfo = [];
                        const checkPassports = yield process_conn.getPoliceClearancePassports(ids);
                        for (const passport of passports) {
                            const { passport_id } = passport;
                            const isExist = checkPassports.find((item) => item === passport_id);
                            if (!isExist) {
                                const info = {
                                    pc_tenant_id: tenant_id,
                                    pc_no: code_no,
                                    pc_passport_id: passport_id,
                                    pc_date: update_date,
                                    pc_expire_date: null,
                                    pc_status: 'PENDING',
                                };
                                policeClearanceInfo.push(info);
                            }
                        }
                        if (policeClearanceInfo.length)
                            yield process_conn.createPoliceClearance(policeClearanceInfo);
                    }
                    if (destination.includes('remarks')) {
                        d_message = 'Remarks';
                        const checkPassports = yield airTicket_conn.getRemarkPassport(ids);
                        const remarkInfo = [];
                        yield passport_conn.updatePassportStatus('COMPLETE', ids);
                        for (const passport of passports) {
                            const { passport_id } = passport;
                            const isExist = checkPassports.find((item) => item === passport_id);
                            if (!isExist) {
                                const info = {
                                    rmk_created_by: user_id,
                                    rmk_note: code_no,
                                    rmk_passport_id: passport_id,
                                    rmk_tenant_id: tenant_id,
                                    rmk_date: update_date,
                                };
                                remarkInfo.push(info);
                            }
                        }
                        if (remarkInfo.length) {
                            yield airTicket_conn.createRemarks(remarkInfo);
                        }
                    }
                    if (destination.includes('tasheer_fingerprint')) {
                        d_message = 'Tasheer Fingerprint';
                        for (const passport of passports) {
                            const { passport_id } = passport;
                            yield process_conn.createTasheerFingerprint({
                                tf_tenant_id: tenant_id,
                                tf_status: 'PENDING',
                                tf_passport_id: passport_id,
                                tf_date: null,
                                tf_created_by: user_id,
                            });
                        }
                    }
                    if (destination.includes('training')) {
                        d_message = 'Training';
                        const checkPassports = yield process_conn.getTrainingPassports(ids);
                        const trainingInfo = [];
                        for (const passport of passports) {
                            const { passport_id } = passport;
                            const isExist = checkPassports.find((item) => item === passport_id);
                            if (!isExist) {
                                const info = {
                                    training_passport_id: passport_id,
                                    training_tenant_id: tenant_id,
                                    training_date: update_date,
                                    training_expired_date: null,
                                    training_status: 'PENDING',
                                };
                                trainingInfo.push(info);
                            }
                        }
                        if (trainingInfo.length)
                            yield process_conn.createTraining(trainingInfo);
                    }
                    if (destination.includes('visa_list')) {
                        d_message = 'Visa List';
                        const checkPassports = yield process_conn.getVisaListPassport(ids);
                        const visaListInfo = [];
                        for (const passport of passports) {
                            const { passport_id } = passport;
                            const isExist = checkPassports.find((item) => item === passport_id);
                            if (!isExist) {
                                const info = {
                                    visa_tenant_id: tenant_id,
                                    visa_passport_id: passport_id,
                                    visa_updated_date: update_date,
                                    visa_status: 'PENDING',
                                    visa_no: code_no,
                                };
                                visaListInfo.push(info);
                            }
                        }
                        if (visaListInfo.length) {
                            yield process_conn.createVisaList(visaListInfo);
                        }
                    }
                    if (destination.includes('send_to_dubai')) {
                        d_message = 'Send To Dubai';
                        const dubaiPassports = [];
                        const checkPassports = yield process_conn.getDubaiPassportsList(ids);
                        for (const passport of passports) {
                            const { passport_id } = passport;
                            const isExist = checkPassports.find((item) => item === passport_id);
                            if (!isExist) {
                                const info = {
                                    dp_tenant_id: tenant_id,
                                    dp_status: 'PENDING',
                                    dp_passport_id: passport_id,
                                    dp_date: update_date,
                                    dp_expired_date: expire_date,
                                };
                                dubaiPassports.push(info);
                            }
                        }
                        if (dubaiPassports && dubaiPassports.length)
                            yield process_conn.createDubaiPassport(dubaiPassports);
                    }
                    if (destination.includes('online_form')) {
                        d_message = 'Online Form';
                        const bulkOnlineInfo = [];
                        const checkPassports = yield process_conn.getOnlineFormPassport(ids);
                        for (const passport of passports) {
                            const { passport_id } = passport;
                            const isExist = checkPassports.find((item) => item === passport_id);
                            if (!isExist) {
                                const info = {
                                    online_passport_id: passport_id,
                                    online_status: 'PENDING',
                                    online_tenant_id: tenant_id,
                                    online_updated_date: update_date,
                                };
                                bulkOnlineInfo.push(info);
                            }
                        }
                        if (bulkOnlineInfo.length) {
                            yield process_conn.createOnlineForm(bulkOnlineInfo);
                        }
                    }
                }
                yield this.insertAudit({
                    audit_message: `${c_message} ${d_message && 'To ' + d_message} has been updated in bulk quantity`,
                    audit_tenant_id: tenant_id,
                    audit_user_id: user_id,
                    audit_type: 'UPDATE',
                });
                return true;
            }));
        });
    }
}
exports.PassportProcessHelpers = PassportProcessHelpers;
