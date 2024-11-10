import React, { useState, FormEvent, Dispatch, Fragment, useCallback, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload,faFileAlt, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { IStateType, IM_keyword1State,INotificationState } from "../../store/models/root.interface";
import { useSelector, useDispatch } from "react-redux";
import { M_keyword1, M_keyword1ModificationStatus } from "../../store/models/m_keyword1.interface";
import TextArea from "../../common/components/TextArea";
import { editM_keyword1, clearSelectedM_keyword1, setModificationState, addM_keyword1 } from "../../store/actions/m_keyword1.action";
import { addNotification,removeNotification_pre } from "../../store/actions/notifications.action";
import { OnChangeModel } from "../../non_common/types/Form.types";
import {AUT_NUM_READ_ONLY,REMOVE_NOTIFICATION_SECONDS} from "../../common/constants";
import Swal from 'sweetalert2';
import { IAccount } from "../../store/models/account.interface";
import * as xlsx from 'xlsx';
import * as xlsxUtil  from "../../common/xlsxUtil";
import { IM_keyword2, M_keyword2 } from "../../store/models/m_keyword2.interface";
import * as comUtil  from "../../common/comUtil";

export type M_keyword1FormProps = {
  m_keyword1_count:any;
};

const M_keyword1Form = (props:M_keyword1FormProps) => {
  //useDispatchとuseSelectorでstate内のm_keyword1sを宣言し簡易的に割当
  const dispatch: Dispatch<any> = useDispatch();
  const m_keyword1s: IM_keyword1State | null = useSelector((state: IStateType) => state.m_keyword1s);
  const notifications: INotificationState | null = useSelector((state: IStateType) => state.notifications);
  const account: IAccount = useSelector((state: IStateType) => state.account);

  //constで再代入NGの変数を宣言
  const isCreate: boolean = !m_keyword1s.M_keyword1s[0]?true:false;

  //letで再代入が可能な変数を宣言
  //パイプ記号(|)でユニオン型(何れかの型)を宣言
  //デフォルト値にm_keyword1s.selectedM_keyword1の値を設定
  const [m_keyword1, setM_keyword1] = useState(
    (!m_keyword1s.M_keyword1s[0] || isCreate) ? new M_keyword1() : m_keyword1s.M_keyword1s[0]
  );

  //フォーム変数に値を設定するuseStateを定義
  type FormStateType = Record<string, { error: string, value: any }>;
  const [formState, setFormState] = useState<FormStateType>(
    Object.fromEntries(Object.entries(m_keyword1).map(([key, value]) => [key, { error: "", value }]))
  );

  //入力フォームの各項目に対するChangedイベント
  function hasFormValueChanged(model: OnChangeModel): void {
    //各フォーム変数に値やエラー値を格納する
    //...はスプレッド構文(配列の[]を外し分解した状態で渡す)を用い、変更が発生した箇所のstateだけ更新している
    setFormState({ ...formState, [model.field]: { error: model.error, value: model.value } });
  }

  async function saveM_keyword1(e: FormEvent<HTMLFormElement>) {
  // async function saveM_keyword1() {
    //https://qiita.com/yokoto/items/27c56ebc4b818167ef9e
    //event.preventDefaultメソッドは、submitイベントの発生元であるフォームが持つデフォルトの動作をキャンセルするメソッド
    //デフォルトの動作では、現在のURLに対してフォームの送信を行うため、結果的にページがリロードされてしまう。それを防ぐための黒魔術。
    e.preventDefault();
    
    //入力チェックでNGの場合は何もしない
    if (isFormInvalid()) {
      return;
    }

    //変数へ記憶
    let post_m_keyword1 = m_keyword1? m_keyword1 : new M_keyword1;
    post_m_keyword1.excel_filename = formState.excel_filename.value;

    //APIに登録を発行
    if (m_keyword1s){

      const formData = new FormData();
      formData.append('excel',  post_m_keyword1.excel);

      const m_keyword1Withm_keyword2s = {
        ...post_m_keyword1,
        m_keyword2s: Object.values(post_m_keyword1.m_keyword2s)
      };
      formData.append('m_keyword1', new Blob([JSON.stringify(m_keyword1Withm_keyword2s)], {type: 'application/json'}));

      const url =  isCreate? 'm_keyword_create': 'm_keyword_update';
      const response = await comUtil.callApi(url, formData,'multipart/form-dat');
      if (response){
        dispatch(addNotification("【処理設定_親】","登録しました"));
        //10秒後に消す
        setTimeout(function(){if (notifications){dispatch(removeNotification_pre());}},REMOVE_NOTIFICATION_SECONDS);

        dispatch(setModificationState(M_keyword1ModificationStatus.None));

        //親フォーム側での再検索
        props.m_keyword1_count();
      };
    }

  }


    function cancelForm(): void {
      dispatch(setModificationState(M_keyword1ModificationStatus.None));
    }

    //入力チェック
    function isFormInvalid(): boolean {
      return (
           formState.modify_count.error 
        || formState.excel.error
        || formState.excel_filename.error
        || formState.update_u_id.error
        || formState.update_date.error
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

  //処理シナリオの読み取り
  function Load_excel(s_excel:Blob): void {
    var reader = new FileReader();
    reader.onload = (e) => {
      try{
        if (e && e.target){
          var book = xlsx.read(e.target.result, {type: "array"});      

          const Errors:string[] = [];

          //シート「実行順」の取込
          let sheetname = 'KeyWords';
          const sheet = book.Sheets[sheetname];
          if (!sheet){
            ErrorMSG('取込に失敗しました。「"+sheetname+"」シートが存在しません。');
            return;
          }

          //#R1#の各情報を確保
          let Field:string = '';
          let cellAddress = xlsxUtil.searchSheetForText(sheet,'#R1#');
          let row1 = -1;
          let row2 = -1;
          let col_no = -1;
          let col_keyword = -1;
          let col_func_name = -1;
          let col_ok_result = -1;
          let col_ng_result = -1;
          let col_param1 = -1;
          let col_param2 = -1;
          let col_param3 = -1;
          let col_variable1 = -1;
          let col_bikou = -1;
          if (!cellAddress) Errors.push('制御文字「#R1#」がエクセルに発見できませんでした:シート名['+sheetname+']');
          if (cellAddress){
            let row = xlsx.utils.decode_cell(cellAddress).r;
            row1 = row;

            Field = 'NO';
            cellAddress = xlsxUtil.searchRowForText(sheet,row,Field);
            if (cellAddress){col_no = xlsx.utils.decode_cell(cellAddress).c}
            else {Errors.push('「'+Field+'」の列が存在しません:シート名['+sheetname+']');};
            
            Field = 'キーワード';
            cellAddress = xlsxUtil.searchRowForText(sheet,row,Field);
            if (cellAddress){col_keyword = xlsx.utils.decode_cell(cellAddress).c}
            else {Errors.push('「'+Field+'」の列が存在しません:シート名['+sheetname+']');};
            
            Field = '関数名';
            cellAddress = xlsxUtil.searchRowForText(sheet,row,Field);
            if (cellAddress){col_func_name = xlsx.utils.decode_cell(cellAddress).c}
            else {Errors.push('「'+Field+'」の列が存在しません:シート名['+sheetname+']');};
            
            Field = 'OK文言';
            cellAddress = xlsxUtil.searchRowForText(sheet,row,Field);
            if (cellAddress){col_ok_result = xlsx.utils.decode_cell(cellAddress).c}
            else {Errors.push('「'+Field+'」の列が存在しません:シート名['+sheetname+']');};
            
            Field = 'NG文言';
            cellAddress = xlsxUtil.searchRowForText(sheet,row,Field);
            if (cellAddress){col_ng_result = xlsx.utils.decode_cell(cellAddress).c}
            else {Errors.push('「'+Field+'」の列が存在しません:シート名['+sheetname+']');};
            
            Field = '第1引数';
            cellAddress = xlsxUtil.searchRowForText(sheet,row,Field);
            if (cellAddress){col_param1 = xlsx.utils.decode_cell(cellAddress).c}
            else {Errors.push('「'+Field+'」の列が存在しません:シート名['+sheetname+']');};
            
            Field = '第2引数';
            cellAddress = xlsxUtil.searchRowForText(sheet,row,Field);
            if (cellAddress){col_param2 = xlsx.utils.decode_cell(cellAddress).c}
            else {Errors.push('「'+Field+'」の列が存在しません:シート名['+sheetname+']');};
            
            Field = '第3引数';
            cellAddress = xlsxUtil.searchRowForText(sheet,row,Field);
            if (cellAddress){col_param3 = xlsx.utils.decode_cell(cellAddress).c}
            else {Errors.push('「'+Field+'」の列が存在しません:シート名['+sheetname+']');};
            
            Field = '変数';
            cellAddress = xlsxUtil.searchRowForText(sheet,row,Field);
            if (cellAddress){col_variable1 = xlsx.utils.decode_cell(cellAddress).c}
            else {Errors.push('「'+Field+'」の列が存在しません:シート名['+sheetname+']');};
            
            Field = '備考';
            cellAddress = xlsxUtil.searchRowForText(sheet,row,Field);
            if (cellAddress){col_bikou = xlsx.utils.decode_cell(cellAddress).c}
            else {Errors.push('「'+Field+'」の列が存在しません:シート名['+sheetname+']');};
          }
          
          //#R2# 明細箇所の取込
          cellAddress = xlsxUtil.searchSheetForText(sheet,'#R2#');
          if (!cellAddress) Errors.push('制御文字「#R2#」がエクセルに発見できませんでした:シート名['+sheetname+']');
          if (cellAddress){
            let row2 = xlsx.utils.decode_cell(cellAddress).r;
            const lastRow = xlsxUtil.getLastRowForCol(sheet,col_no);
            m_keyword1.m_keyword2s = {};//クリア
            for (let r = row2; r <= lastRow; r++) {
              const m_keyword2:IM_keyword2 = new M_keyword2();
              m_keyword2.no = xlsxUtil.cellvalue(sheet,r,col_no);
              m_keyword2.keyword =  xlsxUtil.cellvalue(sheet,r,col_keyword);
              m_keyword1.m_keyword2s[m_keyword2.keyword] = m_keyword2;
              m_keyword2.func_name  =  xlsxUtil.cellvalue(sheet,r,col_func_name);
              m_keyword2.ok_result  =  xlsxUtil.cellvalue(sheet,r,col_ok_result);
              m_keyword2.ng_result  =  xlsxUtil.cellvalue(sheet,r,col_ng_result);
              m_keyword2.param1     =  xlsxUtil.cellvalue(sheet,r,col_param1);
              m_keyword2.param2     =  xlsxUtil.cellvalue(sheet,r,col_param2);
              m_keyword2.param3     =  xlsxUtil.cellvalue(sheet,r,col_param3);
              m_keyword2.variable1  =  xlsxUtil.cellvalue(sheet,r,col_variable1);
              m_keyword2.bikou      =  xlsxUtil.cellvalue(sheet,r,col_bikou);

              m_keyword2.modify_count = m_keyword1.modify_count;
            }
          }

          //エラーを一括でテキスト化しダウンロードさせる
          if (Errors.length != 0 ){
            ErrorMSG('取込に失敗しました。「エラー.txt」を確認して下さい');
            const element = document.createElement('a');
            const file = new Blob([Errors.join('\n')], { type: 'text/plain' });
            element.href = URL.createObjectURL(file);
            element.download = 'エラー.txt';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
            return;
          }
          
          //formStateに反映
          m_keyword1.excel = s_excel;
          setM_keyword1((prevState: any) => ({ ...prevState, ...m_keyword1 }));

          setFormState(prevState=> ({ ...prevState, excel_filename: { ...prevState.excel_filename, value: m_keyword1.excel_filename } }));          

        }
      } catch (error: any) {
        Swal.fire({
          title: 'Error!',
          text: error.stack,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    }
    reader.readAsArrayBuffer(s_excel);
  }


  //https://codezine.jp/article/detail/15759?p=2
  //外枠の基本スタイル
  const baseStyle = {
    flex: 1,
    display: "flex",
    flexDirection: 'column' as 'column',
    alignItems: "center",
    padding: "20px",
    borderWidth: 2,
    borderRadius: 2,
    borderColor: "#eeeeee",
    borderStyle: "dashed",
    backgroundColor: "#fafafa",
    color: "#bdbdbd",
    outline: "none",
    transition: "border .24s ease-in-out",
  };
  //フォーカスが当たったときの枠の色
  const focusedStyle = {
    borderColor: "#2196f3",
  };

  //受け入れ可能なファイルをドラッグしたときの色
  const acceptStyle = {
    borderColor: "#0067C0",
  };

  //受け入れできないファイルをドラッグしたときの色
  const rejectStyle = {
    borderColor: "#ff1744",
  };

  const [DragEndMsg_excel, setDragEndMsg_excel] = useState("");
  const [DragEndIcon_excel, setDragEndIcon_excel] = useState(faFileAlt);
　const [isDragEnd_excel, setIsDragEnd_excel] = useState(false);
  function Dropzone_excel() {

    const onDrop = useCallback((acceptedFiles: any) => {
      setIsDragEnd_excel(true);  

      if (acceptedFiles.length==0){
        setDragEndMsg_excel('アップロード出来ないファイルタイプです。無視されました。');
        setDragEndIcon_excel(faCircleExclamation);
      }else{
        setDragEndMsg_excel('ファイルがアップロードされました');
        setDragEndIcon_excel(faFileAlt);
      }
      
      //ChatGTPが書いたコード
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = () => {
        const binaryStr = reader.result;
        const blob = new Blob([binaryStr as string], { type: file.type });
        
        m_keyword1.excel_filename = file.name;
        m_keyword1.excel = blob as File;

        try{
          Load_excel(blob);
        }
        catch (error) {
        Swal.fire({
          title: 'Error!',
          text: error as string,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }


        
      };
      reader.readAsArrayBuffer(file);
    }, []); 
    
    const {
      getRootProps,
      getInputProps,
      isFocused, 
      isDragAccept, 
      isDragReject, 
    // } = useDropzone({ onDrop,accept: {"image/*":[]}  })//←ドラッグ可能なファイル種別を指定する場合;
    } = useDropzone({ onDrop}  );

    //状態に応じたスタイルオブジェクトを生成する
    const style = useMemo(
      () => ({
        ...baseStyle,
        ...(isFocused ? focusedStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {}),
      }),
      [isFocused, isDragAccept, isDragReject]
    );

    return (
      <div>
        <label>シナリオエクセル</label>
        <div id="s_excel" {...getRootProps({ style })}>
          <input {...getInputProps()} />
          {isDragEnd_excel ? (
            <div>
              {/* アイコン https://fontawesome.com/v5/icons/file-alt?s=solid&f=classic */}
              <FontAwesomeIcon icon={DragEndIcon_excel} />
              {DragEndMsg_excel}
    　      </div>
          ):(
            <div>
            <FontAwesomeIcon icon={faUpload} />
            ファイルをドラッグアンドドロップして下さい<br/>
            (クリックして、ファイルを選択する事も可能です)
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Fragment>
      <div className="col-xl-7 col-lg-7">
        <div className="card shadow mb-4">
          <form onSubmit={saveM_keyword1} id="m_keyword1_form">
            <div className="card-header py-3">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h6 id="syori1_form_header" className="m-0 font-weight-bold text-green" style={{ alignSelf: 'flex-start' }}>
                キーワードマスタ登録 
                </h6>
                <div>
                  <button type="submit" className="btn btn-danger">
                    登録
                  </button>
                  <button type="submit" className="btn btn-dark  ml-2" onClick={() => cancelForm()}>
                    ×
                  </button>
                </div>
              </div>

            </div>
            <div className="card-body">

              <Dropzone_excel />

              <div className="form-row">
                <div className="form-group">
                  <TextArea
                    id="input_excel_filename"
                    field = "excel_filename"
                    value={formState.excel_filename.value}
                    onChange={hasFormValueChanged}
                    required={false}
                    maxLength={200}
                    cols={80}
                    rows={2}
                    label="エクセルファイル名"
                    placeholder="excel_filename"
                    disabled={account.authority_lv == AUT_NUM_READ_ONLY}//参照専用の場合は編集不可
                  />
                </div>
              </div>

            </div>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default M_keyword1Form;
