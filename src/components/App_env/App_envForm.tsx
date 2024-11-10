import React, { useState, FormEvent, Dispatch, Fragment,useEffect } from "react";
import { IStateType, IApp_envState,INotificationState } from "../../store/models/root.interface";
import { useSelector, useDispatch } from "react-redux";
import { IApp_env, App_envModificationStatus } from "../../store/models/app_env.interface";
import TextInput from "../../common/components/TextInput";
import TextArea from "../../common/components/TextArea";
import NumberInput from "../../common/components/NumberInput";
import { addNotification,removeNotification_pre } from "../../store/actions/notifications.action";
import Checkbox from "../../common/components/Checkbox";
import { OnChangeModel } from "../../non_common/types/Form.types";
import {API_URL,AUT_NUM_ADMIN,AUT_NUM_READ_ONLY,REMOVE_NOTIFICATION_SECONDS} from "../../common/constants";
import "./App_env.css";
import { IAccount } from "../../store/models/account.interface";
import { callApi } from "../../common/comUtil";

export type App_envFormProps = {
  FindApp_env:any
  historyButton:any
}
const App_envForm = (props:App_envFormProps) =>  {
  //useDispatchとuseSelectorでstate内のApp_envsを宣言し簡易的に割当
  const dispatch: Dispatch<any> = useDispatch();
  const App_envs: IApp_envState | null = useSelector((state: IStateType) => state.App_envs);
  const notifications: INotificationState | null = useSelector((state: IStateType) => state.notifications);
  const account: IAccount = useSelector((state: IStateType) => state.account);
  

  //letで再代入が可能な変数を宣言
  //パイプ記号(|)でユニオン型(何れかの型)を宣言
  //デフォルト値にApp_envs.selectedApp_envの値を設定
  let App_env: IApp_env | null = App_envs.App_env;

  //constで再代入NGの変数を宣言
  const isCreate: boolean = (App_envs.modificationState === App_envModificationStatus.Create);


  //nullでなく、新規作成の場合、各項目に初期値を設定
  if (!App_env || isCreate) {
    App_env = {
            modify_count:0,
            dir_parametersheet:"",
            dir_processingscenario:"",
            dir_processedscenario:"",
            dir_testdata:"",
            dir_retentionperiod:"",
            dir_generationmanagement:"",
            dir_web_screenshot:"",
            dir_tmp:"",
            path_webdriver_edge:"",
            path_webdriver_firefox:"",
            path_webdriver_chrome:"",
            path_binary_edge:"",
            path_binary_firefox:"",
            path_binary_chrome:"",
            dir_testdataabbreviation:"",
            dir_retentionperiodabbreviation:"",
            dir_tmpabbreviation:"",
            del_days_tmp:0,
            del_days_retentionperiod:0,
            del_days_generationmanagement:0,
            del_days_processedscenario:0,
            del_days_log:0,
            del_days_processhistory:0,
            del_days_historyrecord:0,
            del_days_web_screenshot:0,
            num_gm:0,
            timeout_m:0,
            log_cut:0,
            update_u_id:0,
            update_date:new Date,
            tc_svn_update:false,
           };
  }


  //フォーム変数に値を設定するuseStateを定義
  const [formState, setFormState] = useState({
    modify_count: { error: "", value: App_env.modify_count },
    dir_parametersheet: { error: "", value: App_env.dir_parametersheet },
    dir_processingscenario: { error: "", value: App_env.dir_processingscenario },
    dir_processedscenario: { error: "", value: App_env.dir_processedscenario },
    dir_testdata: { error: "", value: App_env.dir_testdata },
    dir_retentionperiod: { error: "", value: App_env.dir_retentionperiod },
    dir_generationmanagement: { error: "", value: App_env.dir_generationmanagement },
    dir_web_screenshot: { error: "", value: App_env.dir_web_screenshot },
    dir_tmp: { error: "", value: App_env.dir_tmp },
    path_webdriver_edge: { error: "", value: App_env.path_webdriver_edge },
    path_webdriver_firefox: { error: "", value: App_env.path_webdriver_firefox },
    path_webdriver_chrome: { error: "", value: App_env.path_webdriver_chrome },
    path_binary_edge: { error: "", value: App_env.path_binary_edge },
    path_binary_firefox: { error: "", value: App_env.path_binary_firefox },
    path_binary_chrome: { error: "", value: App_env.path_binary_chrome },
    dir_testdataabbreviation: { error: "", value: App_env.dir_testdataabbreviation },
    dir_retentionperiodabbreviation: { error: "", value: App_env.dir_retentionperiodabbreviation },
    dir_tmpabbreviation: { error: "", value: App_env.dir_tmpabbreviation },
    del_days_tmp: { error: "", value: App_env.del_days_tmp },
    del_days_retentionperiod: { error: "", value: App_env.del_days_retentionperiod },
    del_days_generationmanagement: { error: "", value: App_env.del_days_generationmanagement },
    del_days_processedscenario: { error: "", value: App_env.del_days_processedscenario },
    del_days_log: { error: "", value: App_env.del_days_log },
    del_days_processhistory: { error: "", value: App_env.del_days_processhistory },
    del_days_historyrecord: { error: "", value: App_env.del_days_historyrecord },
    del_days_web_screenshot: { error: "", value: App_env.del_days_web_screenshot },
    num_gm: { error: "", value: App_env.num_gm },
    timeout_m: { error: "", value: App_env.timeout_m },
    log_cut: { error: "", value: App_env.log_cut },
    update_u_id: { error: "", value: App_env.update_u_id },
    update_date: { error: "", value: App_env.update_date },
    tc_svn_update: { error: "", value: App_env.tc_svn_update },
  });

  //入力フォームの各項目に対するChangedイベント
  function hasFormValueChanged(model: OnChangeModel): void {
    //各フォーム変数に値やエラー値を格納する
    //...はスプレッド構文(配列の[]を外し分解した状態で渡す)を用い、変更が発生した箇所のstateだけ更新している
    setFormState({ ...formState, [model.field]: { error: model.error, value: model.value } });
  }

  //セレクトボックスの数値箇所だけを取り出す
  function ConvValueNum(str:String):number{
    if (str.indexOf(':') === -1){
      return Number(str);
    }else{
      var cut1 =str.substr(0, str.indexOf(':'));
      return Number(cut1);
    }
  }

  async function saveApp_env(e: FormEvent<HTMLFormElement>) {
    //デフォルトの動作では、現在のURLに対してフォームの送信を行うため、結果的にページがリロードされてしまう。それを防ぐための黒魔術。
    e.preventDefault();
    
    //入力チェックでNGの場合は何もしない
    if (isFormInvalid()) {
      return;
    }

    //変数へ記憶
    let post_App_env: IApp_env = {
      modify_count: formState.modify_count.value,
      dir_parametersheet: formState.dir_parametersheet.value,
      dir_processingscenario: formState.dir_processingscenario.value,
      dir_processedscenario: formState.dir_processedscenario.value,
      dir_testdata: formState.dir_testdata.value,
      dir_retentionperiod: formState.dir_retentionperiod.value,
      dir_generationmanagement: formState.dir_generationmanagement.value,
      dir_tmp: formState.dir_tmp.value,
      dir_web_screenshot: formState.dir_web_screenshot.value,
      path_webdriver_edge: formState.path_webdriver_edge.value,
      path_webdriver_firefox: formState.path_webdriver_firefox.value,
      path_webdriver_chrome: formState.path_webdriver_chrome.value,
      path_binary_edge: formState.path_binary_edge.value,
      path_binary_firefox: formState.path_binary_firefox.value,
      path_binary_chrome: formState.path_binary_chrome.value,
      dir_testdataabbreviation: formState.dir_testdataabbreviation.value,
      dir_retentionperiodabbreviation: formState.dir_retentionperiodabbreviation.value,
      dir_tmpabbreviation: formState.dir_tmpabbreviation.value,
      del_days_tmp: formState.del_days_tmp.value,
      del_days_retentionperiod: formState.del_days_retentionperiod.value,
      del_days_generationmanagement: formState.del_days_generationmanagement.value,
      del_days_processedscenario: formState.del_days_processedscenario.value,
      del_days_log: formState.del_days_log.value,
      del_days_processhistory: formState.del_days_processhistory.value,
      del_days_historyrecord: formState.del_days_historyrecord.value,
      del_days_web_screenshot: formState.del_days_web_screenshot.value,
      num_gm: formState.num_gm.value,
      timeout_m: formState.timeout_m.value,
      log_cut: formState.log_cut.value,
      update_u_id: formState.update_u_id.value,
      update_date: formState.update_date.value,
      tc_svn_update: formState.tc_svn_update.value,
    };
    //APIに登録を発行
    if (App_envs){
      const response = await callApi('app_env_update', post_App_env,'application/json');
      if (response){
        // 送信成功時の処理

        dispatch(addNotification("環境マスタ", "登録しました"));
        //10秒後に消す
        setTimeout(function(){if (notifications){dispatch(removeNotification_pre());}},REMOVE_NOTIFICATION_SECONDS);
  
        //親画面の検索をコール
        props.FindApp_env();
      }
    }

  }
  
    function getDisabledClass(): string {
      let isError: boolean = isFormInvalid();
      return isError ? "disabled" : "";
    }

    //入力チェック
    function isFormInvalid(): boolean {
      return (
           formState.modify_count.error
        || formState.dir_parametersheet.error
        || formState.dir_processingscenario.error
        || formState.dir_processedscenario.error
        || formState.dir_testdata.error
        || formState.dir_retentionperiod.error
        || formState.dir_generationmanagement.error
        || formState.dir_tmp.error
        || formState.dir_web_screenshot.error
        || formState.path_webdriver_edge.error
        || formState.path_webdriver_firefox.error
        || formState.path_webdriver_chrome.error
        || formState.path_binary_edge.error
        || formState.path_binary_firefox.error
        || formState.path_binary_chrome.error
        || formState.dir_testdataabbreviation.error
        || formState.dir_retentionperiodabbreviation.error
        || formState.dir_tmpabbreviation.error
        || formState.del_days_tmp.error
        || formState.del_days_retentionperiod.error
        || formState.del_days_generationmanagement.error
        || formState.del_days_processedscenario.error
        || formState.del_days_log.error
        || formState.del_days_processhistory.error
        || formState.del_days_historyrecord.error
        || formState.del_days_web_screenshot.error
        || formState.num_gm.error
        || formState.timeout_m.error
        || formState.log_cut.error
        || formState.update_u_id.error
        || formState.update_date.error
        || formState.tc_svn_update.error
      ) as unknown as boolean;
  }

  function makeTextArea(label:string,value:string,id:string) :JSX.Element {
    return(
      <TextArea
        id={id}
        field = {id}
        value={value}
        onChange={hasFormValueChanged}
        required={false}
        maxLength={300}
        label={label}
        rows = {1}
        cols = {120}
        placeholder={id}
        disabled={account.authority_lv != AUT_NUM_ADMIN}//参照専用の場合は編集不可
      />
    )
  }
  
  function makeTextInput(label:string,value:string,id:string,maxLength:number) :JSX.Element {
    return(
      <TextInput id={id}
        value={value}
        field={id}
        onChange={hasFormValueChanged}
        required={false}
        maxLength={maxLength}
        label={label}
        placeholder={id}
        disabled={account.authority_lv != AUT_NUM_ADMIN}//参照専用の場合は編集不可
      />
    )
  }

  function makeNumberInput(label:string,value:number,id:string) :JSX.Element {
    return(
      <div style={{ display: 'flex', alignItems: 'center'}}>
        <div style={{ flexBasis: '30%', textAlign: 'left' }}>
          <label htmlFor={id}>{label}</label>
        </div>
        <div style={{ flexBasis: '30%' }}>
          <NumberInput
            id={id}
            field={id}
            value={value}
            onChange={hasFormValueChanged}
            disabled={account.authority_lv != AUT_NUM_ADMIN} //参照専用の場合は編集不可
          />
        </div>
    </div>                
    )
  }

  //------------------------------------------------------------------
  //DB取得データの画面反映
  //------------------------------------------------------------------
  // FormField型は、オブジェクトの各キーに対応する値とエラーメッセージを持つオブジェクトです。
  type FormField<T> = {
    [key in keyof T]: { error: string; value: T[key] };
  };
  // IApp_env型を、formstate型に変換
  const transformApp_env = (App_env: IApp_env): FormField<IApp_env> => {
    const result: any = {};
    // App_envオブジェクトの各キーに対してループ処理
    for (const key of Object.keys(App_env) as (keyof IApp_env)[]) {
      // resultオブジェクトに、エラーメッセージと値を持つオブジェクトを追加
      result[key] = { error: "", value: App_env[key] };
    }
    // 変換されたresultオブジェクトを返す
    return result;
  };
  //App_envs.App_envをformStateに反映
  useEffect(() => {
    if (App_envs.App_env) {
      setFormState(transformApp_env(App_envs.App_env));
    }
  }, [App_envs.App_env]); 

  return (
    <Fragment>
      <div className="col-xl-7 col-lg-7">
        <div className="card shadow mb-4">
          <div className="card-header py-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h6 id="App_env_form_header" className="m-0 font-weight-bold text-green">環境マスタ {(isCreate ? "新規登録" : "更新[更新回数:"+formState.modify_count.value)+"]"}</h6>
            {props.historyButton}
          </div>
          <div className="card-body">
            <form onSubmit={saveApp_env} id="App_env_form">

              <div className="form-group" style={{width:"100%"}}>

                {makeTextArea("DIR_パラメータシート",formState.dir_parametersheet.value,"dir_parametersheet")}
                {makeTextArea("DIR_処理シナリオ",formState.dir_processingscenario.value,"dir_processingscenario")}
                {makeTextArea("DIR_処理済シナリオ",formState.dir_processedscenario.value,"dir_processedscenario")}
                {makeTextArea("DIR_テストデータ",formState.dir_testdata.value,"dir_testdata")}
                {makeTextArea("DIR_一定期間保存",formState.dir_retentionperiod.value,"dir_retentionperiod")}
                {makeTextArea("DIR_世代管理",formState.dir_generationmanagement.value,"dir_generationmanagement")}
                {makeTextArea("DIR_WEBスクリーンショット",formState.dir_web_screenshot.value,"dir_web_screenshot")}
                {makeTextArea("DIR_TMP",formState.dir_tmp.value,"dir_tmp")}

                {makeTextArea("PATH_WebDriver(edge)",formState.path_webdriver_edge.value,"path_webdriver_edge")}
                {makeTextArea("PATH_WebDriver(firefox)",formState.path_webdriver_firefox.value,"path_webdriver_firefox")}
                {makeTextArea("PATH_WebDriver(chrome)",formState.path_webdriver_chrome.value,"path_webdriver_chrome")}
                {makeTextArea("ブラウザのバイナリパス(edge)",formState.path_binary_edge.value,"path_binary_edge")}
                {makeTextArea("ブラウザのバイナリパス(firefox)",formState.path_binary_firefox.value,"path_binary_firefox")}
                {makeTextArea("ブラウザのバイナリパス(chrome)",formState.path_binary_chrome.value,"path_binary_chrome")}

                <br /> 
                <hr /> 
                
                {makeTextInput("DIR_テストデータ略称",formState.dir_testdataabbreviation.value,"dir_testdataabbreviation",10)}
                {makeTextInput("DIR_一定期間保存略称",formState.dir_retentionperiodabbreviation.value,"dir_retentionperiodabbreviation",10)}
                {makeTextInput("DIR_TMP略称",formState.dir_tmpabbreviation.value,"dir_tmpabbreviation",10)}

                <br /> 
                <hr /> 
                {makeNumberInput("[経過日数]tmpフォルダ削除",formState.del_days_tmp.value,"del_days_tmp")}
                {makeNumberInput("[経過日数]一定期間保存",formState.del_days_retentionperiod.value,"del_days_retentionperiod")}
                {makeNumberInput("[経過日数]世代管理",formState.del_days_generationmanagement.value,"del_days_generationmanagement")}
                {makeNumberInput("[経過日数]処理済シナリオ",formState.del_days_processedscenario.value,"del_days_processedscenario")}
                {makeNumberInput("[経過日数]ログ",formState.del_days_log.value,"del_days_log")}
                {makeNumberInput("[経過日数]処理履歴",formState.del_days_processhistory.value,"del_days_processhistory")}
                {makeNumberInput("[経過日数]履歴レコード",formState.del_days_historyrecord.value,"del_days_historyrecord")}
                {makeNumberInput("[経過日数]WEBスクショ",formState.del_days_web_screenshot.value,"del_days_web_screenshot")}

                {makeNumberInput("世代管理数",formState.num_gm.value,"num_gm")}
                {makeNumberInput("タイムアウト分数",formState.timeout_m.value,"timeout_m")}
                {makeNumberInput("ログ打ち切り行数",formState.log_cut.value,"log_cut")}

                <hr /> 
                <Checkbox
                  id="input_tc_svn_update"
                  field="tc_svn_update"
                  value={formState.tc_svn_update.value}
                  label="自動SVN更新"
                  onChange={hasFormValueChanged}
                  disabled={account.authority_lv != AUT_NUM_ADMIN}//参照専用の場合は編集不可
                />
                <hr /> 
                <br /> 
              </div>

              {account.authority_lv != AUT_NUM_ADMIN? null:
                // アドミン権限の場合だけ登録ボタンが押せる
                <button type="submit" className={`btn btn-success left-margin ${getDisabledClass()}` }  >登録</button>  
              }
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  )
};

export default App_envForm;
