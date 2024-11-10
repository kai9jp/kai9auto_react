import UploadModal from "common/components/Upload";
import { useDispatch, useSelector} from 'react-redux';
import Load_s_excel from "components/Syori1/Load_s_excel";
import React, { Dispatch } from "react";
import * as comUtil  from "../../common/comUtil";
import Swal from "sweetalert2";
import { editSyori1 } from "store/actions/syori1.action";
import { addNotification, removeNotification_pre } from "store/actions/notifications.action";
import { REMOVE_NOTIFICATION_SECONDS } from "common/constants";
import { INotificationState, IStateType } from "store/models/root.interface";
import { ISyori1 } from "store/models/syori1.interface";

export type UploadSyoriProps = {
  syori1:ISyori1;
  setSyori1:any;
  isUploadModalOpen:any;
  setisUploadModalOpen:any;
  exec_Button:any;
}
export const UploadSyori = (props:UploadSyoriProps) => {
  const dispatch: Dispatch<any> = useDispatch();
  const notifications: INotificationState | null = useSelector((state: IStateType) => state.notifications);

  const handleExcelDrop = async (blob: Blob, filename: any) => {

    // アップロードされたファイルを処理する
    if (props.syori1){
      props.syori1.s_excel_filename = filename;
      props.syori1.s_excel = blob as File;

      try{
        //読込処理
        await Load_s_excel(blob, props.syori1, false, props.setSyori1 ).catch(() => {return;});        

        // 取込実行
        if (!props.syori1) return;
        const formData = new FormData();
        formData.append('s_excel',  props.syori1.s_excel);
        
        //syori2sと、syori3sフィールドに含まれるオブジェクトを配列に変換し、新しいオブジェクトに追加(ChatGPT作)
        const syori1WithSyori2sAndSyori3s = {
          ...props.syori1,
          syori2s: Object.values(props.syori1.syori2s).map((syori2) => ({
            ...syori2,
            syori3s: Object.values(syori2.syori3s)
          }))
        };
        formData.append('syori1', new Blob([JSON.stringify(syori1WithSyori2sAndSyori3s)], {type: 'application/json'}));

        //API発行
        const response = await comUtil.callApi('syori1_update', formData,'multipart/form-dat');
        if (response){
          //登録で自動採番された番号を取得する
          props.syori1.s1_id = Number(response.data.s1_id);
          props.syori1.modify_count = Number(response.data.modify_count);

          //アップロード画面を閉じる
          props.setisUploadModalOpen(false)

          //ストアへ反映
          dispatch(editSyori1({...props.syori1}));

          dispatch(addNotification("処理設定_親", `【${props.syori1.s1_id}】登録しました`));
          //10秒後に消す
          setTimeout(function(){if (notifications){dispatch(removeNotification_pre());}},REMOVE_NOTIFICATION_SECONDS);

          //処理実行
          props.exec_Button(props.syori1.s1_id); 
        }


      }
      catch (error) {
        Swal.fire({
          title: 'Error!',
          text: error as string,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
  
    }
  };  


  return (
    <>
      <div>
        <UploadModal
          title="シナリオ取込"
          msg={`処理No=${props.syori1?.s1_id}:処理名=${props.syori1?.s1_name}`}
          isOpen={props.isUploadModalOpen}
          onClose={() => {props.setisUploadModalOpen(false); }}
          handleExcelDrop={handleExcelDrop}
        />
      </div>
    </>
  );
};
  