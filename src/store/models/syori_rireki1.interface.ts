import { ISyori_rireki2 } from "./syori_rireki2.interface";

export interface ISyori_rireki1 {
    s1_id: number;
    s_count: number;
    syori_modify_count: number;
    m_keyword_modify_count: number;
    result_type: number;
    sheet_count: number;
    ok_count: number;
    ng_count: number;
    s_ng_count: number;
    start_time: Date;
    end_time: Date;
    percent: number;
    is_timeout: boolean;
    is_suspension: boolean;
    log: string;
    execute_ip: string;
    execute_port: string;
    update_u_id: number;
    update_date: Date;
    s_linking_ng: boolean;

    //(非DB項目)
    s1_name: string;
    update_user: string;

    syori_rireki2s: { [s2_id: number]: ISyori_rireki2 };
 }

 export class Syori_rireki1 implements ISyori_rireki1 {
    s1_id: number = 0;
    s_count: number = 0;
    syori_modify_count: number = 0;
    m_keyword_modify_count: number=0;
    result_type: number = 0;
    sheet_count: number = 0;
    ok_count: number = 0;
    ng_count: number = 0;
    s_ng_count: number = 0;
    start_time: Date = new Date();
    end_time: Date = new Date();
    percent: number = 0;
    is_timeout: boolean = false;
    is_suspension: boolean = false;
    log: string = "";
    execute_ip: string = "";
    execute_port: string= "";
    update_u_id: number = 0;
    update_date: Date = new Date();;
    s_linking_ng: boolean = false;

    s1_name: string = "";
    update_user: string = "";

    syori_rireki2s: { [s2_id: number]: ISyori_rireki2 } = {};
  
    constructor() {    }
 } 
   
 //処理履歴で3秒間の差異点滅機能に用いる
 export interface ISyori_rireki1_diff {
   s1_id: number;
   s_count: number;
   find_time: Date;//検索し差異として検知した時刻(3秒経過したら差異を消す仕組みで使う)
}
export class Syori_rireki1_diff implements ISyori_rireki1_diff {
   s1_id: number = 0;
   s_count: number = 0;
   find_time: Date = new Date();
}   

 export enum Syori_rireki1ModificationStatus {
    None = 0,
    Create = 1,
    Edit = 2,
    History = 3,
    detail = 4
}
