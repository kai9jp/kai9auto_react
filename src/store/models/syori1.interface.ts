import { ISyori2 } from "./syori2.interface";

export interface ISyori1 {
    s1_id: number;
    modify_count: number;
    s1_name: string;
    run_timing: string;
    run_host: string;
    execute_ip: string;
    execute_port: string;
    execute_date: Date;
    api_url: string;
    bikou: string;
    s_excel: Blob;
    s_excel_filename: string;
    col_s1_name: number;
    col_s1_id: number;
    col_run_host: number;
    col_run_timing: number;
    col_run_parameter: number;
    col_bikou: number;
    col_run_order: number;
    col_sheetname: number;
    col_is_do: number;
    col_is_normal: number;
    col_r_start_time: number;
    col_r_end_time: number;
    col_result: number;
    col_ng_stop: number;
    col_scenario: number;
    col_s_outline: number;
    update_u_id: number;
    update_date: Date;
    delflg: boolean;
    syori2s: { [s2_id: number]: ISyori2 };

 }
             
 export class Syori1 implements ISyori1 {
    s1_id: number = 0;
    modify_count: number = 0;
    s1_name: string = "";
    run_host: string = "";
    run_timing: string = "";
    execute_ip: string = "";
    execute_port: string = "";
    execute_date: Date = new Date();
    api_url: string = "";
    bikou: string = "";
    s_excel: Blob = new Blob([""], {type : 'application/json'});
    s_excel_filename: string = "";
    col_s1_name: number = 0;
    col_s1_id: number = 0;
    col_run_host: number = 0;
    col_run_timing: number = 0;
    col_run_parameter: number = 0;
    col_bikou: number = 0;
    col_run_order: number = 0;
    col_sheetname: number = 0;
    col_is_do: number = 0;
    col_is_normal: number = 0;
    col_r_start_time: number = 0;
    col_r_end_time: number = 0;
    col_result: number = 0;
    col_ng_stop: number = 0;
    col_scenario: number = 0;
    col_s_outline: number = 0;
    update_u_id: number = 0;
    update_date: Date = new Date();
    delflg: boolean = false;
    syori2s: { [s2_id: number]: ISyori2 } = {};
  
    constructor() {
      // コンストラクタでの初期化処理(型宣言時にデフォルト値を指定するので、コンストラクタは記載しなくても良い。のサンプル)
    }
}

 export enum Syori1ModificationStatus {
    None = 0,
    Create = 1,
    Edit = 2,
    History = 3
}

