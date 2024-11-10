import React, { Fragment, Dispatch, useState, useEffect, useRef, createRef} from "react";
import { ISyori1,Syori1ModificationStatus,Syori1} from "../../store/models/syori1.interface";
import { useDispatch, useSelector } from "react-redux";
import { IStateType,ISyori1State,INotificationState } from "../../store/models/root.interface";
import { ClearSyori1,addSyori1, editSyori1,setModificationState,changeSelectedSyori1, removeSyori1, 
  clearSelectedSyori1,setAllCount,
  ClearSyori1history,addSyori1History, changeSelectedSyori1_s1_id} from "../../store/actions/syori1.action";
 import { updateCurrentPath } from "../../store/actions/root.actions";
import Syori1Form from "./Syori1Form";
import Syori1List from "./Syori1List";
import Syori1HistoryList from "./Syori1HistoryList";
import {AUT_NUM_ADMIN,AUT_NUM_READ_ONLY,REMOVE_NOTIFICATION_SECONDS} from "../../common/constants";
import { addNotification,removeNotification_pre } from "../../store/actions/notifications.action";
import Swal from 'sweetalert2';
import { IAccount } from "../../store/models/account.interface";
import { callApi } from "../../common/comUtil";
import SearchBar from "../../common/components/SearchBar";
import styles from "./Syori1.module.css";
import CustomTable from "common/components/CustomTableProps ";
import Scheduler from "common/components/Scheduler";

export type syori1sProps = {
  children?: React.ReactNode;
};

function Syori1s(props: syori1sProps): JSX.Element  {
  const dispatch: Dispatch<any> = useDispatch();
  const syori1s: ISyori1State = useSelector((state: IStateType) => state.syori1s);
  const account: IAccount = useSelector((state: IStateType) => state.account);
  const notifications: INotificationState | null = useSelector((state: IStateType) => state.notifications);
  
  //ページネーション用
  const [CurrentPage, setCurrentPage] = useState(0);
  const [numberOfDisplaysPerpage, setnumberOfDisplaysPerpage] = useState(0);

  //これらstateの初期化はページが遷移する度に行われる
  const [findStr, setfindStr] = useState("");
  const [isDelDataShow, setisDelDataShow] = useState(false);
  const [isNeedFind, setisNeedFind] = useState(true);
  const [MyCurrentPage, setMyCurrentPage] = useState(0);
  const [MynumberOfDisplaysPerpage, setMynumberOfDisplaysPerpage] = useState(100);
  const [CardFooterBottom, setCardFooterBottom] = useState(0);
  const contentRef = createRef<HTMLDivElement>();
    //フォーム表示用
  const [isContentOpen, setIsContentOpen] = useState(false);
  //履歴表示用
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  function onSyori1Select(Syori1: ISyori1): void {
    dispatch(changeSelectedSyori1(Syori1));
    dispatch(setModificationState(Syori1ModificationStatus.None));
    setIsContentOpen(false);
  }

  const isDelDataShowHint = () => {
    Swal.fire({
      title: '「削除」スイッチについて',
      text: "ONにする事で削除済データも表示します。",
      icon: 'info',
      confirmButtonText: 'OK'
    })
  }

  async function Syori1Remove() {
    const formData = new FormData();
    const post_syori1 = syori1s.selectedSyori1;
    if (!post_syori1) return;
    const syori1WithSyori2sAndSyori3s = {
      ...post_syori1,
      syori2s: Object.values(post_syori1.syori2s).map((syori2) => ({
        ...syori2,
        syori3s: Object.values(syori2.syori3s)
      }))
    };
    formData.append('syori1', new Blob([JSON.stringify(syori1WithSyori2sAndSyori3s)], {type: 'application/json'}));

    //API発行
    const response = await callApi('syori1_delete', formData,'multipart/form-dat');
    if (response){
      //お知らせを出す
      if(syori1s.selectedSyori1) {
        let msg = syori1s.selectedSyori1.delflg ? 'の削除を取り消しました' : 'を削除しました';

        dispatch(addNotification("処理設定_親 削除", `【処理No_1=${syori1s.selectedSyori1.s1_id}】 `+msg));
        //10秒後に消す
        setTimeout(function(){if (notifications){dispatch(removeNotification_pre());}},REMOVE_NOTIFICATION_SECONDS);

        //反転した後、削除になる場合、表示対象から除外する
        if (!syori1s.selectedSyori1.delflg　&& !isDelDataShow){
          dispatch(removeSyori1(syori1s.selectedSyori1.s1_id));
        }

        //登録後の各値をリデュースへ反映
        syori1s.selectedSyori1.delflg = !syori1s.selectedSyori1.delflg;
        syori1s.selectedSyori1.modify_count = response.data.modify_count;
        for (const key2 of Object.keys(syori1s.selectedSyori1.syori2s)) {
          const syori2 = syori1s.selectedSyori1.syori2s[Number(key2)];
          syori2.modify_count = response.data.modify_count;
          for (const key3 of Object.keys(syori2.syori3s).map(Number)) {
            const syori3 = syori2.syori3s[key3];
            syori3.modify_count = response.data.modify_count;
          }
        }
                dispatch(editSyori1(syori1s.selectedSyori1));

      }
      dispatch(clearSelectedSyori1());

    }
  }

  function onSyori1Remove() {
    if(syori1s.selectedSyori1) {
      let msg = syori1s.selectedSyori1.delflg ? '削除を取り消しますか？' : '削除しますか？';
      Swal.fire({
        title: msg,
        icon: 'warning',
        showDenyButton: true,
        confirmButtonText: 'はい',
        denyButtonText: 'いいえ',
      }).then((result) => {
        if (result.isConfirmed) {
          // 削除処理
          Syori1Remove();
        } else if (result.isDenied) {
          Swal.fire('削除を取り消しました', '', 'info')
        }
      })  
    }
  }

  //検索(ページネーション)
  async function FindSyori1() {
    const data = { limit: numberOfDisplaysPerpage,
                  offset: (CurrentPage-1)*numberOfDisplaysPerpage,
                  findstr:findStr,
                  isDelDataShow:isDelDataShow
                 };
    
    //全データを初期化
    dispatch(ClearSyori1());
    //API発行             
    const response = await callApi('syori1_find', data,'application/x-www-form-urlencoded');//「application/x-www-form-urlencoded」はURLエンコードした平文での送信
    if (response){
      const syori1_array: ISyori1[] = JSON.parse(response.data.data);
      if (syori1_array){
        //map関数は、指定したコールバック関数を配列の要素数分繰り返す(valueは引数であり、配列の各要素が入ってくる)
        //配列の要素数だけaddAdminする
        syori1_array.map((value: ISyori1) => {
          //mapするだけでは、シグネチャ型(syori2)がundefinedになってしまうので、インスタンスを作成し、中身をアサインする
          const syori1 = new Syori1();
          Object.assign(syori1, value);
          dispatch(addSyori1(syori1));
        });
      }
    }
  }

  async function onSyori1History() {
    if(syori1s.selectedSyori1) {
      await FindSyori1History(syori1s.selectedSyori1.s1_id);
      setIsHistoryOpen(true);
      dispatch(setModificationState(Syori1ModificationStatus.History));
    }
  }

  async function FindSyori1History(s1_id:number) {
    const data = {s1_id: s1_id};
    //API発行
    const response = await callApi('syori1_history_find', data,'application/x-www-form-urlencoded');
    if (response){
      //全履歴を初期化
      dispatch(ClearSyori1history());

      const syori1_array: ISyori1[] = JSON.parse(response.data.data);

      //map関数は、指定したコールバック関数を配列の要素数分繰り返す(valueは引数であり、配列の各要素が入ってくる)
      //ここでは、配列の要素数だけaddしている
      if (syori1_array){
        syori1_array.map(value => (dispatch(addSyori1History(value))));
      }
    }
  }


  //件数検索
  async function syori1_count() {
    const data = {findstr: findStr,isDelDataShow:isDelDataShow};
    //API発行
    const response = await callApi('syori1_count', data,'application/x-www-form-urlencoded');
    if (response){
      //Ractのjson形式に変換(JavaのJsonが届くので)
      const str = JSON.stringify(response.data);
      const data = JSON.parse(str);
      dispatch(setAllCount(data.all_count));
      FindSyori1();
    }
  }

  useEffect(() => {
    dispatch(updateCurrentPath("syori1", "list"));

    //一覧検索
    if (isNeedFind || MyCurrentPage !=CurrentPage || MynumberOfDisplaysPerpage != numberOfDisplaysPerpage){
      syori1_count();
      setisNeedFind(false);
      setMyCurrentPage(CurrentPage);
      setMynumberOfDisplaysPerpage(numberOfDisplaysPerpage);

      //処理履歴から処理設定がコールされた場合、編集画面を表示する
      if (syori1s.selectedSyori1_s1_id && syori1s.selectedSyori1_s1_id != 0){
        const targetSyori1 = syori1s.Syori1s.find((syori1) => syori1.s1_id === syori1s.selectedSyori1_s1_id);
        if (targetSyori1){
          dispatch(changeSelectedSyori1(targetSyori1));
          dispatch(setModificationState(Syori1ModificationStatus.Edit));
          setIsContentOpen(true);
          dispatch(changeSelectedSyori1_s1_id(0));
        }
      }
  
    }

    //入力フォームの表示位置までスクロールする
    //https://blog.usize-tech.com/vertical-scroll-by-react/
    if (isContentOpen) {
      const checkElement = () => {
        const headerElement = document.getElementById("syori1_form_header");
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
      if (document.getElementById("syori1_history_header")){
        document.getElementById("syori1_history_header")!.scrollIntoView({behavior:"smooth",block:"center"});
        setIsHistoryOpen(false);
      }

    };
}, [isContentOpen,numberOfDisplaysPerpage,isDelDataShow,isHistoryOpen,CurrentPage,isNeedFind]);

// 追加ボタン
const addButton = (
  (account.authority_lv != AUT_NUM_READ_ONLY) && // 参照専用ではない場合にボタンを表示
  <button className={`btn btn-sm btn-success ${styles.btnGreenSyori1}`} id="add_button" onClick={() => {
    setIsContentOpen(true);
    dispatch(setModificationState(Syori1ModificationStatus.Create));
  }}>
    <span style={{ fontSize: '14px'}}>追加</span>
    <i className="fas fa fa-plus" title="追加"></i>
  </button>
);

// 変更ボタン
const editButton = (
  (account.authority_lv != AUT_NUM_READ_ONLY)? // 参照専用ではない場合にボタンを表示
  <button className={`btn btn-sm btn-success ${styles.btnBlueSyori1}`} id="edit_button" onClick={() => {
    setIsContentOpen(true);
    dispatch(setModificationState(Syori1ModificationStatus.Edit));
  }}>
    <span style={{ fontSize: '14px'}}>変更</span>
    <i className="fas fa fa-edit" title="変更"></i>
  </button>
  :null
);

// 削除ボタン
const deleteButton = (
  (account.authority_lv != AUT_NUM_READ_ONLY) && // 参照専用ではない場合にボタンを表示
  <button className={`btn btn-sm btn-success ${styles.btnRedSyori1}`} id="del_button" onClick={() => onSyori1Remove()}>
    <span style={{ fontSize: '14px'}}>削除</span>
    <i className="fas fa fa-minus" title="削除"></i>
  </button>
);

// 履歴ボタン
const historyButton = (
  (account.authority_lv != AUT_NUM_READ_ONLY) && // 参照専用ではない場合にボタンを表示
  <button className={`btn btn-sm btn-success ${styles.btnBlackSyori1}`} id="history_button" onClick={() => onSyori1History()}>
    <span style={{ fontSize: '14px'}}>履歴</span>
    <i className="fas fa-history" title="履歴"></i>
  </button>
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

//ヘッダーボタン各種の表示箇所
const headerButtons = (
  <>
    <div className={styles.headerButtons}>
    {/* <div className="header-buttons" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', top: '-13px' }}> */}
      {addButton}     {/* 追加ボタン */}
      {editButton}    {/* 変更ボタン */}
      {deleteButton}  {/* 削除ボタン */}
      {historyButton} {/* 履歴ボタン */}                      
    </div>
  </>
);

// テーブルの高さを管理するためのステート
const [TableHeight, setTableHeight] = useState('auto');
//テーブルの表示箇所
const tableContent = (
  <>
    <Syori1List onSelect={onSyori1Select} height={TableHeight}/>
  </>
);

//タイトルの表示箇所
const title = (
  <>
    <h6 className="font-weight-bold text-green">処理設定 一覧({syori1s.all_count}件)</h6>
  </>
);

//削除表示用チェックボックス
const delDataShowCkeckboxContent = (
  <>
    <div className="form-check form-switch">
    {isDelDataShow ? 
      <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault" checked onClick={() => {setisNeedFind(true); setisDelDataShow(false)}}/>
    :<input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault" onClick={() => {setisNeedFind(true); setisDelDataShow(true)}} /> 
    }
      <label className="form-check-label" >削除</label>
      <i className={`fa fa-question-circle ${styles.isDelDataShowHint}`} onClick={isDelDataShowHint}></i>
    </div>
    
  </>
);


const closeSchedulerModal = () => {
};
const saveScheduler = (newLabel: string) => {
}

//-------------------------------------------------------------
//レンダリング
//-------------------------------------------------------------
const CustomTableParentRef = useRef(null);
return (
  <Fragment>
    
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
        delDataShowCkeckboxContent={delDataShowCkeckboxContent}
        ComponentPositionsID="syori1"
        //ページネーション用
        SetCurrentPage={setCurrentPage}
        setnumberOfDisplaysPerpage={setnumberOfDisplaysPerpage}
        numberOfDisplaysPerpage={numberOfDisplaysPerpage} //1ページの表示件数
        dataCounts={syori1s.all_count} //総件数数
        currentPage={MyCurrentPage} //現在の表示ページ
      />
      </div>

      {/* 入力フォーム */}
      {((syori1s.modificationState === Syori1ModificationStatus.Create)
        || (syori1s.modificationState === Syori1ModificationStatus.Edit && syori1s.selectedSyori1)) ?
        <div style={{position: "absolute", top: CardFooterBottom+20+"px",width:"calc(100% - 10px)",left:"5px"}}>
          <Syori1Form />
        </div>
      : 
        null
      }

      {/* 履歴 */}
      {(syori1s.modificationState === Syori1ModificationStatus.History)?
        <div style={{position: "absolute", top: CardFooterBottom+20+"px",width:"calc(100% - 10px)",left:"5px"}}>
        <Syori1HistoryList /> 
        </div>
      : 
        null
      }

    </div>
  </Fragment >
  );
};

export default Syori1s;
