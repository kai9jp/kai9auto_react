import React, { Dispatch } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IStateType, IM_keyword1State } from "../../store/models/root.interface";
import { IM_keyword1, M_keyword1ModificationStatus } from "../../store/models/m_keyword1.interface";
import styles from "./M_keyword1HistoryList.module.css";
import moment from 'moment';
import {API_URL} from "../../common/constants";
import axios from 'axios';
import Swal from 'sweetalert2';
import { setModificationState } from "store/actions/m_keyword1.action";
import { callApi } from "common/comUtil";

export type m_keyword1ListProps = {
  onSelect?: (m_keyword1: IM_keyword1) => void;
  children?: React.ReactNode;
};


function M_keyword1HistoryList(props: m_keyword1ListProps): JSX.Element  {
  const m_keyword1s: IM_keyword1State = useSelector((state: IStateType) => state.m_keyword1s);
  const dispatch: Dispatch<any> = useDispatch();

  const m_keyword1Elements: (JSX.Element | null)[] = m_keyword1s.M_keyword1Historys.map(m_keyword1 => {
    const excel_ClickDownloadButton = async (m_keyword1: IM_keyword1)  => {
      const data = { modify_count: m_keyword1.modify_count};
      const response = await callApi('m_keyword1_excel_download', data,'application/x-www-form-urlencoded',true);
      if (response && response.data){
        const blob = new Blob([response.data], { type: "application/octet-stream" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = m_keyword1.excel_filename as string;
        a.click();
        a.remove();
        URL.revokeObjectURL(url); 
      }
    };

    if (!m_keyword1) { return null; }
    return (<tr className={`table-row ${(m_keyword1s.M_keyword1s[0]) ? "selected" : ""}`}
      onClick={() => {
        if(props.onSelect) props.onSelect(m_keyword1);
      }}
      >
      <th scope="row">{m_keyword1.modify_count}</th>
      <td><button className="btn btn-outline-dark" onClick={() => { excel_ClickDownloadButton(m_keyword1); }}>DownLoad</button></td>
      <td>{m_keyword1.excel_filename}</td>
      <td>{m_keyword1.update_u_id}</td>
      <td>{moment(m_keyword1.update_date).format('YYYY/MM/DD HH:mm:ss')}</td>
    </tr>);
  });

  function cancelForm(): void {
    dispatch(setModificationState(M_keyword1ModificationStatus.None));
  }

  return (
    <div className="row">
      <div className="col-xl-12">
        <div className="card shadow mb-4">
          <div className="card-header" id="m_keyword1_history_header">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

              <h6 className="mt-3 font-weight-bold text-green col-md-5 ">変更履歴</h6>
              <i className={`fas fa fa-history fa-2x ${styles.historyPosition}`} title="履歴"></i>
              <button type="submit" className="btn btn-dark  ml-2" onClick={() => cancelForm()}>
                ×
              </button>
            </div>  
            <hr></hr>
            <div className="card-body">
              <div className={`table-responsive ${styles.tableResponsive} ${styles.portlet400}`}>
                <table className="table">
                  <thead className="thead-light ">
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">エクセル</th>
                      <th scope="col">エクセルファイル名</th>
                      <th scope="col">更新者</th>
                      <th scope="col">更新日時</th>
                    </tr>
                  </thead>
                  <tbody>
                    {m_keyword1Elements}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}

export default M_keyword1HistoryList;
