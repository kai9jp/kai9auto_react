import { IProduct } from "../../store/models/product.interface";

export type OnChangeModel = {
    value: string | number | boolean,
    error: string,
    touched: boolean,
    field: string
};

export interface IFormStateField<T> {error: string, value: T};

export interface IProductFormState {
    name: IFormStateField<string>;
    description: IFormStateField<string>;
    amount: IFormStateField<number>;
    price: IFormStateField<number>;
    hasExpiryDate: IFormStateField<boolean>; 
    category: IFormStateField<string>;
};

export  interface IOrderFormState {
    name: IFormStateField<string>;
    product: IFormStateField<IProduct | null>;
    amount: IFormStateField<number>;
    totalPrice: IFormStateField<number>;
};

export interface ISyori1FormState {
    s1_id: IFormStateField<number>;
    s1_name: IFormStateField<string>;
    s_excel_filename: IFormStateField<string>;
    delflg: IFormStateField<boolean>;
};

export interface IM_keyword1FormState {
    excel_filename: IFormStateField<string>;
};

export interface ISyori_rireki1FormState {
    s1_id: IFormStateField<number>;
    modify_count: IFormStateField<number>;
    s_count: IFormStateField<number>;
    is_ok: IFormStateField<boolean>;
    sheet_count: IFormStateField<number>;
    ok_count: IFormStateField<number>;
    ng_count: IFormStateField<number>;
    start_time: IFormStateField<Date>;
    end_time: IFormStateField<Date>;
    percent: IFormStateField<number>;
    is_timeout: IFormStateField<boolean>;
    log: IFormStateField<string>;
    execute_ip: IFormStateField<string>;
    execute_port: IFormStateField<string>;
    on_purpose_ng: IFormStateField<boolean>;
    update_u_id: IFormStateField<number>;
    update_date: IFormStateField<Date>;
    delflg: IFormStateField<boolean>;
};

export interface IApp_envFormState {
    dumy_id: IFormStateField<number>;
    modify_count: IFormStateField<number>;
    dir_parametersheet: IFormStateField<string>;
    dir_processingscenario: IFormStateField<string>;
    dir_processedscenario: IFormStateField<string>;
    dir_testdata: IFormStateField<string>;
    dir_retentionperiod: IFormStateField<string>;
    dir_generationmanagement: IFormStateField<string>;
    dir_webdriver: IFormStateField<string>;
    dir_tmp: IFormStateField<string>;
    dir_testdataabbreviation: IFormStateField<string>;
    dir_retentionperiodabbreviation: IFormStateField<string>;
    dir_tmpabbreviation: IFormStateField<string>;
    del_days_tmp: IFormStateField<number>;
    del_days_retentionperiod: IFormStateField<number>;
    del_days_generationmanagement: IFormStateField<number>;
    del_days_processedscenario: IFormStateField<number>;
    del_days_log: IFormStateField<number>;
    del_days_processhistory: IFormStateField<number>;
    del_days_historyrecord: IFormStateField<number>;
    num_gm: IFormStateField<number>;
    timeout_m: IFormStateField<number>;
    log_cut: IFormStateField<number>;
    update_u_id: IFormStateField<number>;
    update_date: IFormStateField<Date>;
    tc_svn_update: IFormStateField<boolean>;
    delflg: IFormStateField<boolean>;
};

