import React, { Dispatch, useState, useEffect, createRef } from "react";
import { ISyori_rireki2, Syori_rireki2 } from '../../store/models/syori_rireki2.interface';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck,  faCircleXmark,  faHand,  faHourglassEnd,  faRectangleList, faThumbsUp, faXmark } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import ProgressBar from 'react-bootstrap/esm/ProgressBar';
import LogModal from '../../common/components/ModalPopUp';
import { INotificationState, IStateType, ISyori_rireki1State } from '../../store/models/root.interface';
import { useDispatch, useSelector } from 'react-redux';
import { callApi } from '../../common/comUtil';
import styles from "./Syori_rireki2List_tab.module.css";
import { Syori1 } from '../../store/models/syori1.interface';
import { remove_diff_s1_id_s_counts, setModificationState2} from '../../store/actions/syori_rireki1.action';
import { ISyori_rireki1, Syori_rireki1ModificationStatus } from "store/models/syori_rireki1.interface";
import CustomTable from "common/components/CustomTableProps ";
import Checkbox from "common/components/Checkbox";
import NumberInput from "common/components/NumberInput";
import { OnChangeModel } from "non_common/types/Form.types";

//-------------------------------------------------------------
//Syori_rireki2
//-------------------------------------------------------------
export type Syori_Rireki2Props = {
  CardFooterBottom1:number;
  CustomTableParentRef:any;
  setCardFooterBottom2:any;
  activeTab:string;
  FindInterval:number;
  selected_syori_rireki1:ISyori_rireki1 | null;
  selected_syori_rireki2:ISyori_rireki2 | null;
  onSyori_rireki2Select:any;
  shouldBlink_syori_rireki1:ISyori_rireki1 | null;
  shouldBlink:boolean;
  selected_s1_id:number;
  selected_s2_id:number;
}
export const Syori_Rireki2 = (props:Syori_Rireki2Props) => {
  const dispatch: Dispatch<any> = useDispatch();
  const contentRef2 = createRef<HTMLDivElement>();
  const [TableHeight2, setTableHeight2] = useState('auto');

  //表示データ管理用
  const [syori_rireki2s, setSyori_rireki2s] = useState<ISyori_rireki2[] | null>([]);
  const [isApiError, setIsApiError] = useState(false);
  const [isNeedFindPolling, setisNeedFindPolling] = useState(false);

  //ローカルストレージ保存対象
  const [display_character_limit, setdisplay_character_limit] = React.useState(0);
  const [isTextLimitChecked, setisTextLimitChecked] = React.useState(true);
  const [isTableNoWrapChecked, setisTableNoWrapChecked] = React.useState(true);

  //検索用
  const [isFindingSyoriRireki2, setIsFindingSyoriRireki2] = useState(false);


//検索
async function FindSyori_rireki2(isChangeSelectedSyori1: boolean): Promise<void> {
  if (!isChangeSelectedSyori1 && props.activeTab !== "tab2") {
    return;
  }
  if (!props.selected_syori_rireki1) {
    return;
  }

  if (isFindingSyoriRireki2) return; // 実行中なら何もしない
  try {
    setIsFindingSyoriRireki2(true);
      let data = {
      s1_id: props.selected_syori_rireki1.s1_id,
      s_count: props.selected_syori_rireki1.s_count,
      syori_modify_count: props.selected_syori_rireki1.syori_modify_count,
    };

    // API発行
    try {
      const response = await callApi('syori_rireki2_tab_find', data, 'application/x-www-form-urlencoded');

      // 初期化
      if (syori_rireki2s) {
        setSyori_rireki2s(null);
      }

      if (response && response.data && response.data.data) {
        const data: ISyori_rireki2[] = JSON.parse(response.data.data);
        if (data) {
          data.map((value: ISyori_rireki2) => {
            const sr2 = new Syori_rireki2();
            Object.assign(sr2, value);
            setSyori_rireki2s(prev => [...(prev || []), sr2]);
          });

          //選択状態の制御
          for (let index = data.length - 1; index >= 0; index--) {//逆順ループ
            const value = data[index];
            const sr2 = new Syori_rireki2();
            Object.assign(sr2, value);
            if (isChangeSelectedSyori1) {
              if (props.selected_s1_id === sr2.s1_id && props.selected_s2_id === sr2.s2_id) {
                //記憶してた選択行と同じものがあれば再選択する
                props.onSyori_rireki2Select(sr2);
                break;
              } else if (index === 0) {
                //とりあえず1コレード目をアクティブにする
                props.onSyori_rireki2Select(sr2);
              }
            }
          }
        }
        setIsApiError(false); //APIエラー発生フラグのリセット

      } else {
        setIsApiError(true);
        throw new Error('API Error');
      }
    } catch (error) {
      setIsApiError(true);
      throw error;
    }
  } finally {
    setIsFindingSyoriRireki2(false);
  }

}



  //タイトルの表示箇所
  const title2 = () => {
    return(
      <>
        <div className="d-flex align-items-center"style={{top:"-10px"}} id="Syori_rireki2s_detail">

          {/* 動的に表示対象が変わった場合、点滅させる */}
          <h6 className={`mt-0 font-weight-bold text-green ${props.shouldBlink ? styles.blink : ''}`} style={{ margin: '0' }}>
            {props.selected_syori_rireki1 &&(
              // `子) 処理No[${props.selected_syori_rireki1.s1_id}:${props.selected_syori_rireki1.s1_name}] 処理回数[${props.selected_syori_rireki1.s_count}]` }
            <>
            子) 処理No:
            <span style={{ color: 'black' }}>
              {props.selected_syori_rireki1.s1_id}:{props.selected_syori_rireki1.s1_name}
            </span>
            /処理回数:
            <span style={{ color: 'black' }}>
              {props.selected_syori_rireki1.s_count}
            </span>
            </>
            )}
          </h6>
          {props.shouldBlink ? (
            // アイコンを点滅
            <i className={`fa fa-forward-fast ${styles.blink}`} style={{ color: 'blue',marginLeft:"8px" }}></i>
          ) : null}
        </div>

      </>
    )
  };

  //テーブルの表示箇所
  const tableContent2 = () => {
    return(
    <>
      {props.selected_syori_rireki1?
        <Syori_rireki2List 
          onSelect={props.onSyori_rireki2Select}
          syori_rireki2s={syori_rireki2s} 
          isTextLimitChecked={isTextLimitChecked}
          isTableNoWrapChecked={isTableNoWrapChecked}
          TableHeight={TableHeight2}
          display_character_limit={display_character_limit}
          selected_syori_rireki1={props.selected_syori_rireki1}
          selected_syori_rireki2={props.selected_syori_rireki2}
                /> 
      :
        null
      }
    </>
    )
  };
    
  // ローカルストレージへの保存
  function func_setdisplay_character_limit(value:number){
    const data = { 
      display_character_limit: value ,
      isTextLimitChecked: isTextLimitChecked ,
      isTableNoWrapChecked: isTableNoWrapChecked 
    };
    localStorage.setItem("Syori_rireki2", JSON.stringify(data));
    setdisplay_character_limit(value);
  }
  function func_setisTextLimitChecked(value:boolean){
    const data = { 
      display_character_limit: display_character_limit ,
      isTextLimitChecked: value ,
      isTableNoWrapChecked: isTableNoWrapChecked 
    };
    localStorage.setItem("Syori_rireki2", JSON.stringify(data));
    setisTextLimitChecked(value);
  }
  function func_setisTableNoWrapChecked(value:boolean){
    const data = { 
      display_character_limit: display_character_limit ,
      isTextLimitChecked: isTextLimitChecked ,
      isTableNoWrapChecked: value 
    };
    localStorage.setItem("Syori_rireki2", JSON.stringify(data));
    setisTableNoWrapChecked(value);
  }

  // ローカルストレージからの読み込み
  useEffect(() => {
    //既に初期値(0)以外が入っている場合は何もしない
    if (display_character_limit != 0) return;

    const savedData = localStorage.getItem("Syori_rireki2");
    if (savedData) {
        const parseData = JSON.parse(savedData);
        setdisplay_character_limit(parseData.display_character_limit);
        setisTextLimitChecked(parseData.isTextLimitChecked);
        setisTableNoWrapChecked(parseData.isTableNoWrapChecked);
    }else{
        //ストレージに無い場合は初期値をセット
        setdisplay_character_limit(10);
        setisTextLimitChecked(true);
        setisTableNoWrapChecked(true);
    }
  }, []);

  //ヘッダーボタン各種の表示箇所
  const headerButtons2 = (
    <>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
          <div style={{ marginRight: '8px', minWidth: '130px', marginTop:'10px' }}>
            <Checkbox
              id="display_character_check2"
              value={isTextLimitChecked}
              field="display_character_check2"
              onChange={() => func_setisTextLimitChecked(!isTextLimitChecked)}
              label="表示文字制限"
            />
          </div>

          <div style={{ marginRight: '8px', width: '100px'  }}>
            <NumberInput id="display_character_limit"
                noFormGroup={true}
                value={display_character_limit}
                field=""
                onChange={(model: OnChangeModel) => func_setdisplay_character_limit(Number(model.value))}
                label=""
                disabled={!isTextLimitChecked}
                // rendドラッグ機能で移動されてしまう事象を回避
                onMouseDown={(event: { stopPropagation: () => void; }) => {
                  event.stopPropagation();
                }}                            
            />
          </div>

          <div style={{ marginRight: '8px', minWidth: '110px', marginTop:'10px'  }}>
            <Checkbox
              id="TableNoWrapChecked2"
              value={isTableNoWrapChecked}
              field="TableNoWrapChecked2"
              onChange={() => func_setisTableNoWrapChecked(!isTableNoWrapChecked)}
              label="改行しない"
            />
          </div>
        </div>
    </>
  );


  // 1秒ごとに画面を更新し、DBの値が反映されるようにする
  useEffect(() => {
    let intervalId: string | number | NodeJS.Timeout | undefined;
    //setInterval内では各stateが実行時点の状態を記憶してしまうので、別useEffectとNeedFindPollingを用いる事で回避している
    if (isApiError) {
      //APIエラー発生時は30秒毎でポーリングする
      intervalId = setInterval(() => {
        setisNeedFindPolling(true);
      }, 30000);
    }else{
       // 一定秒ごとに検索APIコール
       intervalId = setInterval(() => {
        setisNeedFindPolling(true);
      }, props.FindInterval*1000);
    }
    // コンポーネントが再描画等でアンマウントされる際にsetIntervalを停止する(無限に動くのを回避)
    return () => clearInterval(intervalId);
  }, [isApiError,props.FindInterval]); // APIコールがの成否をトリガとする

  useEffect(() => {
    //一覧検索
    if (isNeedFindPolling){
      setisNeedFindPolling(false);
      FindSyori_rireki2(false);
    }
  }, [isNeedFindPolling]);

  //一覧検索(選択対象が変わった場合の検索)
  useEffect(() => {
    FindSyori_rireki2(true);
  }, [props.selected_syori_rireki1]);


  return(
    <>

        {/* 処理履歴２ */}
        {(props.selected_syori_rireki1)? 
            <div ref={contentRef2}>
              <CustomTable 
                title={title2()} 
                headerButtons={headerButtons2} 
                tableContent={tableContent2()}
                setTableHeight={setTableHeight2}
                setCardFooterBottom={props.setCardFooterBottom2}
                ParentRef={props.CustomTableParentRef}
                onCloseClick={() =>{dispatch(setModificationState2(Syori_rireki1ModificationStatus.None));}}
                //グリッドシステム(計11で指定)
                titleCol="col-md-5"
                headerButtonsCol="col-md-6"
                ComponentPositionsID="syori_rireki2_list_tab"
                />
          </div>
        : 
        null
      }


    </>
  )
};






//-------------------------------------------------------------
//テーブル明細:Syori_rireki2List
//-------------------------------------------------------------
type syoriRireki2ListProps = {
  onSelect:any;
  syori_rireki2s:ISyori_rireki2[] | null;
  isTextLimitChecked:boolean;
  isTableNoWrapChecked:boolean;
  TableHeight:any;
  display_character_limit:number;
  selected_syori_rireki1:ISyori_rireki1 | null;
  selected_syori_rireki2:ISyori_rireki2 | null;
};
const Syori_rireki2List = (Props: syoriRireki2ListProps) => {
  const dispatch: React.Dispatch<any> = useDispatch();
  const notifications: INotificationState | null = useSelector((state: IStateType) => state.notifications);
  const syori_rireki1s: ISyori_rireki1State = useSelector((state: IStateType) => state.syori_rireki1s);
  const [syori1, setSyori1] = React.useState(new Syori1());
  // タイトルの点滅状態を管理するstate
  const sr1_diff = useSelector((state: IStateType) => state.syori_rireki1s.sr1_diff);
  const searchS1IdCount = (s1_id:number,s_count:number) => {
    return sr1_diff.some((elem ) => elem.s1_id === s1_id && elem.s_count === s_count);
  };

  //ループの各要素で異なるstateを準備する
  const [isLogOpen2Array, setIsLogOpen2Array] = React.useState<boolean[]>(new Array(Props.syori_rireki2s ? Props.syori_rireki2s.length : 0).fill(false));
  const [logMsg2, setlogMsg2] = React.useState<string[]>(new Array(Props.syori_rireki2s ? Props.syori_rireki2s.length : 0).fill(""));
  
  //ログ画面を開く
  const Onlog_Button2 = async (index: number)  => {
    setIsLogOpen2Array(prevState => {
      const newState = [...prevState];
      newState[index] = true;
      return newState;
    });
    if (!Props.syori_rireki2s) return;
    //ログ取得APIをコール(ログはサイズが大きく高負荷なので必要時に取得させる)
    GetSyori2_log(Props.syori_rireki2s[index].s1_id,Props.syori_rireki2s[index].s2_id,Props.syori_rireki2s[index].s_count,index);
  }
  //ログ画面を閉じる
  const Onlog_ButtonClose2 = (index: number) => {
    setIsLogOpen2Array(prevState => {
      const newState = [...prevState];
      newState[index] = false;
      return newState;
    });
  };
  
  //ログ取得APIをコール(ログはサイズが大きく高負荷なので必要時に取得させる)
  async function GetSyori2_log(s1_id:number,s2_id:number, s_count:number,index: number) {
    const data = { 
                    s1_id: s1_id,
                    s2_id: s2_id,
                    s_count: s_count
                  };
    //API発行             
    const response = await callApi('get_syori_rireki2_log', data,'application/x-www-form-urlencoded');
    if (response && response.data && response.data.data){
      setlogMsg2(prevState => {
        const newState = [...prevState];
        newState[index] = response.data.data;
        return newState;
      });
    }
  }
  

  const SyoriRireki2Table = ({ index,syoriRireki2,display_character_limit,isTextLimitChecked }: { index:number,syoriRireki2: Syori_rireki2,display_character_limit:number,isTextLimitChecked:boolean }) => {

    //-------------------------------------------------------------
    //レンダリング:テーブルの明細
    //-------------------------------------------------------------
    const isSelected =
      Props.selected_syori_rireki2 &&
      Props.selected_syori_rireki2.s1_id === syoriRireki2.s1_id &&
      Props.selected_syori_rireki2.s2_id === syoriRireki2.s2_id &&
      Props.selected_syori_rireki2.s_count === syoriRireki2.s_count;

    const rowClassName = `table-row ${isSelected ? styles.selected : ""}`;
  

    function getBackgroundColor(syoriRireki2: Syori_rireki2): string {
      //中止の場合は黄色にする
      if (syoriRireki2.is_suspension) return "yellow";

      //実行中の場合は抜ける
      if (!syoriRireki2.result_type) return "";
  
      //想定通りの相違であれば緑にする
      if (syoriRireki2.result_type === 2) return "";
  
      //想定と異なる場合、赤緑にする
      if (syoriRireki2.result_type === 1) return "red";
  
      return "";
    }

    //処理2の停止ボタン
    const OnStop2_Button = async (syoriRireki2: Syori_rireki2)  => {
      const data = { 
        s1_id: syoriRireki2.s1_id,
        s2_id: syoriRireki2.s2_id,
        s_count: syoriRireki2.s_count
    };
      //API発行             
      await callApi('stop_syori_rireki2', data,'application/x-www-form-urlencoded');
    }

    function runResult_td(syoriRireki2: Syori_rireki2) {

      if (syoriRireki2.end_time == null) {
        // 実行中の場合、中止ボタンを表示する
        return (
          <button className={`btn btn-outline-dark ${styles.smallButton}`} onClick={() => { OnStop2_Button(syoriRireki2); }}> 
            <FontAwesomeIcon icon={faHand} className={styles.faIconStop} />
            <span className={styles.logStop}>stop{syoriRireki2.result_type}</span>
          </button>
        )
      }

      {/* 中止は緑の中止マークを表示 */}
      if (syoriRireki2.is_suspension){
        return(
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <FontAwesomeIcon icon={faHand} style={{ color: 'green' }} />
            <span style={{ fontSize: '10px', marginLeft: '5px',color: 'green' }}>中止</span>
          </div>
        )
      }

      if (syoriRireki2.result_type == 0){
        {/* 成功した場合は青色のアイコンを表示 */}
        return (
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <FontAwesomeIcon icon={faThumbsUp} style={{ color: 'blue' }} />
            <span style={{ fontSize: '10px', marginTop: '4px',marginLeft: '5px' }}>OK</span>
          </div>
        )
      }
      
      if (syoriRireki2.is_timeout){
        // タイムアウトの場合は砂時計のアイコンを表示
        return (
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <FontAwesomeIcon icon={faHourglassEnd} />
            <span style={{ fontSize: '8px', marginTop: '4px',marginLeft: '5px' }}>TimeOut</span>
          </div>
        )
      }

      if (!syoriRireki2.end_time){
        // 終了時間がnullの場合は、何も表示しない
        return (
          <div>
          </div>
        )
      }

      if (syoriRireki2.result_type == 1){
        //NGは赤い×を表示
        return (
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <FontAwesomeIcon icon={faXmark} style={{ color: 'white' }} />
            <span style={{ fontSize: '10px', marginLeft: '5px',color: "white" }}>NG</span>
          </div>
        )
      }

      if (syoriRireki2.result_type == 2){
        //想定相違は白い×を表示
        return (
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <FontAwesomeIcon icon={faCircleXmark} style={{ color: 'blue' }} />
            <span style={{ fontSize: '10px', marginLeft: '5px',color: "blue" }}>NG</span>
          </div>
        )
      }
    }


    return (
      <>
        <tr
          className={rowClassName}
          onClick={() => {
            if (Props.onSelect) {
              Props.onSelect(syoriRireki2);
            }
          }}
        >
          <td>{syoriRireki2.s2_id}</td>
          <td>{syoriRireki2.sheetname}</td>
          <td>{syoriRireki2.run_order}</td>
          <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>
            {syoriRireki2.is_do ? <FontAwesomeIcon icon={faCheck} style={{ verticalAlign: 'middle' }} /> : null}
          </td>
          <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>
            {syoriRireki2.ng_stop ? <FontAwesomeIcon icon={faCheck} style={{ verticalAlign: 'middle' }} /> : null}
          </td>
  
          <td style={{ verticalAlign: 'middle', textAlign: 'center',backgroundColor: getBackgroundColor(syoriRireki2) }} >
            {/* 結果を表示 */}
            {runResult_td(syoriRireki2)}
          </td>
  
          <td>  <ProgressBar animated　variant="dark" now={syoriRireki2.percent2} label={`${syoriRireki2.percent2}%`} /></td>
          <td>{moment(syoriRireki2.start_time).format('HH:mm:ss')}</td>
          <td className="tight-cell">
            {moment(syoriRireki2.end_time).isValid()
              ? moment(syoriRireki2.end_time).format('YYYY/MM/DD HH:mm:ss')
              : '実行中'}
          </td>      
          
          {[
                  // 表示する各列のタイトルと値をオブジェクトとして配列に格納
                  { title: "proc_cont", value: syoriRireki2.scenario },
                  { title: "comment", value: syoriRireki2.s_outline },
                ].map((column, index) => (
                  // map関数で繰り返し、表示する各列に対応する<td>要素を生成
                  <td key={index} title={column.value}>
                    {/* isTextLimitCheckedがtrueの場合、文字列が長すぎる際に省略符号...を追加 */}
                    {isTextLimitChecked && column.value.length > display_character_limit
                      ? column.value.slice(0, display_character_limit) + "..."
                      : column.value}
                  </td>
                ))}
  
            {syoriRireki2.log == ""?  (<td></td>) :
            (
              <td>
                <button className={`btn btn-outline-dark ${styles.smallButton}`} onClick={() => { Onlog_Button2(index); }}> 
                <FontAwesomeIcon icon={faRectangleList} className={styles.faIcon}/>
                <span className={styles.logText}>log</span>
                </button>
                <LogModal title="Log2" log={logMsg2[index]} isOpen={isLogOpen2Array[index]} onClose={() => Onlog_ButtonClose2(index)} />
              </td>
            )}
          <td>{moment(syoriRireki2.create_date).format('YYYY/MM/DD HH:mm:ss')}</td>
          <td>{moment(syoriRireki2.update_date).format('HH:mm:ss')}</td>
        </tr>
      </>
    );
  };

  //-------------------------------------------------------------
  //レンダリング:テーブルのヘッダ
  //-------------------------------------------------------------
  return (
    <>
      <div className="table-responsive portlet-123 table-fixed-width-container"  style={{ maxHeight: Props.TableHeight }}>
        <table className={`table ${Props.isTableNoWrapChecked ? styles.tableNoWrap : ""}`} style={{overflowX:"auto"}}>
          <thead className={`thead-light ${styles.table2Header}`}> 
            <tr>
              <th style={{fontSize: "75%"}}>処理No2</th>{/* 幅を狭くしたいので字を小さくする */}
              <th>シート名</th>
              <th>実行順</th>
              <th>実施FLG</th>
              <th style={{fontSize: "75%"}}>NGで停止</th>{/* 幅を狭くしたいので字を小さくする */}
              <th>結果</th>
              <th>進捗率</th>
              <th>開始</th>
              <th>終了</th>
              <th>シナリオ</th>
              <th>処理概要</th>
              <th>ログ</th>
              <th>作成日時</th>
              <th>更新日時</th>
            </tr>
          </thead>
          <tbody>
            {Props.syori_rireki2s && Props.syori_rireki2s.map((syoriRireki2: Syori_rireki2, index: number) => (
              <SyoriRireki2Table index={index} key={syoriRireki2.s1_id+":"+syoriRireki2.s2_id} syoriRireki2={syoriRireki2} display_character_limit={Props.display_character_limit} isTextLimitChecked={Props.isTextLimitChecked} />

            ))}
          </tbody>
        </table>
      </div>

    </>
  );
};
