export type IStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'FIT'
  | 'UNFIT'
  | 'COMPLETE';
export type IPassportStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETE';
export type IAccountType = 'CASH' | 'BANK' | 'MOBILE_BANKING' | 'CHEQUE';
export type IPaymentMethod = 'CASH' | 'BANK' | 'MOBILE_BANKING' | 'CHEQUE';
export type IVoucherType =
  | 'MR'
  | 'CP'
  | 'AT'
  | 'CT'
  | 'EXP'
  | 'DP'
  | 'BA'
  | 'LN'
  | 'LNP'
  | 'LNR'
  | 'BT'
  | 'IVT'
  | 'NII'
  | 'QT'
  | 'P';

export type IQuery = {
  from_date: string;
  to_date: string;
  page: string;
  size: string;
  search: string;
};

export type IChequeType =
  | 'MONEY_RECEIPT'
  | 'EXPENSE'
  | 'PAYMENT'
  | 'PAYROLL'
  | 'LOAN'
  | 'LOAN_PAYMENT'
  | 'LOAN_RECEIVE'
  | 'DELEGATE_PAYMENT';

export type IChequeStatus = 'Pending' | 'Deposit' | 'Return' | 'Bounce';

export interface IPassportProcess {
  passports: { passport_id: number }[];
  update_date: string;
  expire_date: string;
  status: IStatus;
  current: processTypes;
  destination: processTypes[];
  user_id: number;
  tenant_id: number;
  code_no?: string;
  ticket_fly_date?: string;
  ticket_to_id?: number;
  ticket_from_id?: number;
  ticket_airline_id?: number;
  ticket_flight_no?: string;
  ticket_flight_time?: string;
  charge_amount?: number;
  type_id?: number;
}

export type processTypes =
  | 'medical_test'
  | 'police_clearance'
  | 'mofa'
  | 'tasheer_fingerprint'
  | 'visa_list'
  | 'training'
  | 'fingerprint'
  | 'bmet_list'
  | 'air_ticket'
  | 'remarks'
  | 'passport'
  | 'calling_list'
  | 'interview'
  | 'send_to_dubai'
  | 'online_form';
