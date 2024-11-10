import React, { Fragment, Dispatch, useState, useEffect, useRef, createRef} from "react";
import { IM_keyword1,M_keyword1,M_keyword1ModificationStatus } from "../../store/models/m_keyword1.interface";
import { useDispatch, useSelector } from "react-redux";
import { IStateType,IM_keyword1State } from "../../store/models/root.interface";
import { setModificationState,setAllCount,ClearM_keyword1history,addM_keyword1History, updateM_keyword2s, changeSelectedM_keyword2} from "../../store/actions/m_keyword1.action";
 import { updateCurrentPath } from "../../store/actions/root.actions";
import M_keyword1Form from "./M_keyword1Form";
import M_keyword2List from "./M_keyword2List";
import M_keyword1HistoryList from "./M_keyword1HistoryList";
import {AUT_NUM_ADMIN} from "../../common/constants";
import styles from "./M_keyword1.module.css";
import { IAccount } from "../../store/models/account.interface";
import { callApi } from "../../common/comUtil";
import { IM_keyword2, M_keyword2 } from "../../store/models/m_keyword2.interface";
import SearchBar from "../../common/components/SearchBar";
import CustomTable from '../../common/components/CustomTableProps ';

export type m_keyword1sProps = {
  children?: React.ReactNode;
};

function M_keyword1s(props: m_keyword1sProps): JSX.Element  {
  const dispatch: Dispatch<any> = useDispatch();
  const m_keyword1s: IM_keyword1State = useSelector((state: IStateType) => state.m_keyword1s);
  const account: IAccount = useSelector((state: IStateType) => state.account);
  //ページネーション用
  const [CurrentPage, setCurrentPage] = useState(0);
  const [numberOfDisplaysPerpage, setnumberOfDisplaysPerpage] = useState(0);

  //これらstateの初期化はページが遷移する度に行われる
  const [findStr, setfindStr] = useState("");
  const [isNeedFind, setisNeedFind] = useState(true);
  const [MyCurrentPage, setMyCurrentPage] = useState(0);
  const [MynumberOfDisplaysPerpage, setMynumberOfDisplaysPerpage] = useState(100);
  
  //フォーム表示用
  const [isContentOpen, setIsContentOpen] = useState(false);
  //履歴表示用
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  //検索(ページネーション)
  async function FindM_keyword1() {
    const data = { limit: numberOfDisplaysPerpage,
      offset: (CurrentPage-1)*numberOfDisplaysPerpage,
      findstr:findStr
     };

    //API発行:全件取得             
    let response = await callApi('m_keyword1_find', data,'application/x-www-form-urlencoded');//
    if (response){
      
      const m_keyword1_array: M_keyword1[] = JSON.parse(response.data.data);
      if (m_keyword1_array){
        m_keyword1_array.map(value => {
          //mapするだけでは、シグネチャ型(m_keyword2)がundefinedになってしまうので、インスタンスを作成し、中身をアサインする
          const m_keyword1 = new M_keyword1();
          Object.assign(m_keyword1, value);
          //配列ゼロ番目に格納する(必ず1レコードしか存在しないテーブルなので)
          if (m_keyword1s.M_keyword1s[0]) {
            Object.assign(m_keyword1s.M_keyword1s[0], m_keyword1);
          } else{
            m_keyword1s.M_keyword1s[0] = m_keyword1;
          }
        });
      }
    };

    //API発行:画面表示分を取得             
    response = await callApi('m_keyword2_find', data,'application/x-www-form-urlencoded');//
    if (response){
      //初期化
      m_keyword1s.M_keyword2s ? m_keyword1s.M_keyword2s = {} : null;

      if (response.data.data){
        const m_keyword2_array: M_keyword2[] = JSON.parse(response.data.data);
        if (m_keyword2_array){
          m_keyword2_array.map(value => {
            const m_keyword2 = new M_keyword2();
            Object.assign(m_keyword2, value);
            m_keyword1s.M_keyword2s[m_keyword2.no]　= m_keyword2;
          });
        }
      }

      dispatch(updateM_keyword2s(m_keyword1s.M_keyword2s));
    };

    setisNeedFind(false);
  }

  async function onM_keyword1History() {
    if(m_keyword1s.M_keyword1s[0]) {
      await FindM_keyword1History();
      setIsHistoryOpen(true);
      dispatch(setModificationState(M_keyword1ModificationStatus.History));
    }
  }

  async function FindM_keyword1History() {
    const response = await callApi('m_keyword1_history_find', null,'application/x-www-form-urlencoded');
    if (response){
      //全履歴を初期化
      dispatch(ClearM_keyword1history());

      const m_keyword1_array: IM_keyword1[] = JSON.parse(response.data.data);
      if (m_keyword1_array){
        m_keyword1_array.map(value => (dispatch(addM_keyword1History(value))));
      }
    }
  }


  //件数検索
  async function m_keyword1_count() {
    const data = {findstr: findStr};
    const response = await callApi('m_keyword2_count', data,'application/x-www-form-urlencoded');
    if (response){
      //Ractのjson形式に変換(JavaのJsonが届くので)
      const str = JSON.stringify(response.data);
      const data = JSON.parse(str);
      dispatch(setAllCount(data.all_count));
      FindM_keyword1();
    };
  }

  //-------------------------------------------------------------
  //エクセルダウンロード
  //-------------------------------------------------------------
  const excelDownloadButton = async ()  => {
    if (!m_keyword1s.M_keyword1s[0]) return;
    const data = { modify_count: m_keyword1s.M_keyword1s[0].modify_count};
    const response = await callApi('m_keyword1_excel_download', data,'application/x-www-form-urlencoded',true);
    if (response && response.data){
      const blob = new Blob([response.data], { type: "application/octet-stream" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = m_keyword1s.M_keyword1s[0].excel_filename as string;
      a.click();
      a.remove();
      URL.revokeObjectURL(url); 
    }
  };


  useEffect(() => {
    //一覧検索
    if (isNeedFind || MyCurrentPage !=CurrentPage || MynumberOfDisplaysPerpage != numberOfDisplaysPerpage){
      m_keyword1_count();
      setisNeedFind(false);
      setMyCurrentPage(CurrentPage);
      setMynumberOfDisplaysPerpage(numberOfDisplaysPerpage);
    }

    //入力フォームの表示位置までスクロールする
    //https://blog.usize-tech.com/vertical-scroll-by-react/
    if (isContentOpen) {
      const checkElement = () => {
        const headerElement = document.getElementById("m_keyword1_form");
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

    //履歴の表示位置までスクロールする
    if (isHistoryOpen) {
      if (document.getElementById("m_keyword1_history_header")){
        document.getElementById("m_keyword1_history_header")!.scrollIntoView({behavior:"smooth",block:"center"});
        setIsHistoryOpen(false);
      }

    };
}, [isContentOpen,numberOfDisplaysPerpage,isHistoryOpen,isNeedFind,CurrentPage]);

function onM_keyword2Select(M_keyword2: IM_keyword2): void {
  dispatch(changeSelectedM_keyword2(M_keyword2));
}

// インポートボタン
const importButton = (
  (account.authority_lv == AUT_NUM_ADMIN) && // 権限が管理者の場合にボタンを表示
  <button className={`btn btn-sm btn-success ${styles.btnBlue_keyword}`} onClick={() =>{
    setIsContentOpen(true);
    dispatch(setModificationState(M_keyword1ModificationStatus.Create));
  }}>
    <span>取込</span>
    <i className="fas fa-file-import ml-1" title="インポート"></i>
  </button>
);

// エクスポートボタン
const exportButton = (
  <button className={`btn btn-sm btn-success ${styles.btnGreen_keyword}`}  onClick={() => excelDownloadButton()}>
    <span>排出</span>
    <i className="fas fa-file-export ml-1" title="エクスポート"></i>
  </button>
);

// 履歴ボタン
const historyButton = (
  (account.authority_lv == AUT_NUM_ADMIN) && // 権限が管理者の場合にボタンを表示
  <button className={`btn btn-sm btn-success ${styles.btnBlack_keyword}`} onClick={() => onM_keyword1History()}>
    <span>履歴</span>
    <i className="fas fa-history ml-1" title="履歴"></i>
  </button>
);


//ヘッダーボタン各種の表示箇所
const headerButtons = (
  <>
    <div className={styles.headerButtons}>
      {importButton}  {/* インポートボタン */}
      {exportButton}  {/* エクスポートボタン */}
      {historyButton} {/* 履歴ボタン */}                      
    </div>
  </>
);

//サーチバーの表示箇所
const searchBar = (
  <>
    { (account.authority_lv == AUT_NUM_ADMIN)?// 権限が管理者の場合だけ表示する
      <div className="input-group">
        <SearchBar
            setFindStr={setfindStr}
          setIsNeedFind={setisNeedFind}
        />                        
      </div>
    :""
    }
  </>
);

// テーブルの高さを管理するためのステート
const [TableHeight, setTableHeight] = useState('auto');

//テーブルの表示箇所
const tableContent = (
  <>
    <M_keyword2List onSelect={onM_keyword2Select}  height={TableHeight}/>
  </>
);

//タイトルの表示箇所
const title = (
  <>
    <h6 className="font-weight-bold text-green">キーワードマスタ 一覧({m_keyword1s.all_count}件)</h6>
  </>
);

const [CardFooterBottom, setCardFooterBottom] = useState(0);
const contentRef = createRef<HTMLDivElement>();

const getTotalHeight = (element: HTMLElement): number => {
  let totalHeight = element.clientHeight;
  element.childNodes.forEach(node => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const childElement = node as HTMLElement;
      totalHeight += getTotalHeight(childElement);
    }
  });
  return totalHeight;
};

const LineNumbers = () => {
  const lines = [];
  for (let i = 1; i <= 10; i++) {
    const style: React.CSSProperties = {
      position: 'absolute',
      top: i * 100,
      left: 0,
      width: '100%',
      height: 1,
      backgroundColor: 'black'
    };
    lines.push(
      <div key={`line-${i}`} style={style}>
        <span style={{ position: 'absolute', top: -10, left: 10 }}>{i * 100}</span>
      </div>
    );
  }
  return <div>{lines}</div>;
};

useEffect(() => {
  dispatch(updateCurrentPath("m_keyword1", "list"));
}, []);


//-------------------------------------------------------------
//レンダリング
//-------------------------------------------------------------
const CustomTableParentRef = useRef(null);
return (
    <Fragment>
        {/* <LineNumbers></LineNumbers> */}
      
      {/* CustomTableの起点となるDOM要素 */}
      {/* borderをtransparentで指定する事で、中のコンテンツを覆うエレメントが出来る。borderが無い場合、覆わなくなる(原因不明) */}
      <div style={{border:"1px solid transparent",position: "relative",height: "100%"}} ref={CustomTableParentRef}>

      {/* カード */}
      <div ref={contentRef}>
      <CustomTable 
        title={title} 
        searchBar={searchBar}
        headerButtons={headerButtons} 
        tableContent={tableContent} 
        setTableHeight={setTableHeight}
        setCardFooterBottom={setCardFooterBottom}
        ParentRef={CustomTableParentRef}
        ComponentPositionsID="m_keyword1"
        //ページネーション用
        SetCurrentPage={setCurrentPage}
        setnumberOfDisplaysPerpage={setnumberOfDisplaysPerpage}
        numberOfDisplaysPerpage={numberOfDisplaysPerpage} //1ページの表示件数
        dataCounts={m_keyword1s.all_count} //総件数数
        currentPage={MyCurrentPage} //現在の表示ページ
      />
      </div>


      {/* エクセル取込フォーム */}
      {((m_keyword1s.modificationState === M_keyword1ModificationStatus.Create)
        || (m_keyword1s.modificationState === M_keyword1ModificationStatus.Edit && m_keyword1s.M_keyword1s[0])) ?
        <div style={{position: "absolute", top: CardFooterBottom+20+"px",width:"calc(100% - 10px)",left:"5px"}}>
        <M_keyword1Form m_keyword1_count={m_keyword1_count}/>
        </div>
      :
        null
      }

      {/* 履歴 */}
      {(m_keyword1s.modificationState === M_keyword1ModificationStatus.History)?
        <div style={{position: "absolute", top: CardFooterBottom+20+"px",width:"calc(100% - 10px)",left:"5px"}}>
        <M_keyword1HistoryList /> 
        </div>
      : 
        null
      }

      </div>

    </Fragment >
  );
};

export default M_keyword1s;
