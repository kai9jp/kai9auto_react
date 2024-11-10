export interface ISyori_rireki3 {
    s1_id: number;
    s_count: number;
    s2_id: number;
    s3_id: number;
    syori_modify_count: number;
    result_type: number;
    is_ok: boolean;
    percent3: number;
    log: string;
    screen_shot_filepath: string;
    start_time: Date;
    end_time: Date;
    is_timeout: boolean;
    is_suspension: boolean;
    update_u_id: number;
    create_date: Date;
    update_date: Date;

    //処理3のカラム
    row: number;
    step: number;
    proc_cont: string;
    comment: string;
    sum: number;
    keyword: string;
    value1: string;
    value2: string;
    value3: string;
    variable1: string;
    ass_result: string;
    run_result: string;
    ng_stop: boolean;
    forced_run: boolean;    

    //非DB項目(キーワードマスタ)
    ok_result: string;
    ng_result: string;

 }
 
 export class Syori_rireki3 implements ISyori_rireki3 {
    s1_id: number = 0;
    s_count: number = 0;
    s2_id: number = 0;
    s3_id: number = 0;
    syori_modify_count: number= 0;
    result_type: number = 0;
    is_ok: boolean = false;
    percent3: number = 0;
    log: string = "";
    screen_shot_filepath: string = "";
    start_time: Date = new Date();
    end_time: Date = new Date();
    is_timeout: boolean = false;
    is_suspension: boolean = false;
    update_u_id: number = 0;
    create_date: Date = new Date();
    update_date: Date = new Date();
    constructor() {    }

    //処理3のカラム
    row: number = 0;
    step: number = 0;
    proc_cont: string = "";
    comment: string = "";
    sum: number = 0;
    keyword: string = "";
    value1: string = "";
    value2: string = "";
    value3: string = "";
    variable1: string = "";
    ass_result: string = "";
    run_result: string = "";
    ng_stop: boolean = false;
    forced_run: boolean = false;

    //非DB項目(キーワードマスタ)
    ok_result: string = "";
    ng_result: string= "";

 } 

 export enum Syori_rireki3ModificationStatus {
    None = 0,
    Create = 1,
    Edit = 2,
    History = 3
}
