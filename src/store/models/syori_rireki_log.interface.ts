export interface ISyori_rireki_log {
    s1_id: number;
    modify_count: number;
    s_count: number;
    s2_id: number;
    l_count: number;
    log: string;
    update_u_id: number;
    update_date: Date;
    delflg: boolean;
 }
             
 export enum Syori_rireki_logModificationStatus {
    None = 0,
    Create = 1,
    Edit = 2,
    History = 3
}
