import Swal from 'sweetalert2';
import { ISyori1, Syori1 } from '../../store/models/syori1.interface';
import { callApi } from '../../common/comUtil';
import { ISyori_rireki1, Syori_rireki1 } from 'store/models/syori_rireki1.interface';
import { Workbook } from 'exceljs';
import moment from 'moment';
import * as ExcelJSUtil from 'common/ExcelJSUtil';

function ErrorMSG(msg: string) {
    Swal.fire({
      title: 'Error!',
      text: msg,
      icon: 'error',
      confirmButtonText: 'OK'
    })
}

//処理シナリオの出力
function Export_s_excel(syori_rireki1: ISyori_rireki1): Promise<void> {
  return new Promise(async (_, reject) => {
    
    //API(処理マスタ)
    const syori1 = new Syori1();
    const s_data = { 
        limit: 100,
        offset: 0,
        findstr:"",
        isDelDataShow:true,
        s1_id:syori_rireki1.s1_id//s1_idが指定された場合、単一処理の検索モードとして扱う
      };
    const response1 = await callApi('syori1_find', s_data,'application/x-www-form-urlencoded');//「application/x-www-form-urlencoded」はURLエンコードした平文での送信
    if (response1){
      const syori1_array: ISyori1[] = JSON.parse(response1.data.data);
      if (syori1_array){
        syori1_array.map((value: ISyori1) => {
          Object.assign(syori1, value);
        });
      }
      console.log(syori1.syori2s);
    };

    //API(処理シナリオのエクセル)
    const data = { 
      s1_id: syori_rireki1.s1_id,
      modify_count: syori_rireki1.syori_modify_count
    };
    const response = await callApi('syori1_s_excel_download', data,'application/x-www-form-urlencoded',true);
      if (response){
      // Blobとしてレスポンスデータを取得
      const blob = new Blob([response.data], { type: "application/octet-stream" });
      
      // BlobをArrayBufferに変換
      const reader = new FileReader();
      reader.onload = async () => {
        // ArrayBufferをUint8Arrayに変換
        const arrayBuffer = reader.result as ArrayBuffer;
        const uint8Array = new Uint8Array(arrayBuffer);

        // バッファーをワークブックに変換
        const workbook = new Workbook();
        await workbook.xlsx.load(uint8Array.buffer);

        //API(処理履歴)
        const sr1 = new Syori_rireki1();
        let data = {
          limit: 100,
          offset: 0,
          findstr: "",
          s1_id: syori1.s1_id,
          s2_id: -1,
          s_count: syori_rireki1.s_count
        };
        const response = await callApi('syori_rireki1_find_one', data, 'application/x-www-form-urlencoded');
        if (response && response.data && response.data.data) {
          const data: ISyori_rireki1[] = JSON.parse(response.data.data);
          if (data) {
            // map関数は、指定したコールバック関数を配列の要素数分繰り返す(valueは引数であり、配列の各要素が入ってくる)
            // 配列の要素数だけaddAdminする
            data.map((value: ISyori_rireki1) => {
              // mapするだけでは、シグネチャ型(子データ)がundefinedになってしまうので、インスタンスを作成し、中身をアサインする
              Object.assign(sr1, value);
            });
          }
        }
        
        // データの反映処理を実行(処理1)
        await Export_s_excel(workbook,sr1);

        // ワークブックをBlobに変換
        const buffer = await workbook.xlsx.writeBuffer();
        const newBlob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        // ダウンロード処理
        const url = window.URL.createObjectURL(newBlob);
        const a = document.createElement("a");
        a.href = url;
        const fileNameParts = syori1.s_excel_filename.split(".");
        const fileName = fileNameParts[0];
        const extension = fileNameParts[1];
        a.download = `${fileName}_${sr1.s_count}回.${extension}`;        
        a.click();
        a.remove();
        URL.revokeObjectURL(url);      
      };      
      reader.readAsArrayBuffer(blob);
    };


    async function Export_s_excel(book: Workbook,sr1: Syori_rireki1){

      const Errors:string[] = [];

      //エクセルへデータを格納
      let sheetname = '実行順';
      const sheet = book.getWorksheet(sheetname);
      if (!sheet){
        const errorMessage = "出力に失敗しました。「"+sheetname+"」シートが存在しません。"
        ErrorMSG(errorMessage);
        return reject(new Error(errorMessage));
      }

      //制御文字「#R3#」の検索
      let cellAddress = ExcelJSUtil.searchSheetForCellAddress(sheet,'#R3#');
      if (!cellAddress){
        Errors.push('制御文字「#R3#」がエクセルに発見できませんでした:シート名['+sheetname+']');
        return;
      } 
      let row3 = cellAddress.row;

      //制御文字「#R4#」の検索
      cellAddress = ExcelJSUtil.searchSheetForCellAddress(sheet,'#R4#');
      if (!cellAddress){
        Errors.push('制御文字「#R4#」がエクセルに発見できませんでした:シート名['+sheetname+']');
        return;
      } 
      let row4 = cellAddress.row;

      //結果を反映
      for (const key2 in sr1.syori_rireki2s) {
        const sr2 = sr1.syori_rireki2s[key2];
        
        //実行順シートへの反映
        let rows = sheet.getRows(row4, sheet.rowCount);
        if (rows) {
          for (const row of rows) {
            if (!Array.isArray(row.values)) continue;
            const sheetname = row.getCell(syori1.col_sheetname + 1).value;
            if (!sheetname) continue;
            //シート名が異なる場合は抜ける
            if (sheetname.toString() != sr2.sheetname) continue;
        
            //開始時刻
            let cell = row.getCell(syori1.col_r_start_time + 1);
            cell.value = moment(sr2.start_time).format('YYYY/MM/DD HH:mm:ss');
            //終了時刻
            cell = row.getCell(syori1.col_r_end_time + 1);
            cell.value = moment(sr2.end_time).format('YYYY/MM/DD HH:mm:ss');
            //結果
            cell = row.getCell(syori1.col_result + 1);
            if (sr2.is_suspension){
              //中止の場合、黄色で中止と表示
              cell.value = "中止";
              ExcelJSUtil.setCellColor('FFFFFF00',cell);
            }else{
              if (sr2.result_type == 0){
                cell.value = "OK";
              }else{
                cell.value = "NG";
              }
              if (sr2.result_type == 1){
                // NGを赤にする
                ExcelJSUtil.setCellColor('FFFF0000',cell);
              }else
              if (sr2.result_type == 2){
                // 想定相違を緑にする
                ExcelJSUtil.setCellColor('FF00FF00',cell);
              }
            }
          }
        }

        //各シートへの反映
        let sheetname = sr2.sheetname;
        const sheet3 = book.getWorksheet(sheetname);
        if (!sheet3){
          const errorMessage = "出力に失敗しました。「"+sheetname+"」シートが存在しません。"
          ErrorMSG(errorMessage);
          continue;
        }

        //制御文字「#R3#」の検索
        let cellAddress = ExcelJSUtil.searchSheetForCellAddress(sheet3,'#R3#');
        if (!cellAddress){
          Errors.push('制御文字「#R3#」がエクセルに発見できませんでした:シート名['+sheetname+']');
          continue;
        } 
        row3 = cellAddress.row;
        //処理2を確保
        let syori2 = null;
        const keys = Object.keys(syori1.syori2s);
        for (let i2 = 0; i2 <= keys.length-1;i2++ ){
          const key = keys[i2];
          const sr2 = syori1.syori2s[Number(key)];
          if (sr2.sheetname != sheetname) continue; 
          syori2 = sr2;
          break;
        }
        if (syori2 == null) continue;

        

        //各処理3シートへの値反映
        rows = sheet3.getRows(row3,sheet3.rowCount);
        if (rows) {
          for (const row of rows) {
            if (!Array.isArray(row.values)) continue;
            const step = ExcelJSUtil.getCellValue(row.getCell(syori2.col_step+1));
            for (const key3 in sr2.syori_rireki3s) {
              const sr3 = sr2.syori_rireki3s[key3];
              if (step != sr3.step) continue;
              if (sr3.keyword == "セパレータ") continue;

              //実施結果
              let cell = sheet3.getCell(row.number, syori2.col_run_result+1);
              cell.value = sr3.is_ok?"OK":"NG";

              //想定相違
              cell = sheet3.getCell(row.number, syori2.col_ass_diff+1);
              if (sr3.is_suspension){
                //中止の場合、黄色で中止と表示
                cell.value = "中止";
                ExcelJSUtil.setCellColor('FFFFFF00',cell);
              }else{
                if (sr3.result_type === 0){
                  cell.value = "一致";
                }else{
                  cell.value = "相違";
                }

                if (sr3.result_type != 0){
                  if (sr3.result_type == 2){
                    //想定通りの相違であれば緑にする
                    ExcelJSUtil.setCellColor('FF00FF00',cell);
                  }else if (sr3.result_type == 4){
                    //SKIPの場合、緑色でSKIPと表示
                    cell.value = "SKIP";
                    ExcelJSUtil.setCellColor('FF00FF00',cell);
                  }else{
                    // 想定違いの場合は赤色にする
                    ExcelJSUtil.setCellColor('FFFF0000',cell);
                  }
                }
              }


              //開始
              cell = sheet3.getCell(row.number, syori2.col_start_time+1);
              cell.value = moment(sr3.start_time).format('YYYY/MM/DD HH:mm:ss');
              //終了
              cell = sheet3.getCell(row.number, syori2.col_end_time+1);
              cell.value = moment(sr3.end_time).format('YYYY/MM/DD HH:mm:ss');
              //所要時間
              cell = sheet3.getCell(row.number, syori2.col_sum_time+1);
              cell.value = moment.utc(moment(sr3.end_time).diff(moment(sr3.start_time))).format('HH:mm:ss')
              //ログ
              cell = sheet3.getCell(row.number, syori2.col_log+1);
              cell.value = sr3.log;

            }
          }
        }
      }

    }
  })
};

export default Export_s_excel;