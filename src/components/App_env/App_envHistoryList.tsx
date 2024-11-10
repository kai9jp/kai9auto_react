import React, { Dispatch, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IStateType, IApp_envState } from "../../store/models/root.interface";
import { IApp_env, App_envModificationStatus } from "../../store/models/app_env.interface";
import "./App_env.css";
import "./App_envHistoryList.css";
import moment from 'moment';
import { setModificationState } from "../../store/actions/app_env.action";

export type App_envListProps = {
  children?: React.ReactNode;
};


function App_envHistoryList(props: App_envListProps): JSX.Element  {
  const App_envs: IApp_envState = useSelector((state: IStateType) => state.App_envs);
  const dispatch: Dispatch<any> = useDispatch();

  //行選択用の変数と関数
  const [select_record, setselect_record] = useState<IApp_env | null>(null);
  function onSelect(record: IApp_env): void {
    setselect_record(record);
  }


  const App_envElements: (JSX.Element | null)[] = App_envs.App_envHistorys.map(App_env => {
    if (!App_env) { return null; }
    return (<tr className={`table-row ${(select_record && select_record.modify_count === App_env.modify_count) ? "selected" : ""}`}
      onClick={() => {
        onSelect(App_env);
      }}
      key={`App_env_${App_env.modify_count}`}
      >
      <th scope="row">{App_env.modify_count}</th>
      <td>{App_env.dir_parametersheet}</td>
      <td>{App_env.dir_processingscenario}</td>
      <td>{App_env.dir_processedscenario}</td>
      <td>{App_env.dir_testdata}</td>
      <td>{App_env.dir_retentionperiod}</td>
      <td>{App_env.dir_generationmanagement}</td>
      <td>{App_env.dir_web_screenshot}</td>
      <td>{App_env.dir_tmp}</td>
      <td>{App_env.path_webdriver_edge}</td>
      <td>{App_env.path_webdriver_firefox}</td>
      <td>{App_env.path_webdriver_chrome}</td>
      <td>{App_env.path_binary_edge}</td>
      <td>{App_env.path_binary_firefox}</td>
      <td>{App_env.path_binary_chrome}</td>
      <td>{App_env.dir_testdataabbreviation}</td>
      <td>{App_env.dir_retentionperiodabbreviation}</td>
      <td>{App_env.dir_tmpabbreviation}</td>
      <td>{App_env.del_days_tmp}</td>
      <td>{App_env.del_days_retentionperiod}</td>
      <td>{App_env.del_days_generationmanagement}</td>
      <td>{App_env.del_days_processedscenario}</td>
      <td>{App_env.del_days_log}</td>
      <td>{App_env.del_days_processhistory}</td>
      <td>{App_env.del_days_historyrecord}</td>
      <td>{App_env.del_days_web_screenshot}</td>
      <td>{App_env.num_gm}</td>
      <td>{App_env.timeout_m}</td>
      <td>{App_env.log_cut}</td>
      <td>{App_env.update_u_id}</td>
      <td>{moment(App_env.update_date).format('YYYY/MM/DD HH:mm:ss')}</td>
      <td>{App_env.tc_svn_update? "〇":""}</td>
    </tr>);
  });

  return (
    <div className="row">
      <div className="col-xl-12">
        <div className="card shadow mb-4">

          <div className="card-header" id="App_env_history_header">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h6 className="mt-3 font-weight-bold text-green col-md-5 ">変更履歴</h6>
              <i className="fas fa fa-history fa-2x history_position" title="履歴"></i>
              <button type="submit" className="btn btn-success ml-2 btn-black" onClick={() => {dispatch(setModificationState(App_envModificationStatus.None));}}>
                      ×
              </button>
            </div>
          </div>

          <div className="card-body">
            <div className="table-responsive portlet400">
              <table className="table">
                <thead className="thead-light ">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">DIR_パラメータシート</th>
                    <th scope="col">DIR_処理シナリオ</th>
                    <th scope="col">DIR_処理済シナリオ</th>
                    <th scope="col">DIR_テストデータ</th>
                    <th scope="col">DIR_一定期間保存</th>
                    <th scope="col">DIR_世代管理</th>
                    <th scope="col">DIR_TMP</th>
                    <th scope="col">DIR_WEBスクリーンショット</th>
                    <th scope="col">PATH_WebDriver(edge)</th>
                    <th scope="col">PATH_WebDriver(firefox)</th>
                    <th scope="col">PATH_WebDriver(chrome)</th>
                    <th scope="col">ブラウザパス(edge)</th>
                    <th scope="col">ブラウザパス(firefox)</th>
                    <th scope="col">ブラウザパス(chrome)</th>
                    <th scope="col">DIR_テストデータ略称</th>
                    <th scope="col">DIR_一定期間保存略称</th>
                    <th scope="col">DIR_TMP略称</th>
                    <th scope="col">[経過日数]tmpフォルダ削除</th>
                    <th scope="col">[経過日数]一定期間保存</th>
                    <th scope="col">[経過日数]世代管理</th>
                    <th scope="col">[経過日数]処理済シナリオ</th>
                    <th scope="col">[経過日数]ログ</th>
                    <th scope="col">[経過日数]処理履歴</th>
                    <th scope="col">[経過日数]履歴レコード</th>
                    <th scope="col">[経過日数]WEBスクショ</th>
                    <th scope="col">世代管理数</th>
                    <th scope="col">タイムアウト分数</th>
                    <th scope="col">ログ打ち切り行数</th>
                    <th scope="col">更新者</th>
                    <th scope="col">更新日時</th>
                    <th scope="col">自動SVN更新</th>
                  </tr>
                </thead>
                <tbody>
                  {App_envElements}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}

export default App_envHistoryList;
