import React, { Fragment, Dispatch, useState, useEffect, useRef} from "react";
import { ISyori_rireki1,Syori_rireki1ModificationStatus } from "../../store/models/syori_rireki1.interface";
import { useDispatch, useSelector } from "react-redux";
import { IStateType,ISyori_rireki1State } from "../../store/models/root.interface";
import { setModificationState, setModificationState2, setModificationState3 } from "../../store/actions/syori_rireki1.action";
 import { updateCurrentPath } from "../../store/actions/root.actions";
import  { Syori_Rireki1 } from "./Syori_rireki1List_tab";
import { callApi } from "../../common/comUtil";
import { Syori_Rireki3 } from "./Syori_rireki3List_tab";
import { Syori_Rireki2 } from "./Syori_rireki2List_tab";
import { ISyori_rireki2 } from "store/models/syori_rireki2.interface";
import styles from "./Syori_rireki_tab.module.css";
import { ISyori_rireki3 } from "store/models/syori_rireki3.interface";
import ToolBox from './ToolBox'; 
import { UploadSyori } from "components/Syori_rireki1_tab/UploadSyori";
import { ISyori1, Syori1 } from "store/models/syori1.interface";
import { BLINK_SECONDS } from "common/constants";

export type syori_rireki1sProps = {
  children?: React.ReactNode;
};

function Syori_rireki1s(props: syori_rireki1sProps): JSX.Element  {
  const dispatch: Dispatch<any> = useDispatch();
  const syori_rireki1s: ISyori_rireki1State = useSelector((state: IStateType) => state.syori_rireki1s);

  //これらstateの初期化はページが遷移する度に行われる
  const [CardFooterBottom1, setCardFooterBottom1] = useState(0);
  const [CardFooterBottom2, setCardFooterBottom2] = useState(0);
  // テーブルの高さを管理するためのステート
  const [TableHeight1, setTableHeight1] = useState('auto');
  //タブ管理
  const [activeTab, setActiveTab] = useState('tab1');
  //選択行の管理用
  const [selected_syori_rireki1, setSelected_syori_rireki1] = useState<ISyori_rireki1 | null>(null);
  const [selected_syori_rireki2, setSelected_syori_rireki2] = useState<ISyori_rireki2 | null>(null);
  const [selected_syori_rireki3, setSelected_syori_rireki3] = useState<ISyori_rireki3 | null>(null);
  const [selected_s1_id, setSelected_s1_id] = useState(0);
  const [selected_s_count, setSelected_s_count] = useState(0);
  const [selected_s2_id, setSelected_s2_id] = useState(0);
  const [selected_s3_id, setSelected_s3_id] = useState(0);
  const [autoSelected_s1_id, setAutoSelected_s1_id] = useState(0);
  const [autoSelected_s_count, setAutoSelected_s_count] = useState(0);
  //UP&実行用
  const [syori1, setSyori1] = React.useState(new Syori1());
  const [isUploadModalOpen, setisUploadModalOpen] = useState(false);
  //ローカルストレージ保存対象
  const [FindInterval, setFindInterval] = useState(1);
  //ローカルストレージ操作方フラグ
  const [isInitialized, setIsInitialized] = useState(false);
  //フォーム表示用
  const [isContentOpen, setIsContentOpen] = useState(false);
  //明細表示用
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  //点滅管理用
  const [shouldBlink_syori_rireki1, setshouldBlink_syori_rireki1] = useState<ISyori_rireki1 | null>(null);
  const [shouldBlink, setShouldBlink] = useState(false);
  //実行で指定する処理No2用
  const [s2_id, setS2_id] = useState('');
  //同一処理自動更新
  const [isAutoBlink, setIsAutoBlink] = useState(true);
  const handleAutoBlinkCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsAutoBlink(event.target.checked);
  };
    
  async function onSyori_rireki1Select(Syori_rireki1: ISyori_rireki1): Promise<void> {
    setSelected_syori_rireki1(Syori_rireki1);
    setSelected_s1_id(Syori_rireki1.s1_id);
    setSelected_s_count(Syori_rireki1.s_count);
    dispatch(setModificationState(Syori_rireki1ModificationStatus.detail));
    dispatch(setModificationState2(Syori_rireki1ModificationStatus.detail));
    setIsDetailOpen(true);
  }
  async function onSyori_rireki2Select(Syori_rireki2: ISyori_rireki2): Promise<void> {
    setSelected_syori_rireki2(Syori_rireki2);
    setSelected_s2_id(Syori_rireki2.s2_id);
    dispatch(setModificationState3(Syori_rireki1ModificationStatus.detail));
  }
  async function onSyori_rireki3Select(Syori_rireki3: ISyori_rireki3): Promise<void> {
    setSelected_syori_rireki3(Syori_rireki3);
    setSelected_s3_id(Syori_rireki3.s3_id);
  }

  //処理マスタを検索(UP&実行アップローダに処理の番号を表示する際の情報)
  async function findSyori1(){
    if (!selected_syori_rireki1) return;
    const data = { 
      limit: 100,
      offset: 0,
      findstr:"",
      isDelDataShow:true,
      s1_id:selected_syori_rireki1.s1_id
    };

    const response = await callApi('syori1_find', data,'application/x-www-form-urlencoded');//「application/x-www-form-urlencoded」はURLエンコードした平文での送信
    if (response){
      const syori1_array: ISyori1[] = JSON.parse(response.data.data);
      if (syori1_array){
        syori1_array.map((value: ISyori1) => {
          Object.assign(syori1, value);
          setSyori1(syori1);
        });
      }
    };
  }
  //処理マスタを検索(UP&実行アップローダに処理の番号を表示する際の情報)
  useEffect(() => {
    findSyori1();
  }, [isUploadModalOpen]);
  
  // 実行
  const exec_Button = async ()  => {
    if (selected_syori_rireki1){
      // s2_idがカンマ区切りの数値かチェックする正規表現
      const commaSeparatedNumbersRegex = /^(\d+(,\d+)*)?$/;
      const data = {
        s1_id: selected_syori_rireki1.s1_id,
        ...(s2_id && commaSeparatedNumbersRegex.test(s2_id) ? { s2_ids: s2_id } : {})
      };

      //API発行
      await callApi('exec_syori', data,'application/x-www-form-urlencoded');
    }
  }
  useEffect(() => {
     //入力フォームの表示位置までスクロールする
    //https://blog.usize-tech.com/vertical-scroll-by-react/
    if (isContentOpen) {
      const checkElement = () => {
        const headerElement = document.getElementById("syori_rireki1_form_header");
        if (headerElement) {
          headerElement.scrollIntoView({ behavior: "smooth", block: "center" });
          setIsContentOpen(false);
        } else {
          //非同期処理により画面表示が遅れるので、最大2秒待つ
          setTimeout(checkElement, 100); // 100ms後に再試行
        }
      };
      setTimeout(checkElement, 100); // 初回実行
      setTimeout(() => setIsContentOpen(false), 2000); // 2秒後に強制終了
    }    

    //明細の表示位置までスクロールする
    if (isDetailOpen) {
      if (document.getElementById("Syori_rireki1s_detail")){
        document.getElementById("Syori_rireki1s_detail")!.scrollIntoView({behavior:"smooth",block:"center"});
        setIsDetailOpen(false);
      }
    };

    //明細の表示位置までスクロールする
    if (isDetailOpen) {
      if (document.getElementById("Syori_rireki1s_detail")){
        document.getElementById("Syori_rireki1s_detail")!.scrollIntoView({behavior:"smooth",block:"center"});
        setIsDetailOpen(false);
      }
    };

    //明細2の表示位置までスクロールする
    if (syori_rireki1s.modificationState2) {
      if (document.getElementById("Syori_rireki2s_detail")){
        document.getElementById("Syori_rireki2s_detail")!.scrollIntoView({behavior:"smooth",block:"center"});
        setIsDetailOpen(false);
      }
    };

    //明細3の表示位置までスクロールする
    if (syori_rireki1s.modificationState3) {
      if (document.getElementById("Syori_rireki3s_detail")){
        document.getElementById("Syori_rireki3s_detail")!.scrollIntoView({behavior:"smooth",block:"center"});
        setIsDetailOpen(false);
      }
    };

  }, [isDetailOpen,isContentOpen,syori_rireki1s.modificationState2,syori_rireki1s.modificationState3]);


  useEffect(() => {
    dispatch(updateCurrentPath("syori_rireki1", "list"));
  }, []);
  
  //-------------------------------------------------------------
  //ローカルストレージ 制御
  //-------------------------------------------------------------
  
  // ローカルストレージへの保存
  function func_setFindInterval(value:number){
    setFindInterval(value);//本来のsetstate
  }

  // ローカルストレージへの保存
  useEffect(() => {
    if (isInitialized) { 
        const data = { 
          FindInterval: FindInterval, 
          selected_s1_id:selected_s1_id,
          selected_s_count:selected_s_count,
          selected_s2_id:selected_s2_id,
          selected_s3_id:selected_s3_id,
          autoSelected_s1_id:autoSelected_s1_id,
          autoSelected_s_count:autoSelected_s_count,
          activeTab:activeTab,
        };
        localStorage.setItem('syori_rireki', JSON.stringify(data));
      }
  }, [FindInterval, selected_s1_id, selected_s2_id, selected_s3_id,selected_s_count,autoSelected_s1_id,autoSelected_s_count,activeTab]);

  // ローカルストレージからの読み込み
  useEffect(() => {
    //既に初期値(0)以外が入っている場合は何もしない
    if (FindInterval != 1) return;

    const savedData = localStorage.getItem("syori_rireki");
    if (savedData) {
        const parseData = JSON.parse(savedData);
        setFindInterval(parseData.FindInterval);
        setSelected_s1_id(parseData.selected_s1_id);
        setSelected_s_count(parseData.selected_s_count);
        setSelected_s2_id(parseData.selected_s2_id);
        setSelected_s3_id(parseData.selected_s3_id);
        setAutoSelected_s1_id(parseData.autoSelected_s1_id);
        setAutoSelected_s_count(parseData.autoSelected_s_count);
        setActiveTab(parseData.activeTab);
    }else{
        //ストレージに無い場合は初期値をセット
        setFindInterval(1);
        setSelected_s1_id(0);
        setSelected_s_count(0);
        setSelected_s2_id(0);
        setSelected_s3_id(0);
        setAutoSelected_s1_id(0);
        setAutoSelected_s_count(0);
        setActiveTab('tab1');
    }
    setIsInitialized(true); 
  }, []);
  
    //点滅行判定
    useEffect(() => {
      let timeoutId: string | number | NodeJS.Timeout | null | undefined = null;
      if (shouldBlink_syori_rireki1){
        setShouldBlink(true);
        //3秒後に点滅対象をリセットする
        timeoutId = window.setTimeout(() => {
          setshouldBlink_syori_rireki1(null);
          setShouldBlink(false);
        }, BLINK_SECONDS);
      }
      //タイマー破棄
      return () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      };      
    }, [shouldBlink_syori_rireki1]);  



  //-------------------------------------------------------------
  //タブ 制御
  //-------------------------------------------------------------

  // タブのタイトル部分
  const renderTabs = () => (
    <ul className={styles.tabList}>
      <li className={activeTab === 'tab1' ? styles.active : ''} onClick={() => setActiveTab('tab1')}>処理履歴１：親</li>
      <li className={activeTab === 'tab2' ? styles.active : ''} onClick={() => setActiveTab('tab2')}>処理履歴２：子</li>
      <li className={activeTab === 'tab3' ? styles.active : ''} onClick={() => setActiveTab('tab3')}>処理履歴３：孫</li>
    </ul>
  );
  

  // タブコンテンツ部分
  const renderTabContent = () => {
      return (
        <>
          <div style={{ display: activeTab === 'tab1' ? 'block' : 'none' }}>
            <Syori_Rireki1
              FindInterval={FindInterval}
              onSyori_rireki1Select={onSyori_rireki1Select}
              setIsContentOpen={setIsContentOpen}
              TableHeight1={TableHeight1}
              setTableHeight1={setTableHeight1}
              setCardFooterBottom1={setCardFooterBottom1}
              CustomTableParentRef={CustomTableParentRef}
              activeTab={activeTab}
              selected_syori_rireki1={selected_syori_rireki1}
              shouldBlink_syori_rireki1={shouldBlink_syori_rireki1}
              setshouldBlink_syori_rireki1={setshouldBlink_syori_rireki1}
              shouldBlink={shouldBlink}
              selected_s1_id={selected_s1_id}
              selected_s_count={selected_s_count}
              autoSelected_s1_id={autoSelected_s1_id}
              autoSelected_s_count={autoSelected_s_count}
              setAutoSelected_s1_id={setAutoSelected_s1_id}
              setAutoSelected_s_count={setAutoSelected_s_count}
              isAutoBlink={isAutoBlink}
            />
          </div>
          <div style={{ display: activeTab === 'tab2' ? 'block' : 'none' }}>
            <Syori_Rireki2
              CardFooterBottom1={CardFooterBottom1}
              CustomTableParentRef={CustomTableParentRef}
              setCardFooterBottom2={setCardFooterBottom2}
              activeTab={activeTab}
              FindInterval={FindInterval}
              selected_syori_rireki1={selected_syori_rireki1}
              selected_syori_rireki2={selected_syori_rireki2}
              onSyori_rireki2Select={onSyori_rireki2Select}
              shouldBlink_syori_rireki1={shouldBlink_syori_rireki1}
              shouldBlink={shouldBlink}
              selected_s1_id={selected_s1_id}
              selected_s2_id={selected_s2_id}
            />        
          </div>
          <div style={{ display: activeTab === 'tab3' ? 'block' : 'none' }}>
            <Syori_Rireki3
              syori_rireki1s={syori_rireki1s}
              CardFooterBottom={CardFooterBottom2}
              CustomTableParentRef={CustomTableParentRef}
              activeTab={activeTab}
              selected_syori_rireki1={selected_syori_rireki1}
              selected_syori_rireki2={selected_syori_rireki2}
              selected_syori_rireki3={selected_syori_rireki3}
              FindInterval={FindInterval}
              onSyori_rireki3Select={onSyori_rireki3Select}
              shouldBlink={shouldBlink}
              selected_s3_id={selected_s3_id}
            />
          </div>
        </>
      )
  };


//-------------------------------------------------------------
    //(ここまで)    ページング要素　の ローカルストレージ 制御
    //-------------------------------------------------------------

  
  
  //-------------------------------------------------------------
  //レンダリング
  //-------------------------------------------------------------
  const CustomTableParentRef = useRef(null);

  
  return (
    <Fragment>

      {/* CustomTableの起点となるDOM要素 */}
      {/* borderをtransparentで指定する事で、中のコンテンツを覆うエレメントが出来る。borderが無い場合、覆わなくなる(原因不明) */}
      <div id="hoge" style={{border:"1px solid transparent",position: "relative",height: "100%"}} ref={CustomTableParentRef}>

        {/* タブ タイトル */}
        {renderTabs()}

        {/* アクティブ タブ コンテンツ */}
        <div className={styles.tabContent}>
          {renderTabContent()}      
        </div>
        
        {/* ドラッグ可能なツールボックス */}
        <ToolBox 
          FindInterval={FindInterval}
          setFindInterval={func_setFindInterval}
          setisUploadModalOpen={setisUploadModalOpen}
          exec_Button={exec_Button}
          setS2_id={setS2_id}
          s2_id={s2_id}
          isAutoBlink={isAutoBlink}
          handleAutoBlinkCheckboxChange={handleAutoBlinkCheckboxChange}
          />

        {/* UP&実行画面 */}
        <UploadSyori 
          syori1={syori1}
          setSyori1={setSyori1}
          isUploadModalOpen={isUploadModalOpen}
          setisUploadModalOpen={setisUploadModalOpen}
          exec_Button={exec_Button}
        />


      </div>
    </Fragment >
  );


};

export default Syori_rireki1s;
