import { ISyori_rireki3 } from "./syori_rireki3.interface";

export interface ISyori_rireki2 {
    s1_id: number;
    s_count: number;
    s2_id: number;
    run_order: number;
    result_type: number;
    ok_count: number;
    ng_count: number;
    s_ng_count: number;
    percent2: number;
    percent3: number;
    log: string;
    r_summary: string;
    start_time: Date;
    end_time: Date;
    is_timeout: boolean;
    is_suspension: boolean;
    update_u_id: number;
    create_date: Date;
    update_date: Date;

    //処理2のカラム
    is_do: boolean;
    sheetname: string;
    ng_stop: boolean;
    scenario: string;
    s_outline: string;

    syori_rireki3s: { [s3_id: number]: ISyori_rireki3 };
 }
             
 export class Syori_rireki2 implements ISyori_rireki2 {
    s1_id: number = 0;
    s_count: number = 0;
    s2_id: number = 0;
    run_order: number = 0;
    result_type: number = 0;
    ok_count: number = 0;
    ng_count: number = 0;
    s_ng_count: number = 0;
    percent2: number = 0;
    percent3: number = 0;
    log: string = "";
    r_summary: string = "";
    start_time: Date = new Date();
    end_time: Date = new Date();
    is_timeout: boolean = false;
    is_suspension: boolean = false;
    update_u_id: number = 0;
    create_date: Date = new Date();
    update_date: Date = new Date();

    //処理2のカラム
    is_do: boolean = false; 
    sheetname: string = ""; 
    ng_stop: boolean = false;
    scenario: string = ""; 
    s_outline: string = ""; 

    syori_rireki3s: { [s3_id: number]: ISyori_rireki3 } = {};
  
    constructor() {    }
 } 

 export enum Syori_rireki2ModificationStatus {
    None = 0,
    Create = 1,
    Edit = 2,
    History = 3
}
