import React from "react";
import { useSelector } from "react-redux";
import { IStateType, IM_keyword1State} from "../../store/models/root.interface";
import { IM_keyword2 } from "../../store/models/m_keyword2.interface";

export type m_keyword2ListProps = {
  onSelect?: (M_keyword2: IM_keyword2) => void;
  children?: React.ReactNode;
  height:any;
};

function M_keyword2List(props: m_keyword2ListProps): JSX.Element  {
  const m_keyword1s: IM_keyword1State = useSelector((state: IStateType) => state.m_keyword1s);
  
  const m_keyword2Values: IM_keyword2[] = Object.values(m_keyword1s.M_keyword2s);
  const m_keyword2Elements: (JSX.Element | null)[] = m_keyword2Values.map(m_keyword2 => {
    if (!m_keyword2) { return null; }
    return (
      <tr key={m_keyword2.no} className={`table-row ${(m_keyword1s.selectedM_keyword2 && m_keyword1s.selectedM_keyword2.keyword === m_keyword2.keyword) ? "selected" : ""}`}
        onClick={() => {
          if(props.onSelect) props.onSelect(m_keyword2);
        }}
      >
      <th scope="row">{m_keyword2.no}</th>
      <td>{m_keyword2.keyword}</td>
      <td>{m_keyword2.func_name}</td>
      <td>{m_keyword2.ok_result}</td>
      <td>{m_keyword2.ng_result}</td>
      <td>{m_keyword2.param1}</td>
      <td>{m_keyword2.param2}</td>
      <td>{m_keyword2.param3}</td>
      <td>{m_keyword2.variable1}</td>
    </tr>);
  });


  return (
    <div className="table-responsive portlet" style={{ maxHeight: props.height }}>
      <table className="table">
        <thead className="thead-light ">
          <tr>
          <th scope="col">NO</th>
          <th scope="col">キーワード</th>
          <th scope="col">クラス名</th>
          <th scope="col">関数名</th>
          <th scope="col">OK文言</th>
          <th scope="col">NG文言</th>
          <th scope="col">第1引数</th>
          <th scope="col">第2引数</th>
          <th scope="col">第3引数</th>
          <th scope="col">変数</th>
          <th scope="col">備考</th>
          </tr>
        </thead>
        <tbody>
          {m_keyword2Elements}
        </tbody>
      </table>
    </div>

  );
}

export default M_keyword2List;
