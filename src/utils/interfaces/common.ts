import { Knex } from 'knex';

export type idType = string | number;
export type TDB = Knex | Knex.Transaction;
export const PAYMENT_METHOD = ['CASH', 'BANK', 'MOBILE_BANKING', 'CHEQUE'];
