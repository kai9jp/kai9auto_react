import React,{useState,useEffect} from "react";
import { useSelector } from "react-redux";
import { ISyori1 } from "../../store/models/syori1.interface";
import { IStateType, ISyori1State} from "../../store/models/root.interface";
import moment from 'moment';
import { callApi } from "../../common/comUtil";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle } from '@fortawesome/free-solid-svg-icons';
import styles from "./Syori1List.module.css";

export type syori1ListProps = {
  onSelect?: (syori1: ISyori1) => void;
  children?: React.ReactNode;
  height:any;
};

function Syori1List(props: syori1ListProps): JSX.Element  {
  const syori1s: ISyori1State = useSelector((state: IStateType) => state.syori1s);

  const syori1Elements: (JSX.Element | null)[] = syori1s.Syori1s.map(syori1 => {

    const exec_Button = async (syori1: ISyori1)  => {
      const data = {s1_id: syori1.s1_id};

      //API発行
      await callApi('exec_syori', data,'application/x-www-form-urlencoded');
    }

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
    return (<tr className={`tableRow ${(syori1s.selectedSyori1 && syori1s.selectedSyori1.s1_id === syori1.s1_id) ? styles.selected : ""} ${syori1.delflg ? styles.deleted : ""}`}
    
      onClick={() => {
        if(props.onSelect) props.onSelect(syori1);
      }}
      key={`syori1_${syori1.s1_id}`}
      >
      <th scope="row">{syori1.s1_id}</th>
      <td><button className="btn btn-outline-dark" onClick={() => { exec_Button(syori1); }}> <FontAwesomeIcon icon={faPlayCircle} /></button></td>
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
    <div className={`table-responsive portlet ${styles.tableResponsive}`} style={{ maxHeight: props.height }}>
      <table className="table">
        <thead className="thead-light ">
          <tr>
            <th scope="col">#</th>
            <th scope="col">即時実行</th>
            <th scope="col">処理名称</th>
            <th scope="col">APIアドレス</th>
            <th scope="col">シナリオエクセル</th>
            <th scope="col">シナリオファイル名</th>
            <th scope="col">備考</th>
            <th scope="col">実行ホスト</th>
            <th scope="col">実行時刻</th>
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

  );
}

export default Syori1List;
