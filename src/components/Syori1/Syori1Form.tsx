import React, { useState, FormEvent, Dispatch, Fragment, useEffect } from "react";
import { IStateType, ISyori1State,INotificationState } from "../../store/models/root.interface";
import { useSelector, useDispatch } from "react-redux";
import { Syori1ModificationStatus,Syori1 } from "../../store/models/syori1.interface";
import TextInput from "../../common/components/TextInput";
import TextArea from "../../common/components/TextArea";
import { editSyori1, clearSelectedSyori1, setModificationState, addSyori1 } from "../../store/actions/syori1.action";
import { addNotification,removeNotification_pre } from "../../store/actions/notifications.action";
import Checkbox from "../../common/components/Checkbox";
import { OnChangeModel  } from "../../non_common/types/Form.types";
import {AUT_NUM_READ_ONLY,REMOVE_NOTIFICATION_SECONDS} from "../../common/constants";
import Swal from 'sweetalert2';
import styles from "./Syori1Form.module.css";
import { IAccount } from "../../store/models/account.interface";
import * as comUtil  from "../../common/comUtil";
import ExcelDropzone from "../../common/components/ExcelDropzone";
import Load_s_excel from "./Load_s_excel";
import LoadingIndicator from "common/components/LoadingIndicator";
import Modal from 'react-modal';
import SchedulerList from "common/components/SchedulerList";

Modal.setAppElement('#root');

const Syori1Form: React.FC = () => {
  //useDispatchとuseSelectorでstate内のsyori1sを宣言し簡易的に割当
  const dispatch: Dispatch<any> = useDispatch();
  const syori1s: ISyori1State | null = useSelector((state: IStateType) => state.syori1s);
  const notifications: INotificationState | null = useSelector((state: IStateType) => state.notifications);
  const account: IAccount = useSelector((state: IStateType) => state.account);
    
  //constで再代入NGの変数を宣言
  const isCreate: boolean = (syori1s.modificationState === Syori1ModificationStatus.Create);

  //ローディングの状態管理用
  const [isLoading, setIsLoading] = useState<boolean>(false);

  //デフォルト値にsyori1s.selectedSyori1の値を設定
  const [syori1, setSyori1] = useState(
    (!syori1s.selectedSyori1 || isCreate) ? new Syori1() : syori1s.selectedSyori1
  );
  
  //フォーム変数に値を設定するuseStateを定義
  type FormStateType = Record<string, { error: string, value: any }>;
  const [formState, setFormState] = useState<FormStateType>(
    Object.fromEntries(Object.entries(syori1).map(([key, value]) => [key, { error: "", value }]))
  );

  //入力フォームの各項目に対するChangedイベント
  function hasFormValueChanged(model: OnChangeModel): void {
    //各フォーム変数に値やエラー値を格納する
    //...はスプレッド構文(配列の[]を外し分解した状態で渡す)を用い、変更が発生した箇所のstateだけ更新している
    setFormState({ ...formState, [model.field]: { error: model.error, value: model.value } });
  }
  function run_timingOnChanged(value:string): void {
    setFormState({...formState,run_timing: { error: "", value: value } });
  }

  async function saveSyori1(e: FormEvent<HTMLFormElement>) {
  // async function saveSyori1() {
    //https://qiita.com/yokoto/items/27c56ebc4b818167ef9e
    //event.preventDefaultメソッドは、submitイベントの発生元であるフォームが持つデフォルトの動作をキャンセルするメソッド
    //デフォルトの動作では、現在のURLに対してフォームの送信を行うため、結果的にページがリロードされてしまう。それを防ぐための黒魔術。
    e.preventDefault();
    
    //入力チェックでNGの場合は何もしない
    if (isFormInvalid()) {
      return;
    }

    //変数へ記憶
    let post_syori1 = syori1? syori1 : new Syori1;
    post_syori1.s1_id = formState.s1_id.value;
    post_syori1.s1_name = formState.s1_name.value;
    post_syori1.s_excel_filename = formState.s_excel_filename.value;
    post_syori1.delflg = formState.delflg.value;
    post_syori1.run_timing = formState.run_timing.value;

    //APIに登録を発行
    if (syori1s){

      const formData = new FormData();
      formData.append('s_excel',  post_syori1.s_excel);
      
      //「post_syori1」1階層だけ送るパターンの名残
      // formData.append('syori1', new Blob([JSON.stringify(post_syori1)], {type : 'application/json'}))

      //syori2s」を含めた2階層だけ送るパターンの名残
      //syori2sフィールドに含まれるオブジェクトを配列に変換し、新しいオブジェクトに追加
      //let syori1WithSyori2s = { ...post_syori1, syori2s: Object.values(post_syori1.syori2s) };

      //syori2sと、syori3sフィールドに含まれるオブジェクトを配列に変換し、新しいオブジェクトに追加(ChatGPT作)
      const syori1WithSyori2sAndSyori3s = {
        ...post_syori1,
        syori2s: Object.values(post_syori1.syori2s).map((syori2) => ({
          ...syori2,
          syori3s: Object.values(syori2.syori3s)
        }))
      };
      formData.append('syori1', new Blob([JSON.stringify(syori1WithSyori2sAndSyori3s)], {type: 'application/json'}));

      const url =  isCreate? 'syori1_create': 'syori1_update';
      //API発行
      const response = await comUtil.callApi(url, formData,'multipart/form-dat');
      if (response){
        //登録で自動採番された番号を取得する
        syori1.s1_id = Number(response.data.s1_id);
        syori1.modify_count = Number(response.data.modify_count);

        //登録・更新処理に応じ「IAddServerActionType」型の関数を準備
        let saveFn: Function = (isCreate) ? addSyori1 : editSyori1;
        //stateへの反映
        saveForm(saveFn);
      }
    }

  }
  
  function saveForm(saveFn: Function): void {

    if (syori1) {
      dispatch(saveFn({...syori1}));

      dispatch(addNotification("処理設定_親", `【${syori1.s1_id}】登録しました`));
      //10秒後に消す
      setTimeout(function(){if (notifications){dispatch(removeNotification_pre());}},REMOVE_NOTIFICATION_SECONDS);


      dispatch(clearSelectedSyori1());
      dispatch(setModificationState(Syori1ModificationStatus.None));
    }
  }

  function cancelForm(): void {
    dispatch(setModificationState(Syori1ModificationStatus.None));
  }

  //入力チェック
  function isFormInvalid(): boolean {
    return (
          formState.s1_id.error 
      || formState.s1_name.error
      || formState.s_excel_filename.error
      || formState.delflg.error
    ) as unknown as boolean;
  }

  function ErrorMSG(msg: string) {
    Swal.fire({
      title: 'Error!',
      text: msg,
      icon: 'error',
      confirmButtonText: 'OK'
    })
  }

  const handleExcelDrop = async (blob: Blob, filename: any) => {
    // アップロードされたファイルを処理する
    syori1.s_excel_filename = filename;
    syori1.s_excel = blob as File;

    setIsLoading(true)
    try{
      await Load_s_excel(blob, syori1, isCreate,setSyori1, setFormState,setIsLoading);
    }
    catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error as string,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setIsLoading(false);
    }
  };  

  useEffect(() => {
    
    let syori1Tmp: Syori1;;
    if (!syori1s.selectedSyori1 || isCreate) {
      syori1Tmp = new Syori1();
    } else {
      syori1Tmp = syori1s.selectedSyori1;
    }
    setSyori1(syori1Tmp);
    setFormState(prevState=> ({ ...prevState, s1_id: { ...prevState.s1_id, value: syori1Tmp.s1_id } }));          
    setFormState(prevState=> ({ ...prevState, s1_name: { ...prevState.s1_name, value: syori1Tmp.s1_name } }));          
    setFormState(prevState=> ({ ...prevState, s_excel_filename: { ...prevState.s_excel_filename, value: syori1Tmp.s_excel_filename } }));          
    setFormState(prevState=> ({ ...prevState, delflg: { ...prevState.delflg, value: syori1Tmp.delflg } }));          

  }, [syori1s.selectedSyori1,syori1s.modificationState]);

  return (
    <Fragment>
      <div className="col-xl-7 col-lg-7">
        <div className="card shadow mb-4">
          <form onSubmit={saveSyori1} id="syori1_form">
            <div className="card-header py-3">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h6 id="syori1_form_header" className="m-0 font-weight-bold text-green" style={{ alignSelf: 'flex-start' }}>
                  処理設定 {(isCreate ? "新規登録" : "更新[処理No_1:"+formState.s1_id.value)+"]"}
                </h6>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <button type="submit" className="btn btn-danger">
                    登録
                  </button>
                  <button type="submit" className={`btn btn-success ml-2 ${styles.btnBlack}`} id="commit_btn" onClick={() => cancelForm()}>
                    ×
                  </button>
                </div>
              </div>
            </div>
            <div className="card-body">

              <div className="form-row">
                <div className="form-group col-md-6">
                  <TextInput id="s1_name"
                    value={formState.s1_name.value}
                    field="s1_name"
                    onChange={hasFormValueChanged}
                    required={false}
                    maxLength={100}
                    label="処理名称"
                    placeholder="s1_name"
                    disabled={account.authority_lv == AUT_NUM_READ_ONLY}//参照専用の場合は編集不可
                  />
                </div>
                <div className="form-group col-md-6 ">
                  <br /> 
                  <br /> 
                  <div className="delflg">
                    <Checkbox
                      id="delflg"
                      field="delflg"
                      value={formState.delflg.value}
                      label="削除"
                      onChange={hasFormValueChanged}
                      disabled={account.authority_lv == AUT_NUM_READ_ONLY}//参照専用の場合は編集不可
                      />
                  </div>
                </div>

              </div>

              <ExcelDropzone
                label="シナリオエクセル"
                id="s_excel"
                onDrop={handleExcelDrop}
              />

              <div className="form-row">
                <div className="form-group">
                  <TextArea
                    id="input_s_excel_filename"
                    field = "s_excel_filename"
                    value={formState.s_excel_filename.value}
                    onChange={hasFormValueChanged}
                    required={false}
                    maxLength={200}
                    label="シナリオファイル名"
                    rows = {4}
                    placeholder="s_excel_filename"
                    disabled={account.authority_lv == AUT_NUM_READ_ONLY}//参照専用の場合は編集不可
                  />
                </div>
              </div>

              <SchedulerList schedulers={formState.run_timing.value} onChange={run_timingOnChanged}/>

              {isLoading && <LoadingIndicator />}

            </div>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default Syori1Form;
