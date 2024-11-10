import { ISyori3 } from "./syori3.interface";

export interface ISyori2 {
    s1_id: number;
    modify_count: number;
    s2_id: number;
    run_order: number;
    sheetname: string;
    is_do: boolean;
    is_normal: boolean;
    ng_stop: boolean;
    forced_run: boolean;
    scenario: string;
    s_outline: string;
    step_count: number;
    col_step: number;
    col_proc_cont: number;
    col_comment: number;
    col_sum: number;
    col_keyword: number;
    col_value1: number;
    col_value2: number;
    col_value3: number;
    col_variable1: number;
    col_ass_result: number;
    col_run_result: number;
    col_ass_diff: number;
    col_ng_stop: number;
    col_start_time: number;
    col_end_time: number;
    col_sum_time: number;
    col_log: number;
    row_log: number;
    syori3s: { [step: number]: ISyori3 };
 }
 
 export class Syori2 implements ISyori2 {
    s1_id: number;
    modify_count: number;
    s2_id: number;
    run_order: number;
    sheetname: string;
    is_do: boolean;
    is_normal: boolean;
    ng_stop: boolean;
    forced_run: boolean;
    scenario: string;
    s_outline: string;
    step_count: number;
    col_step: number;
    col_proc_cont: number;
    col_comment: number;
    col_sum: number;
    col_keyword: number;
    col_value1: number;
    col_value2: number;
    col_value3: number;
    col_variable1: number;
    col_ass_result: number;
    col_run_result: number;
    col_ass_diff: number;
    col_ng_stop: number;
    col_start_time: number;
    col_end_time: number;
    col_sum_time: number;
    col_log: number;
    row_log: number;
    syori3s: { [step: number]: ISyori3 };
  
    constructor() {
      // 各フィールドの初期値を設定
      this.s1_id = 0;
      this.modify_count = 0;
      this.s2_id = 0;
      this.run_order = 0;
      this.sheetname = '';
      this.is_do = false;
      this.is_normal = false;
      this.ng_stop = false;
      this.forced_run = false;
      this.scenario = '';
      this.s_outline = '';
      this.step_count = 0;
      this.col_step = 0;
      this.col_proc_cont = 0;
      this.col_comment = 0;
      this.col_sum = 0;
      this.col_keyword = 0;
      this.col_value1 = 0;
      this.col_value2 = 0;
      this.col_value3 = 0;
      this.col_variable1 = 0;
      this.col_ass_result = 0;
      this.col_run_result = 0;
      this.col_ass_diff = 0;
      this.col_ng_stop = 0;
      this.col_start_time = 0;
      this.col_end_time = 0;
      this.col_sum_time = 0;
      this.col_log = 0;
      this.row_log = 0;
      this.syori3s = [];
    }
  }
