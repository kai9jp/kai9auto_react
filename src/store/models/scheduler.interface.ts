export interface IScheduler {
    sc_pk: number;
    modify_count: number;
    function_name: string;
    schedule_label: string;
    schedule_pattern: string;
    execution_time: string;
    weekdays: string;
    weeks_number: string;
    execution_day: number;
    month_end_n_days_ago: number;
    recurring_interval: number;
    recurring_end_time: string;
    bikou: string;
    update_u_id: number;
    update_date: Date;
    delflg: boolean;
    //(非DB項目)
    update_user: string;
}
             
export enum SchedulerModificationStatus {
    None = 0,
    Create = 1,
    Edit = 2,
    History = 3
}

export const defaultScheduler: IScheduler = {
    sc_pk: 0,
    modify_count: 0,
    schedule_label: '',
    function_name: '',
    schedule_pattern: '毎日',
    execution_time: '00:00',
    weekdays: '', // カンマ区切りの文字列
    weeks_number: '', // カンマ区切りの文字列
    execution_day: 0,
    month_end_n_days_ago: 0,
    recurring_interval: 0,
    recurring_end_time: '00:00',
    bikou: '',
    update_u_id: 1,
    update_date: new Date(),
    delflg: false,
    update_user: '',
  };

// スケジュールパターンや曜日オプションの定義
export const schedulePatternOptions = [
    { label: "毎日", value: "毎日" },
    { label: "毎週", value: "毎週" },
    { label: "毎月", value: "毎月" },
    { label: "毎月(月末)", value: "毎月(月末)" },
    { label: "第N曜日", value: "第N曜日" },
];
  
export const weekdaysOptions = [
    { label: "月", value: "月" },
    { label: "火", value: "火" },
    { label: "水", value: "水" },
    { label: "木", value: "木" },
    { label: "金", value: "金" },
    { label: "土", value: "土" },
    { label: "日", value: "日" },
];

export const weeksNumberOptions = [
    { label: "第1", value: "第1" },
    { label: "第2", value: "第2" },
    { label: "第3", value: "第3" },
    { label: "第4", value: "第4" },
    { label: "第5", value: "第5" },
];
  