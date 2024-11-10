export interface IApp_env {
    modify_count: number;
    dir_parametersheet: string;
    dir_processingscenario: string;
    dir_processedscenario: string;
    dir_testdata: string;
    dir_retentionperiod: string;
    dir_generationmanagement: string;
    dir_web_screenshot: string;
    dir_tmp: string;
    path_webdriver_edge: string;
    path_webdriver_firefox: string;
    path_webdriver_chrome: string;
    path_binary_edge: string;
    path_binary_firefox: string;
    path_binary_chrome: string;
    dir_testdataabbreviation: string;
    dir_retentionperiodabbreviation: string;
    dir_tmpabbreviation: string;
    del_days_tmp: number;
    del_days_retentionperiod: number;
    del_days_generationmanagement: number;
    del_days_processedscenario: number;
    del_days_log: number;
    del_days_processhistory: number;
    del_days_historyrecord: number;
    del_days_web_screenshot: number;
    num_gm: number;
    timeout_m: number;
    log_cut: number;
    update_u_id: number;
    update_date: Date;
    tc_svn_update: boolean;
 }
             
 export enum App_envModificationStatus {
    None = 0,
    Create = 1,
    Edit = 2,
    History = 3
}
