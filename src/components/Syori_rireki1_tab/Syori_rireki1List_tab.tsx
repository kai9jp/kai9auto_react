import React,{ Dispatch, FormEvent, createRef, useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { ISyori_rireki1, Syori_rireki1 } from "../../store/models/syori_rireki1.interface";
import { IStateType} from "../../store/models/root.interface";
import moment, { now } from 'moment';
import { callApi } from "../../common/comUtil";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle, faScrewdriverWrench, faThumbsUp, faXmark, faCircleXmark, faHourglassEnd, faUpload, faDownload, faHand, faRectangleList } from '@fortawesome/free-solid-svg-icons';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { useNavigate  } from 'react-router-dom';
import { changeSelectedSyori1_s1_id } from "../../store/actions/syori1.action";
import styles from "./Syori_rireki1List_tab.module.css";
import BlinkingRow from "../../common/components/BlinkingRow ";
import { IAccount } from "store/models/account.interface";
import { AUT_NUM_ADMIN, BLINK_SECONDS } from "common/constants";
import SearchBar from "common/components/SearchBar";
import NumberInput from "common/components/NumberInput";
import { OnChangeModel } from "non_common/types/Form.types";
import Checkbox from "common/components/Checkbox";
import CustomTable from "common/components/CustomTableProps ";
import { ISyori1, Syori1 } from "store/models/syori1.interface";
import LogModal from "../../common/components/ModalPopUp";
import { UploadSyori } from "./UploadSyori";
import Export_s_excel from "./Export_s_excel";


//-------------------------------------------------------------
//Syori_rireki1
//-------------------------------------------------------------
export type Syori_Rireki1Props = {
  FindInterval:number;
  onSyori_rireki1Select:any;
  setIsContentOpen:any;
  TableHeight1:string;
  setTableHeight1:any;
  setCardFooterBottom1:any;
  CustomTableParentRef:any;
  activeTab:string;
  selected_syori_rireki1:ISyori_rireki1 | null;
  shouldBlink_syori_rireki1:ISyori_rireki1 | null;
  setshouldBlink_syori_rireki1:any;
  shouldBlink:boolean;
  selected_s1_id:number;
  selected_s_count:number;
  autoSelected_s1_id:number;
  autoSelected_s_count:number;
  setAutoSelected_s1_id:any;
  setAutoSelected_s_count:any;
  isAutoBlink:boolean;
}
export const Syori_Rireki1 = (props:Syori_Rireki1Props) => {
  const contentRef1 = createRef<HTMLDivElement>();
  const account: IAccount = useSelector((state: IStateType) => state.account);
  const [upload_syori1, setupload_Syori1] = React.useState(new Syori1());
  const [isUploadModalOpen, setisUploadModalOpen] = React.useState(false);

  //APIコール制御用
  const [syori_rireki1s, setSyori_rireki1s] = useState<ISyori_rireki1[] | null>([]);
  const [all_count, setall_count] = useState(0);
  const [findDateTime, setfindDateTime] = React.useState(0);  
  const [isApiError, setIsApiError] = useState(false);
  const [isNeedFind, setisNeedFind] = useState(true);//サーチバー(検索ボックスでEnterキー押下/検索ボタン押下)
  const [isNeedFindSyori_rireki1, setisNeedFindSyori_rireki1] = useState(true);
  const [isNeedFindPolling, setisNeedFindPolling] = useState(false);
  const [MyCurrentPage, setMyCurrentPage] = useState(0);
  const [MynumberOfDisplaysPerpage, setMynumberOfDisplaysPerpage] = useState(100);
  const [isSyori_rireki1_count, setIsSyori_rireki1_count] = useState(false);

  //ページネーション用
  const [CurrentPage, setCurrentPage] = useState(0);
  const [numberOfDisplaysPerpage, setnumberOfDisplaysPerpage] = useState(0);

  //ローカルストレージ保存対象
  const [display_character_limit, setdisplay_character_limit] = React.useState(0);
  const [isTextLimitChecked, setisTextLimitChecked] = React.useState(true);
  const [isTableNoWrapChecked, setisTableNoWrapChecked] = React.useState(true);
  const [findStr, setfindStr] = useState("");
  //ローカルストレージ操作方フラグ
    const [isInitialized, setIsInitialized] = useState(false);

  //件数検索
  async function syori_rireki1_count() {
    if (isSyori_rireki1_count) return; // 実行中なら何もしない
    setIsSyori_rireki1_count(true);
    try{
      const data = {
        limit: -1,
        offset: 0,
        findstr:findStr,
        s1_id: 0,
        s2_id: 0,
        s_count: 0,
        // isNeedFindSyori_rireki1の指定がある場合、findDateTimeをゼロで送信し、検索を有効化する
        findDateTime:isNeedFindSyori_rireki1?new Date(0).toISOString():new Date(findDateTime).toISOString()
      };
      const response = await callApi('syori_rireki1_find_count', data,'application/x-www-form-urlencoded');
      //前回検索時と変更が無い場合は何も処理せず抜ける
      if (response){
        const str = JSON.stringify(response.data);
        const data = JSON.parse(str);
        if (data.NoChanged == 'true') return;
      }
      if (response){
        //Ractのjson形式に変換(JavaのJsonが届くので)
        const str = JSON.stringify(response.data);
        const data = JSON.parse(str);
        setall_count(data.all_count);
        FindSyori_rireki1();
        setIsApiError(false);
      }else{
        setIsApiError(true);
      }

    } finally {
      setIsSyori_rireki1_count(false);
    }
  }

  //検索(ページネーション)
// 検索
async function FindSyori_rireki1(): Promise<void> {
  //--------------------------------------------------------------
  // 親階層の検索
  //--------------------------------------------------------------
  let data = {
    limit: numberOfDisplaysPerpage,
    offset: (CurrentPage - 1) * numberOfDisplaysPerpage,
    findstr: findStr,
    // isNeedFindSyori_rireki1の指定がある場合、findDateTimeをゼロで送信し、検索を有効化する
    findDateTime: isNeedFindSyori_rireki1 ? new Date(0).toISOString() : new Date(findDateTime).toISOString()
  };

  // API発行
  try {
    const response = await callApi('syori_rireki1_tab_find', data, 'application/x-www-form-urlencoded');
    // 前回検索時と変更が無い場合は何も処理せず抜ける
    if (response) {
      const str = JSON.stringify(response.data);
      const data = JSON.parse(str);
      if (data.NoChanged == 'true') return;
    }

    // 初期化
    if (syori_rireki1s) {
      setSyori_rireki1s(null);
    }

    if (response && response.data && response.data.data) {
      const data: ISyori_rireki1[] = JSON.parse(response.data.data);
      if (data) {
        // map関数は、指定したコールバック関数を配列の要素数分繰り返す(valueは引数であり、配列の各要素が入ってくる)
        // 配列の要素数だけaddAdminする
        data.map((value: ISyori_rireki1, index: number) => {
          // mapするだけでは、シグネチャ型(子データ)がundefinedになってしまうので、インスタンスを作成し、中身をアサインする
          const sr1 = new Syori_rireki1();
          Object.assign(sr1, value);
          setSyori_rireki1s(prev => [...(prev || []), sr1]);
          // 未選択の場合、1レコード目を選択状態にする
          if (props.selected_s1_id === 0) {
            if (!props.selected_syori_rireki1 && index === 0) {
              props.onSyori_rireki1Select(sr1);
            }
          }
        });

        // 選択している処理1の最大処理番号を取得
        let max_s_count = 0;
        if (props.selected_s1_id != 0) {
          for (let index = 0; index <= data.length - 1; index++) {
            const value = data[index];
            const sr1 = new Syori_rireki1();
            Object.assign(sr1, value);
            if (props.selected_s1_id && props.selected_s1_id === sr1.s1_id) {
              if (max_s_count < sr1.s_count) {
                max_s_count = sr1.s_count;
              }
            }
          }
        }

        for (let index = 0; index <= data.length - 1; index++) { // 逆順ループ
          const value = data[index];
          const sr1 = new Syori_rireki1();
          Object.assign(sr1, value);
          // 未選択状態の場合、ローカルストレージに記憶された選択IDと同じなら選択状態にする
          if (!props.selected_syori_rireki1) {
            if (props.selected_s1_id && props.selected_s1_id === sr1.s1_id && props.selected_s_count && props.selected_s_count === sr1.s_count) {
              props.onSyori_rireki1Select(sr1);
              props.setAutoSelected_s1_id(sr1.s1_id);
              props.setAutoSelected_s_count(max_s_count);
              break;
            }
          } else {
            // [点滅機能]
            // 選択中の処理番が同じで、処理回数が大きい場合、選択対象を変えて、点滅させる(自動更新便利機能として)
            if (props.isAutoBlink && props.selected_s1_id && props.selected_s1_id === sr1.s1_id && props.selected_s_count && props.selected_s_count < sr1.s_count) {
              if (props.autoSelected_s1_id === sr1.s1_id && props.autoSelected_s_count >= sr1.s_count) {
                // 既に自動選択した対象と同じ場合は何もしない
                break;
              } else {
                props.onSyori_rireki1Select(sr1);
                props.setshouldBlink_syori_rireki1(sr1);
                props.setAutoSelected_s1_id(sr1.s1_id);
                props.setAutoSelected_s_count(sr1.s_count);
                break; // 1件目のヒットで抜ける
              }
            }
          }
        }
      }
      setIsApiError(false); // APIエラー発生フラグのリセット

      // 検索済日時を更新
      setfindDateTime(now);

    } else {
      setIsApiError(true);
      throw new Error('API Error');
    }
  } catch (error) {
    setIsApiError(true);
    throw error;
  }
}


  //タイトルの表示箇所
  const title1 = (
    <>
      <h6 className="font-weight-bold text-green">処理履歴 親({all_count}件)</h6>
    </>
  );

  //サーチバーの表示箇所
  const searchBar1 = (
    <>
      { (account.authority_lv == AUT_NUM_ADMIN)?// 権限が管理者の場合だけ表示する
        <div className="input-group">
          <SearchBar
            setFindStr={setfindStr}
            setIsNeedFind={setisNeedFind}
            // rendドラッグ機能で移動されてしまう事象を回避
            onMouseDown={(event: { stopPropagation: () => void; }) => {
              event.stopPropagation();
            }}            
          />                        
        </div>
      :""
      }
    </>
  );

  function func_setdisplay_character_limit(value:number){
    setdisplay_character_limit(value);
  }
  function func_setisTextLimitChecked(value:boolean){
    setisTextLimitChecked(value);
  }
  function func_setisTableNoWrapChecked(value:boolean){
    setisTableNoWrapChecked(value);
  }

  // ローカルストレージへの保存
  useEffect(() => {
    if (isInitialized) { 
      const data = {
        display_character_limit: display_character_limit,
        isTextLimitChecked: isTextLimitChecked,
        isTableNoWrapChecked: isTableNoWrapChecked,
        findStr: findStr
      };
      localStorage.setItem("Syori_rireki1", JSON.stringify(data));
    }
  }, [display_character_limit, isTextLimitChecked, isTableNoWrapChecked, findStr]);

  // ローカルストレージからの読み込み
  useEffect(() => {
    //既に初期値(0)以外が入っている場合は何もしない
    if (display_character_limit != 0) return;

    const savedData = localStorage.getItem("Syori_rireki1");
    if (savedData) {
        const parseData = JSON.parse(savedData);
        setdisplay_character_limit(parseData.display_character_limit);
        setisTextLimitChecked(parseData.isTextLimitChecked);
        setisTableNoWrapChecked(parseData.isTableNoWrapChecked);
        setfindStr(parseData.findStr);
    }else{
        //ストレージに無い場合は初期値をセット
        setdisplay_character_limit(10);
        setisTextLimitChecked(true);
        setisTableNoWrapChecked(true);
        setfindStr("");
    }
    setIsInitialized(true); 
  }, []);


  //ヘッダーボタン各種の表示箇所
  const headerButtons1 = () => {
    return (
      <>
        <div className="row">

          {/* 表示文字制限の設定ボックス */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
              <div style={{ marginRight: '8px', minWidth: '130px', marginTop:'10px' }}>
                <Checkbox
                  id="display_character_check1"
                  value={isTextLimitChecked}
                  field="display_character_check1"
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
                  id="TableNoWrapChecked1"
                  value={isTableNoWrapChecked}
                  field="TableNoWrapChecked1"
                  onChange={() => func_setisTableNoWrapChecked(!isTableNoWrapChecked)}
                  label="改行しない"
                />
              </div>

          </div>
        </div>
      </>
    )
  };

    //テーブルの表示箇所
  const tableContent1 = (
    <>
      <Syori_rireki1List
        onSelect={props.onSyori_rireki1Select}
        findStr={findStr}
        setfindStr={setfindStr}
        setisNeedFind={setisNeedFind}
        setIsContentOpen={props.setIsContentOpen}
        display_character_limit={display_character_limit}
        height={props.TableHeight1}
        isTextLimitChecked={isTextLimitChecked}
        isTableNoWrapChecked={isTableNoWrapChecked}
        setupload_Syori1={setupload_Syori1}
        setisUploadModalOpen={setisUploadModalOpen}
        syori_rireki1s={syori_rireki1s}
        selected_syori_rireki1={props.selected_syori_rireki1}
        shouldBlink_syori_rireki1={props.shouldBlink_syori_rireki1}
        setshouldBlink_syori_rireki1={props.setshouldBlink_syori_rireki1}
        activeTab={props.activeTab}
        shouldBlink={props.shouldBlink}
        />
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
       // 一定秒ごとにsetisNeedFindPolling(true)を呼び出す事で検索APIがコールされる
       intervalId = setInterval(() => {
        setisNeedFindPolling(true);
      }, props.FindInterval*1000);
    }
    // コンポーネントが再描画等でアンマウントされる際にsetIntervalを停止する(無限に動くのを回避)
    return () => clearInterval(intervalId);
  }, [isApiError,props.FindInterval]); // APIコールがの成否をトリガとする

  useEffect(() => {
    //一覧検索
    if (isInitialized){ //ローカルストレージ読み取り後しか検索させない
      if (isNeedFind || isNeedFindPolling || MyCurrentPage !=CurrentPage || MynumberOfDisplaysPerpage != numberOfDisplaysPerpage){
        if (isNeedFind){
          //検索条件が変わった場合、1ページ目に戻す
          setCurrentPage(1);
        }else{
          setMyCurrentPage(CurrentPage);
          setMynumberOfDisplaysPerpage(numberOfDisplaysPerpage);
        }
        setisNeedFindSyori_rireki1((MyCurrentPage !=CurrentPage || MynumberOfDisplaysPerpage != numberOfDisplaysPerpage) || isNeedFind);
        setisNeedFind(false);
        setisNeedFindPolling(false);
        syori_rireki1_count();
      }
      }
  }, [numberOfDisplaysPerpage,CurrentPage,isNeedFind,isNeedFindPolling,findStr,isInitialized]);




  return(
    <>
      {/* カード */}
      <div ref={contentRef1}>
        <CustomTable 
          title={title1} 
          searchBar={searchBar1}
          headerButtons={headerButtons1()} 
          tableContent={tableContent1} 
          setTableHeight={props.setTableHeight1}
          setCardFooterBottom={props.setCardFooterBottom1}
          ParentRef={props.CustomTableParentRef}
          //ページネーション用
          SetCurrentPage={setCurrentPage}
          setnumberOfDisplaysPerpage={setnumberOfDisplaysPerpage}
          numberOfDisplaysPerpage={numberOfDisplaysPerpage} //1ページの表示件数
          dataCounts={all_count} //総件数数
          currentPage={MyCurrentPage} //現在の表示ページ
          //グリッドシステム(計11で指定)
          titleCol="col-md-2"
          searchBarCol="col-md-4"
          headerButtonsCol="col-md-5"
          ComponentPositionsID="syori_rireki1_list_tab"
        />
      </div>

      {/* アップローダ(処理) */}
      <div>
        <UploadSyori 
          syori1={upload_syori1}
          setSyori1={setupload_Syori1}
          isUploadModalOpen={isUploadModalOpen}
          setisUploadModalOpen={setisUploadModalOpen}
          exec_Button={exec_Button}
        />
      </div>

    </>
  )
};







//-------------------------------------------------------------
//テーブル明細:Syori_rireki1List
//-------------------------------------------------------------
export type syori_rireki1ListProps = {
  onSelect?: (syori_rireki1: ISyori_rireki1) => void;
  children?: React.ReactNode;
  findStr:any;
  setfindStr:any;
  setisNeedFind:any;
  setIsContentOpen:any;
  display_character_limit:any;
  height:any;
  isTextLimitChecked:boolean;
  isTableNoWrapChecked:boolean;
  setupload_Syori1: (arg0: Syori1) => void;
  setisUploadModalOpen:any;
  syori_rireki1s:any;
  selected_syori_rireki1:ISyori_rireki1 | null;
  shouldBlink_syori_rireki1:ISyori_rireki1 | null;
  setshouldBlink_syori_rireki1:any;
  activeTab:string;
  shouldBlink:boolean;
};

const exec_Button = async (s1_id: number)  => {
  const data = {s1_id: s1_id};
  //API発行
  await callApi('exec_syori', data,'application/x-www-form-urlencoded');
}

function Syori_rireki1List(props: syori_rireki1ListProps): JSX.Element  {

  if (!props.syori_rireki1s ) {
    return <div>データがありません</div>;
  }

  //------------------------------------------------------------
  //ログ画面用
  //------------------------------------------------------------
  const [isLogOpen1Array, setIsLogOpen1Array] = React.useState<boolean[]>(new Array(props.syori_rireki1s.length).fill(false));
  const [logMsg1, setlogMsg1] = React.useState<string[]>(new Array(props.syori_rireki1s.length).fill(""));
  //ログ画面を開く
  const Onlog_Button1 = async (index: number)  => {
    setIsLogOpen1Array(prevState => {
      const newState = [...prevState];
      newState[index] = true;
      return newState;
    });
    //ログ取得APIをコール(ログはサイズが大きく高負荷なので必要時に取得させる)
    GetSyori1_log(props.syori_rireki1s[index].s1_id,props.syori_rireki1s[index].s_count,index);
  }
  //ログ画面を閉じる
  const Onlog_ButtonClose1 = (index: number) => {
    setIsLogOpen1Array(prevState => {
      const newState = [...prevState];
      newState[index] = false;
      return newState;
    });
  };
  //ログ取得APIをコール(ログはサイズが大きく高負荷なので必要時に取得させる)
  async function GetSyori1_log(s1_id:number,s_count:number,index: number) {
    const data = { 
                    s1_id: s1_id,
                    s_count: s_count
                  };
    //API発行             
    const response = await callApi('get_syori_rireki1_log', data,'application/x-www-form-urlencoded');
    if (response && response.data && response.data.data){
      setlogMsg1(prevState => {
        const newState = [...prevState];
        newState[index] = response.data.data;
        return newState;
      });
    }
  }

  //シナリオダウンロードボタン
  const scenarioDownLoadButton = async (e: React.MouseEvent<HTMLButtonElement>,syori_rireki1: ISyori_rireki1)  => {
    e.stopPropagation();//親イベントの発動を抑止(行選択イベントを抑止する事で、無駄なsyori_rireki1_findを回避)
    Export_s_excel(syori_rireki1);
  }

    //シナリオアップロードボタン
  const UploadscenarioButton = async (e: React.MouseEvent<HTMLButtonElement>,syori_rireki1: ISyori_rireki1)  => {
    e.stopPropagation();//親イベントの発動を抑止(行選択イベントを抑止する事で、無駄なsyori_rireki1_findを回避)

    //処理を取得し割当
    const data = { 
      limit: 100,
      offset: 0,
      findstr:"",
      isDelDataShow:true,
      s1_id:syori_rireki1.s1_id
    };
    const response = await callApi('syori1_find', data,'application/x-www-form-urlencoded');//「application/x-www-form-urlencoded」はURLエンコードした平文での送信
    if (response){
      const syori1_array: ISyori1[] = JSON.parse(response.data.data);
      if (syori1_array){
        syori1_array.map((value: ISyori1) => {
          const syori1 = new Syori1();
          Object.assign(syori1, value);
          props.setupload_Syori1(syori1);
        });
      }
    };
    props.setisUploadModalOpen(true);
  }

  const dispatch: Dispatch<any> = useDispatch();
  const navigate = useNavigate ();
  const syori1_edit_Button = async (syori_rireki1: ISyori_rireki1)  => {
    // s1_idが一致する行を選択状態にする(処理設定で編集画面を出す際に利用)
    dispatch(changeSelectedSyori1_s1_id(syori_rireki1.s1_id));

    // 編集画面を開くために、遷移先のURLを作成する
    const editUrl = `../syori1`;
    // 編集画面に遷移する
    navigate(editUrl);
  }

  const syori_rireki1Elements: (JSX.Element | null)[] = props.syori_rireki1s.map((syori_rireki1: ISyori_rireki1,index: number) => {
    if (!syori_rireki1) { return null; }
  
    // タイトルと値からtd要素を返す
    const renderTableData = (columns: { title: string, value: string }[]) => {
      return columns.map((column, index) => {
        // 値を省略表示する関数
        const displayValue = (value: string | null | undefined) => {
          // valueがnullまたはundefinedの場合、または文字列が空の場合はそのまま空文字列を返す
          if (value == null || value.length === 0) {
            return "";
          }
          // isTextLimitCheckedがtrueで、文字列の長さが一定以上の場合、...で略式表示する
          if (props.isTextLimitChecked && value.length > props.display_character_limit) {
            return value.slice(0, props.display_character_limit) + "...";
          }
          return value;
        };
        // カラムの値を表示するtd要素を返す
        // セルのタイトル属性を設定(マウスでフォーカスをセットすると全文が見える様に)
        return (
          <td key={index} title={column.value}>
            {displayValue(column.value)}
          </td>
        );
      });
    };

    //選択行を着色
    const isSelected = props.selected_syori_rireki1 && props.selected_syori_rireki1.s1_id === syori_rireki1.s1_id && props.selected_syori_rireki1.s_count === syori_rireki1.s_count;
    const rowClassName = `${styles.tightRow} table-row ${isSelected ? styles.selected : ""}`;

    
    function getBackgroundColor(syori_rireki1: Syori_rireki1): string {
      //中止の場合は黄色にする
      if (syori_rireki1.is_suspension || syori_rireki1.result_type === 3) return "yellow";

      //実行中の場合は抜ける(無色)
      if (!syori_rireki1.result_type) return "";
  
      //処理連結NG版の場合は抜ける(無色)
      if (syori_rireki1.s_linking_ng) return "";

      //想定通りの相違であれば緑にする
      if (syori_rireki1.result_type === 2) return "";
  
      //想定と異なる場合、赤にする
      if (syori_rireki1.result_type === 1) return "red";
  
      return "";
    }

    //処理3の停止ボタン
    const OnStop1_Button = async (syoriRireki1: Syori_rireki1)  => {
      const data = { 
        s1_id: syoriRireki1.s1_id,
        s_count: syoriRireki1.s_count
    };
      //API発行             
      await callApi('stop_syori_rireki1', data,'application/x-www-form-urlencoded');
    }

    function runResult_td(syori_rireki1: Syori_rireki1) {

          if (syori_rireki1.end_time == null) {
            // 実行中の場合、中止ボタンを表示する
            return (
              <button className={`btn btn-outline-dark ${styles.smallButton}`} onClick={() => { OnStop1_Button(syori_rireki1); }} title={`実行中`}> 
                <FontAwesomeIcon icon={faHand} className={styles.faIconStop} />
                <span className={styles.logStop}>stop{syori_rireki1.result_type}</span>
              </button>
            )
          {/* 中止は緑の中止マークを表示 */}
          }else if (syori_rireki1.is_suspension || syori_rireki1.result_type == 3){
            return(
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} title={`中止`}>
                <FontAwesomeIcon icon={faHand} style={{ color: 'green' }} />
                <span style={{ fontSize: '10px', marginLeft: '5px',color: 'green' }}>中止</span>
              </div>
            )
          {/* 成功した場合は青色のアイコンを表示 */}
          }else if (syori_rireki1.result_type == 0){
            return(
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} title={`OK`}>
                <FontAwesomeIcon icon={faThumbsUp} style={{ color: 'blue'}} />
                <span style={{ fontSize: '10px', marginTop: '4px', marginLeft: '5px'  }}>OK</span>
              </div>
            )
          {/* タイムアウトの場合は砂時計のアイコンを表示 */}
          }else if (syori_rireki1.is_timeout){
            return(
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} title={`タイムアウト`}>
                <FontAwesomeIcon icon={faHourglassEnd} />
                <span style={{ fontSize: '8px', marginTop: '4px', marginLeft: '5px'  }}>TimeOut</span>
              </div>
            )
          {/* 意図的なNGの場合は青色の×を表示 */}
          }else if (syori_rireki1.result_type == 2 && !syori_rireki1.is_timeout) {
            return(
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} title={`想定通りの相違`}>
                <FontAwesomeIcon icon={faCircleXmark} style={{ color: 'blue' }} />
                <span style={{ fontSize: '10px', marginLeft: '5px',color: 'blue' }}>NG</span>
              </div>
            )
          {/* 処理連結NG版の場合は緑色の×を表示 */}
          }else if (syori_rireki1.s_linking_ng) {
          return(
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} title={`処理連結NG版`}>
              <FontAwesomeIcon icon={faCircleXmark} style={{ color: 'green' }} />
              <span style={{ fontSize: '10px', marginLeft: '5px',color: 'green' }}>NG</span>
            </div>
          )
          {/* それ以外は赤い×を表示 */}
          }else if (syori_rireki1.result_type == 1 && !syori_rireki1.is_timeout){
            return(
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} title={`NG`}>
                <FontAwesomeIcon icon={faXmark} style={{ color: 'white' }} />
                <span style={{ fontSize: '10px', marginLeft: '5px',color: 'white' }}>NG</span>
              </div>
            )
          }
    }
  
    let shouldBlink = props.shouldBlink && props.shouldBlink_syori_rireki1 && props.shouldBlink_syori_rireki1.s1_id === syori_rireki1.s1_id && props.shouldBlink_syori_rireki1.s_count === syori_rireki1.s_count?true:false;
    
    return (
      //tr要素と同じ:追加行を点滅させる
      <BlinkingRow 
        shouldBlink={shouldBlink}
        className={rowClassName}
        onClick={() => {
          if (props.onSelect) {
            props.onSelect(syori_rireki1);
          }
        }}
        key={`syori_rireki1_${syori_rireki1.s1_id}_${syori_rireki1.s_count}`}
      >

      <th scope="row">{index+1}</th>

      <td className="tight-cell"><button className="btn btn-sm py-0 btn-outline-dark" onClick={() => { exec_Button(syori_rireki1.s1_id); }}> <FontAwesomeIcon icon={faPlayCircle} /></button></td>
      <td className="tight-cell"><button className="btn btn-sm py-0 btn-outline-dark" onClick={(event) => scenarioDownLoadButton(event,syori_rireki1)}> <FontAwesomeIcon icon={faDownload} /></button></td>
      <td className="tight-cell"><button className="btn btn-sm py-0 btn-outline-dark" onClick={(event) => UploadscenarioButton(event,syori_rireki1)}> <FontAwesomeIcon icon={faUpload} /></button></td>
      <td className="tight-cell">{syori_rireki1.s1_id}</td>
      {renderTableData([{ title: "s1_name", value: syori_rireki1.s1_name }])}{/* 表示文字制限 */}
      <td className="tight-cell">{syori_rireki1.s_count}</td>

      <td className="tight-cell" style={{ verticalAlign: 'middle', textAlign: 'center',backgroundColor: getBackgroundColor(syori_rireki1) }}>
        {runResult_td(syori_rireki1)}
      </td>


      <td className="tight-cell">{syori_rireki1.sheet_count}</td>
      <td className="tight-cell">{syori_rireki1.ok_count}</td>
      <td className="tight-cell">{syori_rireki1.ng_count}</td>
      <td className="tight-cell">{syori_rireki1.s_ng_count}</td>
      <td className="tight-cell">  <ProgressBar animated　variant="dark" now={syori_rireki1.percent} label={`${syori_rireki1.percent}%`} /></td>

      {syori_rireki1.log == ""?  (<td></td>) :
      (
        <td>
          <button className={`btn btn-outline-dark ${styles.smallButton}`} onClick={() => { Onlog_Button1(index); }}> 
          <FontAwesomeIcon icon={faRectangleList} className={styles.faIcon}/>
          <span className={styles.logText}>log</span>
          </button>
          <LogModal title="Log1" log={logMsg1[index]} isOpen={isLogOpen1Array[index]} onClose={() => Onlog_ButtonClose1(index)} />
        </td>
      )}

      <td className="tight-cell">
        {moment(syori_rireki1.start_time).isValid()
          ? moment(syori_rireki1.start_time).format('YYYY/MM/DD HH:mm:ss')
          : '実行中'}
      </td>      
      <td className="tight-cell">
        {moment(syori_rireki1.end_time).isValid()
          ? moment(syori_rireki1.end_time).format('YYYY/MM/DD HH:mm:ss')
          : '実行中'}
      </td>      
      <td className="tight-cell">
        {moment(syori_rireki1.end_time).isValid()
          ? moment.utc(moment(syori_rireki1.end_time).diff(moment(syori_rireki1.start_time))).format('HH:mm:ss')
          : '実行中'}
      </td>      


      {/* 実施者 */}
      {renderTableData([{ title: "update_user", value: syori_rireki1.update_user }])}{/* 表示文字制限 */}

      {/* 実行ホスト */}
      <td className="tight-cell">{syori_rireki1.execute_ip}</td>

      {/* 処理設定 */}
      <td className="tight-cell"><button className="btn btn-sm py-0 btn-outline-dark" onClick={() => { syori1_edit_Button(syori_rireki1); }}> <FontAwesomeIcon icon={faScrewdriverWrench}/></button></td>
    </BlinkingRow>
    );
  });
  
  
  return (
    <div className="table-responsive portlet" style={{ maxHeight: props.height }}>
      <table className={`table ${props.isTableNoWrapChecked ? styles.tableNoWrap : ""}`} style={{overflowX:"auto"}}>
        <thead className="thead-light ">
          <tr>
            <th scope="col">#</th>
            <th scope="col">実行</th>
            <th scope="col">ｼﾅﾘｵ</th>
            <th scope="col" style={{ fontSize: '10px' }}>UP&<br />実行</th>
            <th scope="col" style={{ fontSize: '10px' }}>処理<br />No</th>
            <th scope="col">処理名称</th>
            <th scope="col">回数</th>
            <th scope="col">結果</th>
            <th scope="col" style={{ fontSize: '10px' }}>シート数</th>
            <th scope="col" style={{ fontSize: '10px' }}>OK数</th>
            <th scope="col" style={{ fontSize: '10px' }}>NG数</th>
            <th scope="col" style={{ fontSize: '10px' }}>想定NG数</th>
            <th scope="col">進捗率</th>
            <th scope="col">ログ</th>
            <th scope="col">開始日時</th>
            <th scope="col">終了日時</th>
            <th scope="col">所要時間</th>
            <th scope="col">実施者</th>
            <th scope="col">実行ホスト</th>
            <th scope="col">処理設定</th>
          </tr>
        </thead>
        <tbody>
          {syori_rireki1Elements}
        </tbody>
      </table>
    </div>

  );
}

export default Syori_rireki1List;

