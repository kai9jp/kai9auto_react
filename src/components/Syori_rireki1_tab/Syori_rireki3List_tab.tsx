import * as React from 'react';
import { ISyori_rireki3, Syori_rireki3 } from '../../store/models/syori_rireki3.interface';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck,   faCircleXmark,   faForwardStep,   faHand,  faRectangleList, faThumbsUp, faXmark } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import ProgressBar from 'react-bootstrap/esm/ProgressBar';
import LogModal from '../../common/components/ModalPopUp';
import { IStateType, ISyori_rireki1State } from '../../store/models/root.interface';
import { useDispatch, useSelector } from 'react-redux';
import { callApi } from '../../common/comUtil';
import { Dispatch, createRef, useEffect, useState } from 'react';
import { SetisScrolledToBottom, setModificationState3 } from '../../store/actions/syori_rireki1.action';
import styles from "./Syori_rireki3List_tab.module.css";
import { ISyori_rireki1, Syori_rireki1ModificationStatus } from 'store/models/syori_rireki1.interface';
import CustomTable from 'common/components/CustomTableProps ';
import { ISyori_rireki2 } from 'store/models/syori_rireki2.interface';
import Checkbox from 'common/components/Checkbox';
import NumberInput from 'common/components/NumberInput';
import { OnChangeModel } from 'non_common/types/Form.types';

//-------------------------------------------------------------
//Syori_rireki3
//-------------------------------------------------------------
export type Syori_Rireki3Props = {
  syori_rireki1s:any;
  CardFooterBottom:number;
  CustomTableParentRef:any;
  activeTab:string;
  selected_syori_rireki1:ISyori_rireki1 | null;
  selected_syori_rireki2:ISyori_rireki2 | null;
  selected_syori_rireki3:ISyori_rireki3 | null;
  FindInterval:number;
  onSyori_rireki3Select:any;
  shouldBlink:any;
  selected_s3_id:number;
}
export const Syori_Rireki3 = (props:Syori_Rireki3Props) => {
  const dispatch: Dispatch<any> = useDispatch();
  const contentRef3 = createRef<HTMLDivElement>();
  const [TableHeight3, setTableHeight3] = useState('auto');
  const [CardFooterBottom3, setCardFooterBottom3] = useState(0);

  //表示データ管理用
  const [syori_rireki3s, setSyori_rireki3s] = useState<ISyori_rireki3[] | null>([]);
  const [isApiError, setIsApiError] = useState(false);
  const [isNeedFindPolling, setisNeedFindPolling] = useState(false);

  //ローカルストレージ保存対象
  const [display_character_limit, setdisplay_character_limit] = React.useState(0);
  const [isTextLimitChecked, setisTextLimitChecked] = React.useState(true);
  const [isTableNoWrapChecked, setisTableNoWrapChecked] = React.useState(true);
  
  //検索用
  const [isFindingSyoriRireki3, setIsFindingSyoriRireki3] = useState(false);

  //検索
  async function FindSyori_rireki3(isabsoluteFind: boolean): Promise<void> {
    if (!isabsoluteFind && props.activeTab !== "tab3") return;
    if (!props.selected_syori_rireki1 || !props.selected_syori_rireki2) return;
    if (isFindingSyoriRireki3) return; // 実行中なら何もしない
    try {
      setIsFindingSyoriRireki3(true);

      let data = {
        s1_id: props.selected_syori_rireki2.s1_id,
        s_count: props.selected_syori_rireki2.s_count,
        s2_id: props.selected_syori_rireki2.s2_id,
        syori_modify_count: props.selected_syori_rireki1.syori_modify_count,
        m_keyword_modify_count: props.selected_syori_rireki1.m_keyword_modify_count,
      };
  
      // API発行
      const response = await callApi('syori_rireki3_tab_find', data, 'application/x-www-form-urlencoded');
      if (syori_rireki3s) setSyori_rireki3s(null); // 初期化
  
      if (response && response.data && response.data.data) {
        const data: ISyori_rireki3[] = JSON.parse(response.data.data);
        if (data) {
          data.forEach((value: ISyori_rireki3) => {
            const sr3 = new Syori_rireki3();
            Object.assign(sr3, value);
            setSyori_rireki3s(prev => [...(prev || []), sr3]);
          });
        }
        setIsApiError(false); // APIエラー発生フラグのリセット
      } else {
        setIsApiError(true);
        throw new Error('API Error');
      }
    } catch (error) {
      setIsApiError(true);
      console.error(error);
    } finally {
      setIsFindingSyoriRireki3(false);
    }
  }

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
    if (isNeedFindPolling) {
      setisNeedFindPolling(false);
      FindSyori_rireki3(false);
    }
  }, [isNeedFindPolling]);
  

  //一覧検索(選択対象が変わった場合の検索)
  useEffect(() => {
    FindSyori_rireki3(true);
  }, [props.selected_syori_rireki2]);


  // ローカルストレージへの保存
  function func_setdisplay_character_limit(value:number){
    const data = { 
      display_character_limit: value ,
      isTextLimitChecked: isTextLimitChecked ,
      isTableNoWrapChecked: isTableNoWrapChecked 
    };
    localStorage.setItem("Syori_rireki3", JSON.stringify(data));
    setdisplay_character_limit(value);
  }
  function func_setisTextLimitChecked(value:boolean){
    const data = { 
      display_character_limit: display_character_limit ,
      isTextLimitChecked: value ,
      isTableNoWrapChecked: isTableNoWrapChecked 
    };
    localStorage.setItem("Syori_rireki3", JSON.stringify(data));
    setisTextLimitChecked(value);
  }
  function func_setisTableNoWrapChecked(value:boolean){
    const data = { 
      display_character_limit: display_character_limit ,
      isTextLimitChecked: isTextLimitChecked ,
      isTableNoWrapChecked: value 
    };
    localStorage.setItem("Syori_rireki3", JSON.stringify(data));
    setisTableNoWrapChecked(value);
  }

  // ローカルストレージからの読み込み
  useEffect(() => {
    //既に初期値(0)以外が入っている場合は何もしない
    if (display_character_limit != 0) return;

    const savedData = localStorage.getItem("Syori_rireki3");
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


  //タイトルの表示箇所
  const title3 = (
    <>
      {/* 横に並べて表示 */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {/* 動的に表示対象が変わった場合、点滅させる */}
        <h6 className={`mt-0 font-weight-bold text-green ${props.shouldBlink ? `${styles.blink}` : ''}`} style={{ margin: '0' }} >
          {props.selected_syori_rireki1 && props.selected_syori_rireki2 && (
            // `子) 処理No[${props.selected_syori_rireki1.s1_id}:${props.selected_syori_rireki1.s1_name}] 処理回数[${props.selected_syori_rireki1.s_count}]` }
            // `孫) シート名[${props.selected_syori_rireki2.sheetname}] シナリオ[${props.selected_syori_rireki2.scenario}]` }
          <>
            <div>
              子) 処理No:
              <span style={{ color: 'black' }}>
                {props.selected_syori_rireki1.s1_id}:{props.selected_syori_rireki1.s1_name}
              </span>
              /処理回数:
              <span style={{ color: 'black' }}>
                {props.selected_syori_rireki1.s_count}
              </span>
            </div>

            <div>
              孫) シート名:
              <span style={{ color: 'black' }}>
                {props.selected_syori_rireki2.sheetname}
              </span>
              /シナリオ:
              <span style={{ color: 'black' }}>
                {props.selected_syori_rireki2.scenario}
              </span>
            </div>
          </>
          )}
        </h6>
        {props.shouldBlink ? (
          // アイコンを点滅
          <i className={`fa fa-forward-fast ${styles.blink}`} style={{ color: 'blue',marginLeft:"8px" }}></i>
        ) : null}
      </div>

    </>
  );

  //ヘッダーボタン各種の表示箇所
  const headerButtons3 = (
    <>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
          <div style={{ marginRight: '8px', minWidth: '130px', marginTop:'10px' }}>
            <Checkbox
              id="display_character_check3"
              value={isTextLimitChecked}
              field="display_character_check3"
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
              id="TableNoWrapChecked3"
              value={isTableNoWrapChecked}
              field="TableNoWrapChecked3"
              onChange={() => func_setisTableNoWrapChecked(!isTableNoWrapChecked)}
              label="改行しない"
            />
          </div>
        </div>
    </>
  );

  //テーブルの表示箇所
  const tableContent3 = (
    <>
      {props.selected_syori_rireki2?
        <SyoriRireki3Table 
          syori_rireki3s={syori_rireki3s} 
          display_character_limit={display_character_limit} 
          is_display_character_limit_Checked={true}
          height={TableHeight3}
          isTextLimitChecked={isTextLimitChecked}
          isTableNoWrapChecked={isTableNoWrapChecked}
          selected_syori_rireki3={props.selected_syori_rireki3}
          onSyori_rireki3Select={props.onSyori_rireki3Select}
        />
      :
        null
      }
    </>
  );

  return(
    <>
      {(syori_rireki3s? 
        <div ref={contentRef3}>
          <CustomTable 
            title={title3} 
            headerButtons={headerButtons3} 
            tableContent={tableContent3} 
            setTableHeight={setTableHeight3}
            setCardFooterBottom={setCardFooterBottom3}
            ParentRef={props.CustomTableParentRef}
            onCloseClick={() =>{dispatch(setModificationState3(Syori_rireki1ModificationStatus.None));}}
            //グリッドシステム
            titleCol="col-md-6"
            headerButtonsCol="col-md-5"
            ComponentPositionsID="syori_rireki3_list_tab"
            />
        </div>
      : 
        <div style={{ textAlign: 'left', padding: '20px' }}>
          データがありません
        </div>      
      )}
    </>
  )


}




//-------------------------------------------------------------
//テーブル明細:Syori_rireki3List
//-------------------------------------------------------------
export type syori_rireki3ListProps = {
  syori_rireki3s:ISyori_rireki3[] | null;
  display_character_limit:number;
  is_display_character_limit_Checked:boolean;
  height:any;
  isTextLimitChecked:boolean;
  isTableNoWrapChecked:boolean;
  selected_syori_rireki3:ISyori_rireki3 | null;
  onSyori_rireki3Select:any;
};

const SyoriRireki3Table = (props: syori_rireki3ListProps) => {
  const dispatch: React.Dispatch<any> = useDispatch();
  const syori_rireki1s: ISyori_rireki1State = useSelector((state: IStateType) => state.syori_rireki1s);

  //ループの各要素で異なるstateを準備する
  const [isLogOpen3Array, setIsLogOpen3Array] = React.useState<boolean[]>(new Array(props.syori_rireki3s? props.syori_rireki3s.length:0).fill(false));
  const [logMsg, setlogMsg] = React.useState<string[]>(new Array(props.syori_rireki3s? props.syori_rireki3s.length:0).fill(""));

  //テーブル最下行自動スクロール制御用
  const tableRef = React.useRef<HTMLTableElement>(null);
  const observerRef = React.useRef<IntersectionObserver | null>(null);
  const isScrolledToBottom: boolean = useSelector((state: IStateType) => state.syori_rireki1s.isScrolledToBottom);

  //ログ画面を開く
  const Onlog_Button3 = async (index: number)  => {
    setIsLogOpen3Array(prevState => {
      const newState = [...prevState];
      newState[index] = true;
      return newState;
    });
    if (!props.syori_rireki3s){return};
    //ログ取得APIをコール(ログはサイズが大きく高負荷なので必要時に取得させる)
    GetSyori3_log(props.syori_rireki3s[index].s1_id,props.syori_rireki3s[index].s2_id,props.syori_rireki3s[index].s3_id,props.syori_rireki3s[index].s_count,index);
  }

  //処理3の停止ボタン
  const OnStop3_Button = async (syoriRireki3: Syori_rireki3)  => {
    const data = { 
      s1_id: syoriRireki3.s1_id,
      s2_id: syoriRireki3.s2_id,
      s3_id: syoriRireki3.s3_id,
      s_count: syoriRireki3.s_count
   };
    //API発行             
    await callApi('stop_syori_rireki3', data,'application/x-www-form-urlencoded');
  }


  //ログ画面を閉じる
  const Onlog_ButtonClose3 = (index: number) => {
    setIsLogOpen3Array(prevState => {
      const newState = [...prevState];
      newState[index] = false;
      return newState;
    });
  };

  //画面キャプチャをダウンロードする
  const onOngDownload = async (sr3: Syori_rireki3) => {
    const data = { 
      s1_id: sr3.s1_id,
      s2_id: sr3.s2_id,
      s3_id: sr3.s3_id,
      s_count: sr3.s_count
    };

    // //API発行             
    const response = await callApi('get_syori_rireki3_screen_shot_file', data,'application/x-www-form-urlencoded',true);
    if (response && response.data){
      const blob = new Blob([response.data], { type: "image/png" });
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
      URL.revokeObjectURL(url);
    }

  };
  
  //isTextLimitCheckedがtrueの場合、文字列が長すぎる際に省略符号...を追加
  function LimitValue(value:string){
    if (value === null || value === undefined) {
      return "";
    }     
    if (props.isTextLimitChecked && value.length > props.display_character_limit){
      return(
        value.slice(0, props.display_character_limit) + "..."
        )
    }else{
      return(
        value
        )
    }
  }

  // タイトルと値からtd要素を返す
  const renderTableData = (columns: { title: string, value: string }[]) => {
    return columns.map((column, index) => {
      // 値を省略表示する関数
      const displayValue = (value: string) => {
        // is_display_character_limit_Checkedがtrueで、文字列の長さが一定以上の場合、...で略式表示する
        return LimitValue(value);
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

  //ログ取得APIをコール(ログはサイズが大きく高負荷なので必要時に取得させる)
  async function GetSyori3_log(s1_id:number,s2_id:number, s3_id:number,s_count:number,index: number) {
    const data = { 
                    s1_id: s1_id,
                    s2_id: s2_id,
                    s3_id: s3_id,
                    s_count: s_count
                 };
    //API発行             
    const response = await callApi('get_syori_rireki3_log', data,'application/x-www-form-urlencoded');
    if (response && response.data && response.data.data){
      setlogMsg(prevState => {
        const newState = [...prevState];
        newState[index] = response.data.data;
        return newState;
      });
    }
  }

  //現在ユーザが見ているのが最下行なら、データ更新後もスクロールをさせる
  useEffect(() => {
    // テーブル要素を取得
    const table = tableRef.current;
    if (!table) return;

    // 既存のオブザーバーがあれば破棄してリソースを解放
    if (observerRef.current) observerRef.current.disconnect(); 

    // テーブルの最下行を取得
    const lastRow = table.rows[table.rows.length - 1];
    if (!lastRow) return;

    // 最下行が表示されていた場合、スクロールさせる
    if (isScrolledToBottom) {
      lastRow.scrollIntoView({ behavior: 'smooth' });
    }

    // 新しいIntersectionObserverインスタンスを作成(Intersection Observer API利用:Y下記に関数の説明有り)
    const newObserver = new IntersectionObserver(
      (entries) => {
        // 最下行が表示されているかどうかを判断
        dispatch(SetisScrolledToBottom(entries[0].isIntersecting));
      },
      { threshold: 0 } // 最下行が完全に表示されている場合にのみコールバックを実行
    );
    // 最下行の監視を開始
    newObserver.observe(lastRow);
  
    // 新しいオブザーバーをstateに保存
    observerRef.current = newObserver;
  
    // クリーンアップ関数：コンポーネントのクリーンアップ時にオブザーバーを破棄
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [props.syori_rireki3s]);

  //-------------------------------------------------------------
  //Intersection Observer API の説明   ChatGPT作
  //-------------------------------------------------------------
  // Intersection Observer APIは、ウェブページ上の要素がビューポートまたは特定の要素と交差しているかどうかを非同期的に監視するためのAPIです。
  // 要素が表示されたり、非表示になったりすると、コールバック関数が実行されます。このAPIは、遅延読み込みや無限スクロールなどの機能を実装する際に非常に便利です。
  // 基本的な使用方法は以下の通りです。
  // コールバック関数を作成します。この関数は、監視対象の要素が交差するたびに実行されます。
  // 引数として、交差している要素の情報を持つentriesと、IntersectionObserverのインスタンスを受け取ります。
  // function callback(entries, observer) {
  //   entries.forEach((entry) => {
  //     // entry.isIntersecting: 要素が交差しているかどうかの真偽値
  //     // entry.intersectionRatio: 交差している領域の割合
  //     // entry.target: 監視対象の要素
  //     // entry.boundingClientRect: 要素の位置とサイズに関する情報
  //     // entry.intersectionRect: 交差している領域の位置とサイズに関する情報
  //     // entry.rootBounds: ビューポートまたはルート要素の位置とサイズに関する情報
  //   });
  // }
  //
  // IntersectionObserverインスタンスを作成し、上記で作成したコールバック関数を渡します。
  // オプションで、監視対象要素の交差をどのように評価するかを設定できます。
  // const options = {
  //   root: null, // ビューポートを基準にする場合はnull、特定の要素を基準にする場合はその要素を指定
  //   rootMargin: "0px", // 交差の評価範囲をビューポートまたはルート要素の周りに余白を追加して拡張する
  //   threshold: 0, // 交差のしきい値（0から1の範囲で指定）、0の場合は要素が交差するとすぐにコールバックが実行され、1の場合は完全に表示されるまでコールバックが実行されない
  // };
  // const observer = new IntersectionObserver(callback, options);
  //
  //監視対象の要素を指定して、IntersectionObserverインスタンスによる監視を開始します。
  // const target = document.querySelector("#target-element");
  // observer.observe(target);
  //
  //必要に応じて、監視を終了するためにdisconnect()メソッドを使用します。
  // observer.disconnect();
  //
  // Intersection Observer APIを使用することで、以下のような利点があります。
  //
  // パフォーマンスの向上: 従来のスクロールイベントリスナーと比較して、非同期的な処理が可能であり、パフォーマンスが向上します。
  // 無限スクロールや遅延読み込みの実装が容易: APIの特性上、要素がビューポートに表示されるタイミングを検出することが簡単にできます。これにより、無限スクロールや遅延読み込みの実装が容易になります。
  // 柔軟な設定: root, rootMargin, thresholdといったオプションを使用して、監視対象要素の交差を評価する条件をカスタマイズできます。
  // 上記の利点により、Intersection Observer APIはウェブアプリケーションにおいて要素の表示状態を監視する際に非常に役立ちます。
  
  
  // 実行結果と想定結果が異なり、想定結果が空欄でなく、終了時刻がnullでない場合、セルの背景色を赤にする
  function getBackgroundColor(syoriRireki3: Syori_rireki3): string {
    //中止の場合は黄色にする
    if (syoriRireki3.is_suspension) return "yellow";

      //実行中の場合は抜ける
    if (!syoriRireki3.result_type) return "";

    //想定通りの相違であれば緑にする
    if (syoriRireki3.result_type === 2) return "";

    //想定と異なる場合、赤緑にする
    if (syoriRireki3.result_type === 1) return "red";

    return "";
  }

  function runResult_td(syoriRireki3: Syori_rireki3) {
    //セパレータの場合は何もしない
    if (syoriRireki3.keyword == 'セパレータ') return null;

    if (syoriRireki3.end_time == null) {
      // 実行中の場合、中止ボタンを表示する
      return (
        <button className={`btn btn-outline-dark ${styles.smallButton}`} onClick={() => { OnStop3_Button(syoriRireki3); }}> 
          <FontAwesomeIcon icon={faHand} className={styles.faIconStop} />
          <span className={styles.logStop}>stop{syoriRireki3.result_type}</span>
        </button>
      )
    }
    // 実行が終了している場合、結果を表示する

    if (syoriRireki3.result_type === 0) {
      // 想定結果と実行結果が同じ場合、正常終了として扱う
      return (
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", color: "blue" }}>
          <FontAwesomeIcon icon={faThumbsUp} style={{ verticalAlign: "middle" }} />
          {/* 実行結果が表示文字数の上限を超える場合、末尾を省略する */}
          <span style={{ color: "black", marginLeft: '4px' }}>
            {props.is_display_character_limit_Checked && syoriRireki3.run_result && syoriRireki3.run_result.length > props.display_character_limit
              ? syoriRireki3.run_result.slice(0, props.display_character_limit) + "..."
              : syoriRireki3.run_result}

          </span>
        </div>
      )
    }

    // 中止は緑の中止マークを表示 
    if (syoriRireki3.is_suspension){
      return(
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <FontAwesomeIcon icon={faHand} style={{ color: 'green' }} />
          <span style={{ fontSize: '10px', marginLeft: '5px',color: 'green' }}>中止</span>
        </div>
      )
    }

    // 想定結果と実行結果が異なる場合、異常終了として扱う
    let icon = faXmark;
    let color = "white";
    if (syoriRireki3.result_type === 2) {
      //想定相違の場合、×アイコンを表示
      icon = faCircleXmark;
      color = "blue"
    }
    if (syoriRireki3.result_type === 4) {
      //コメントアウトによるSKIPの場合、SKIPアイコンを表示
      icon = faForwardStep;
      color = "green"
      syoriRireki3.run_result = "SKIP";
    }

    return (
      <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
        <FontAwesomeIcon icon={icon} style={{ verticalAlign: "middle", color: color }} />
        {/* 実行結果が表示文字数の上限を超える場合、末尾を省略する */}
        <span style={{ color: color, marginLeft: '4px' }}>
          {props.is_display_character_limit_Checked && syoriRireki3.run_result && syoriRireki3.run_result.length > props.display_character_limit
          ? syoriRireki3.run_result.slice(0, props.display_character_limit) + "..."
          : syoriRireki3.run_result}
        </span>
      </div>
    )
  }

  //行選択の着色
  function getrowClassName(syoriRireki3: Syori_rireki3): string {
      const isSelected =
      props.selected_syori_rireki3 &&
      props.selected_syori_rireki3.s1_id === syoriRireki3.s1_id &&
      props.selected_syori_rireki3.s2_id === syoriRireki3.s2_id &&
      props.selected_syori_rireki3.s3_id === syoriRireki3.s3_id &&
      props.selected_syori_rireki3.s_count === syoriRireki3.s_count;

      return `table-row ${isSelected ? styles.selected : ""}`;
  }

  return (
    <div className={styles.table3Content} style={{maxHeight: props.height}}>
      <table className={`table ${props.isTableNoWrapChecked ? styles.tableNoWrap : ""}`} style={{minWidth: '1500px'}} ref={tableRef}>
        <thead className={`thead-light ${styles.table3Header}`}>
          <tr>
            <th>処理No3</th>
            <th>Step</th>
            <th>処理内容</th>
            <th>コメント</th>
            <th>キーワード</th>
            <th>想定結果</th>
            <th>実施結果</th>
            <th>想定相違</th>
            <th>進捗率</th>
            <th>ログ</th>
            <th>値1</th>
            <th>値2</th>
            <th>値3</th>
            <th>変数</th>
            <th>想定相違で停止</th>
            <th>開始</th>
            <th>終了</th>
            <th>所要時間</th>
          </tr>
        </thead>
        <tbody>
          {props.syori_rireki3s && props.syori_rireki3s.map((syoriRireki3, index) => (
            <tr key={syoriRireki3.s3_id} 
              className={syoriRireki3.keyword === 'セパレータ' ? `${styles.separatorRow} ${styles.tightRow}` : `${styles.tightRow} ${getrowClassName(syoriRireki3)}`} 
              onClick={() => {
                if (props.onSyori_rireki3Select) {
                  props.onSyori_rireki3Select(syoriRireki3);
                }
              }}
            >

              <td>{syoriRireki3.s3_id}</td>
              <td>{syoriRireki3.step}</td>
              {renderTableData([{ title: "proc_cont", value: syoriRireki3.proc_cont }])}{/* 表示文字制限 */}
              {renderTableData([{ title: "comment", value: syoriRireki3.comment }])}{/* 表示文字制限 */}
              {syoriRireki3.keyword !== 'セパレータ' ? (
                renderTableData([{ title: "keyword", value: syoriRireki3.keyword }])
              ) : (
                <td></td>
              )}
              {/* 想定結果 */}
              <td
                // セルのスタイルを設定
                style={{ verticalAlign: "middle", textAlign: "center" }}
                // セルのタイトル属性を設定(マウスでフォーカスをセットすると全文が見える様に)
                title={syoriRireki3.ass_result}
              >
                {/* is_display_character_limit_Checkedがtrueの場合、文字列が長すぎる際に省略符号...を追加 */}
                {LimitValue(syoriRireki3.ass_result)}
              </td>
              
              {/* 実施結果 */}

              <td
                // セルのスタイルを設定
                style={{ verticalAlign: "middle", textAlign: "center" }}

                // 実行結果を表示する
                title={syoriRireki3.keyword === 'セパレータ' || syoriRireki3.end_time == null  ?"":(syoriRireki3.is_ok?syoriRireki3.ok_result :syoriRireki3.ng_result)}
              >
                {/* 実施結果の表示 */}
                {LimitValue(syoriRireki3.keyword === 'セパレータ' || syoriRireki3.end_time == null  ?"":(syoriRireki3.is_ok?syoriRireki3.ok_result :syoriRireki3.ng_result))}
              </td>

              {/* 想定相違 */}
              <td
                // セルのスタイルを設定する
                style={{
                  verticalAlign: "middle",
                  textAlign: "center",
                  // 実行結果と想定結果が異なり、想定結果が空欄でなく、終了時刻がnullでない場合、セルの背景色を赤にする
                  backgroundColor: getBackgroundColor(syoriRireki3),
                }}
                // 実行結果を表示する
                title={syoriRireki3.run_result}
              >
                {/* 実施結果の表示 */}
                {runResult_td(syoriRireki3)}
              </td>


              {/* 進捗率 */}
              <td style={{verticalAlign: 'middle'}}> {syoriRireki3.keyword !== 'セパレータ' ? <ProgressBar animated　variant="dark" now={syoriRireki3.percent3} label={`${syoriRireki3.percent3}%`} />:null}</td>
              {/* ログ */}
              <td>
                {syoriRireki3.log?(
                <>
                  <button className={`btn btn-outline-dark ${styles.smallButton}`} onClick={() => { Onlog_Button3(index); }}> 
                    <FontAwesomeIcon icon={faRectangleList} className={styles.faIcon} />
                    <span className={styles.logText}>log</span>
                  </button>
                  <LogModal 
                    title={`Log3-${syoriRireki3.s3_id}`} 
                    log={logMsg[index]}
                    isOpen={isLogOpen3Array[index]} 
                    onClose={() => { Onlog_ButtonClose3(index); }} 
                    // スクリーンショット格納先が空でない場合、ログ画面にダウンロードボタンを表示する
                    onOngDownload={syoriRireki3.screen_shot_filepath != "" ? () => { onOngDownload(syoriRireki3); } :undefined} 
                  />
                </>
                ): null
                }
              </td>
              {/* 値など */}
              {renderTableData([{ title: "value1", value: syoriRireki3.value1 }])}{/* 表示文字制限 */}
              {renderTableData([{ title: "value2", value: syoriRireki3.value2 }])}{/* 表示文字制限 */}
              {renderTableData([{ title: "value3", value: syoriRireki3.value3 }])}{/* 表示文字制限 */}
              {renderTableData([{ title: "variable1", value: syoriRireki3.variable1 }])}{/* 表示文字制限 */}

              {/* 所要時間 */}
              <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                {syoriRireki3.keyword !== 'セパレータ' && syoriRireki3.ng_stop ? <FontAwesomeIcon icon={faCheck} style={{ verticalAlign: 'middle' }} /> : null}
              </td>
              <td>
                {syoriRireki3.keyword !== 'セパレータ' && moment(syoriRireki3.start_time).isValid()
                  ? moment(syoriRireki3.start_time).format('HH:mm:ss')
                  : null}
              </td>              
              <td>
                {syoriRireki3.keyword !== 'セパレータ' && moment(syoriRireki3.end_time).isValid()
                  ? moment(syoriRireki3.end_time).format('HH:mm:ss')
                  : null}
              </td>              
              <td className="tight-cell">
                {syoriRireki3.keyword !== 'セパレータ' 
                  ? moment.utc(moment(syoriRireki3.end_time).diff(moment(syoriRireki3.start_time))).format('HH:mm:ss') 
                  : null}
              </td>              

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SyoriRireki3Table;