export interface IM_keyword2 {
    modify_count: number;
    no: number;
    keyword: string;
    func_name: string;
    ok_result: string;
    ng_result: string;
    param1: string;
    param2: string;
    param3: string;
    variable1: string;
    bikou: string;
 }

 export class M_keyword2 implements IM_keyword2 {
    modify_count: number = 0;
    no: number = 0;
    keyword: string = "";
    func_name: string = "";
    ok_result: string = "";
    ng_result: string = "";
    param1: string = "";
    param2: string = "";
    param3: string = "";
    variable1: string = "";
    bikou: string = "";
  
    constructor() {
      // コンストラクタでの初期化処理(型宣言時にデフォルト値を指定するので、コンストラクタは記載しなくても良い。のサンプル)
    }
}



 export enum M_keyword2ModificationStatus {
    None = 0,
    Create = 1,
    Edit = 2,
    History = 3
}
