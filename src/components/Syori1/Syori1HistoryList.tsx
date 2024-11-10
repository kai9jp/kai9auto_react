import React, { Dispatch } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IStateType, ISyori1State } from "../../store/models/root.interface";
import { ISyori1, Syori1ModificationStatus } from "../../store/models/syori1.interface";
import styles from "./Syori1HistoryList.module.css";
import moment from 'moment';
import { callApi } from "../../common/comUtil";
import { setModificationState } from "../../store/actions/syori1.action";

export type syori1ListProps = {
  onSelect?: (syori1: ISyori1) => void;
  children?: React.ReactNode;
};


function Syori1HistoryList(props: syori1ListProps): JSX.Element  {
  const syori1s: ISyori1State = useSelector((state: IStateType) => state.syori1s);
  const dispatch: Dispatch<any> = useDispatch();

  const syori1Elements: (JSX.Element | null)[] = syori1s.Syori1Historys.map(syori1 => {


    //処理設定エクセルのダウンロード
    const s_excel_ClickDownloadButton = async (syori1: ISyori1)  => {
      const data = { 
        s1_id: syori1.s1_id,
        modify_count: syori1.modify_count
      };
      const response = await callApi('syori1_s_excel_download', data,'application/x-www-form-urlencoded',true);
      if (response && response.data){
        const blob = new Blob([response.data], { type: "application/octet-stream" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = syori1.s_excel_filename as string;
        a.click();
        a.remove();
        URL.revokeObjectURL(url); 
      }
    };

    if (!syori1) { return null; }
    return (<tr className={`table-row ${(syori1s.selectedSyori1 && syori1s.selectedSyori1.s1_id === syori1.s1_id) ? "selected" : ""}`}
      onClick={() => {
        if(props.onSelect) props.onSelect(syori1);
      }}
      key={`syori1_${syori1.s1_id}`}
      style={syori1.delflg === true ? { background: "#C0C0C0" } : {}}//削除データを灰色にする
      >
      <th scope="row">{syori1.modify_count}</th>
      <td>{syori1.s1_id}</td>
      <td>{syori1.s1_name}</td>
      <td>{syori1.api_url}</td>
      <td><button className="btn btn-outline-dark" onClick={() => { s_excel_ClickDownloadButton(syori1); }}>DownLoad</button></td>
      <td>{syori1.s_excel_filename}</td>
      <td>{syori1.bikou}</td>
      <td>{syori1.run_host}</td>
      {/* 改行コードをインナーhtmlでWEB形式の改行に置換 */}
      <td
        dangerouslySetInnerHTML={{
          __html: syori1.run_timing.replace(/\r?\n/g, "<br />"),
        }}
      ></td>
      <td>{syori1.execute_ip}</td>
      <td>{syori1.execute_port}</td>
      <td>{moment(syori1.execute_date).format('YYYY/MM/DD HH:mm:ss')}</td>
      <td>{syori1.col_s1_name}</td>
      <td>{syori1.col_s1_id}</td>
      <td>{syori1.col_run_host}</td>
      <td>{syori1.col_run_timing}</td>
      <td>{syori1.col_run_parameter}</td>
      <td>{syori1.col_bikou}</td>
      <td>{syori1.col_run_order}</td>
      <td>{syori1.col_sheetname}</td>
      <td>{syori1.col_is_do}</td>
      <td>{syori1.col_is_normal}</td>
      <td>{syori1.col_r_start_time}</td>
      <td>{syori1.col_r_end_time}</td>
      <td>{syori1.col_result}</td>
      <td>{syori1.col_ng_stop}</td>
      <td>{syori1.col_scenario}</td>
      <td>{syori1.col_s_outline}</td>
      <td>{syori1.update_u_id}</td>
      <td>{moment(syori1.update_date).format('YYYY/MM/DD HH:mm:ss')}</td>
      <td>{syori1.delflg? "〇":""}</td>
    </tr>);
  });

  return (
    <div className="row">
      <div className="col-xl-12">
        <div className="card shadow mb-4">

          <div className="card-header" id="syori1_history_header">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h6 className="mt-3 font-weight-bold text-green col-md-5 ">変更履歴</h6>
              <i className={`fas fa fa-history fa-2x ${styles.historyPosition}`} title="履歴"></i>
              <button type="submit" className="btn btn-success ml-2 btn-black" onClick={() => {dispatch(setModificationState(Syori1ModificationStatus.None));}}>
                      ×
              </button>
            </div>
          </div>
           
          <div className="card-body">
            <div className={`table-responsive ${styles.tableResponsive} ${styles.portlet400}`}>
              <table className="table">
                <thead className="thead-light ">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">処理No_1</th>
                    <th scope="col">処理名称</th>
                    <th scope="col">APIアドレス</th>
                    <th scope="col">シナリオエクセル</th>
                    <th scope="col">シナリオファイル名</th>
                    <th scope="col">備考</th>
                    <th scope="col">実施時刻</th>
                    <th scope="col">前回実行IP</th>
                    <th scope="col">前回実行ポート</th>
                    <th scope="col">前回実行時刻</th>
                    <th scope="col">列番号)処理名</th>
                    <th scope="col">列番号)処理No</th>
                    <th scope="col">列番号)実行時刻</th>
                    <th scope="col">列番号)実行時引数</th>
                    <th scope="col">列番号)備考</th>
                    <th scope="col">列番号)実行順</th>
                    <th scope="col">列番号)シート名</th>
                    <th scope="col">列番号)実施FLG</th>
                    <th scope="col">列番号)正常/異常</th>
                    <th scope="col">列番号)実行結果_開始</th>
                    <th scope="col">列番号)実行結果_終了</th>
                    <th scope="col">列番号)実行結果_結果</th>
                    <th scope="col">列番号)NGで停止</th>
                    <th scope="col">列番号)シナリオ</th>
                    <th scope="col">列番号)処理概要</th>
                    <th scope="col">更新者</th>
                    <th scope="col">更新日時</th>
                    <th scope="col">削除フラグ</th>
                  </tr>
                </thead>
                <tbody>
                  {syori1Elements}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}

export default Syori1HistoryList;
