export interface ISyori3 {
    s1_id: number;
    modify_count: number;
    s2_id: number;
    s3_id: number;
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
    start_time: Date;
    end_time: Date;
 }

 export class Syori3 implements ISyori3 {
    s1_id: number;
    modify_count: number;
    s2_id: number;
    s3_id: number;
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
    start_time: Date;
    end_time: Date;
  
    constructor() {
      // 各フィールドの初期値を設定
      this.s1_id = 0;
      this.modify_count = 0;
      this.s2_id = 0;
      this.s3_id = 0;
      this.row = 0;
      this.step = 0;
      this.proc_cont = '';
      this.comment = '';
      this.sum = 0;
      this.keyword = '';
      this.value1 = '';
      this.value2 = '';
      this.value3 = '';
      this.variable1 = '';
      this.ass_result = '';
      this.run_result = '';
      this.ng_stop = false;
      this.forced_run = false;
      this.start_time = new Date();
      this.end_time = new Date();
    }
  }