import { IM_keyword2 } from "./m_keyword2.interface";

export interface IM_keyword1 {
    modify_count: number;
    excel: Blob;
    excel_filename: string;
    update_u_id: number;
    update_date: Date;
    m_keyword2s: { [keyword: string]: IM_keyword2 };
 }

 export class M_keyword1 implements IM_keyword1 {
    modify_count: number = 0;
    excel: Blob = new Blob([""], {type : 'application/json'});
    excel_filename: string = "";
    update_u_id: number = 0;
    update_date: Date = new Date();
    m_keyword2s: { [keyword: string]: IM_keyword2 } = {};
  
    constructor() {
      // コンストラクタでの初期化処理(型宣言時にデフォルト値を指定するので、コンストラクタは記載しなくても良い。のサンプル)
    }
}


 export enum M_keyword1ModificationStatus {
    None = 0,
    Create = 1,
    Edit = 2,
    History = 3
}
