import Swal from 'sweetalert2';
import { ISyori1 } from '../../store/models/syori1.interface';
import { ISyori2, Syori2 } from '../../store/models/syori2.interface';
import { Syori3 } from '../../store/models/syori3.interface';
import * as xlsx from 'xlsx';
import * as xlsxUtil  from "../../common/xlsxUtil";
import * as comUtil  from "../../common/comUtil";
import { callApi } from '../../common/comUtil';
import { IM_keyword2 } from 'store/models/m_keyword2.interface';

function ErrorMSG(msg: string) {
    Swal.fire({
      title: 'Error!',
      text: msg,
      icon: 'error',
      confirmButtonText: 'OK'
    })
}

//処理シナリオの読み取り
function Load_s_excel(
    s_excel: Blob, 
    syori1: ISyori1, 
    isCreate: boolean, 
    setSyori1: (arg0: (prevState: any) => any) => void, setFormState?: (arg0: (prevState: any) => any) => void,
    setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try{
          if (e && e.target){
            var book = xlsx.read(e.target.result, {type: "array"});      

            const Errors:string[] = [];

          // キーワードのキャッシュ
          const keywordCache: { [key: string]: string } = {};
          // API発行
          const initialResponse = await callApi('m_keyword2_a_find_all_keywords', {}, 'application/x-www-form-urlencoded');
          if (initialResponse && initialResponse.data && initialResponse.data.data) {
            const allKeywords: string[] = JSON.parse(initialResponse.data.data);
            allKeywords.forEach(keyword => {
              keywordCache[keyword] = keyword;
            });
          }


            //シート「実行順」の取込
            let SheetName = '実行順';
            const sheet = book.Sheets[SheetName];
            if (!sheet){
              const errorMessage = "出力に失敗しました。「"+SheetName+"」シートが存在しません。"
              ErrorMSG(errorMessage);
              return reject(new Error(errorMessage));
            }

            //#R1#の各情報を確保
            let Field:string = '';
            let cellAddress = xlsxUtil.searchSheetForText(sheet,'#R1#');
            let row1 = -1;
            let row2 = -1;
            let row3 = -1;
            let row5 = -1;
            if (!cellAddress) Errors.push('制御文字「#R1#」がエクセルに発見できませんでした:シート名['+SheetName+']');
            if (cellAddress){
              let row = xlsx.utils.decode_cell(cellAddress).r;
              row1 = row;

              Field = '処理名';
              cellAddress = xlsxUtil.searchRowForText(sheet,row,Field);
              if (cellAddress){syori1.col_s1_name = xlsx.utils.decode_cell(cellAddress).c+1}
              else {Errors.push('「'+Field+'」の列が存在しません:シート名['+SheetName+']');};
              
              Field = '処理No';
              cellAddress = xlsxUtil.searchRowForText(sheet,row,Field);
              if (cellAddress){syori1.col_s1_id = xlsx.utils.decode_cell(cellAddress).c+1}
              else {Errors.push('「'+Field+'」の列が存在しません:シート名['+SheetName+']');};

              Field = '実行時引数';
              cellAddress = xlsxUtil.searchRowForText(sheet,row,Field);
              if (cellAddress){syori1.col_run_parameter = xlsx.utils.decode_cell(cellAddress).c+1}
              else {Errors.push('「'+Field+'」の列が存在しません:シート名['+SheetName+']');};
            }
            
            //#R2#の各情報を確保
            cellAddress = xlsxUtil.searchSheetForText(sheet,'#R2#');
            if (!cellAddress) Errors.push('制御文字「#R2#」がエクセルに発見できませんでした:シート名['+SheetName+']');
            if (cellAddress){
              let row = xlsx.utils.decode_cell(cellAddress).r;
              row2 = row;

              Field = '実行ホスト';
              cellAddress = xlsxUtil.searchRowForText(sheet,row,Field);
              if (cellAddress){syori1.col_run_host = xlsx.utils.decode_cell(cellAddress).c+1}
              else {Errors.push('「'+Field+'」の列が存在しません:シート名['+SheetName+']');};
              
              Field = '実行時刻';
              cellAddress = xlsxUtil.searchRowForText(sheet,row,Field);
              if (cellAddress){syori1.col_run_timing = xlsx.utils.decode_cell(cellAddress).c+1}
              else {Errors.push('「'+Field+'」の列が存在しません:シート名['+SheetName+']');};
            }
            if (row2!=-1){
              syori1.run_timing = xlsxUtil.cellvalue(sheet,row2,syori1.col_run_timing);
              syori1.run_host   = xlsxUtil.cellvalue(sheet,row2,syori1.col_run_host);
            }
            

            //#R5#の各情報を確保
            cellAddress = xlsxUtil.searchSheetForText(sheet,'#R5#');
            if (!cellAddress) Errors.push('制御文字「#R5#」がエクセルに発見できませんでした:シート名['+SheetName+']');
            if (cellAddress){
              let row = xlsx.utils.decode_cell(cellAddress).r;
              row5 = row;

              Field = '備考';
              cellAddress = xlsxUtil.searchRowForText(sheet,row,Field);
              if (cellAddress){syori1.col_bikou = xlsx.utils.decode_cell(cellAddress).c+1}
              else {Errors.push('「'+Field+'」の列が存在しません:シート名['+SheetName+']');};
            }
            if (row5!=-1){
              syori1.bikou      = xlsxUtil.cellvalue(sheet,row5,syori1.col_bikou);
            }

            //#R3#の各情報を確保
            cellAddress = xlsxUtil.searchSheetForText(sheet,'#R3#');
            if (!cellAddress) Errors.push('制御文字「#R3#」がエクセルに発見できませんでした:シート名['+SheetName+']');
            if (cellAddress){
              let row = xlsx.utils.decode_cell(cellAddress).r;

              Field = '実行順';
              cellAddress = xlsxUtil.searchRowForText(sheet,row,Field);
              if (cellAddress){syori1.col_run_order = xlsx.utils.decode_cell(cellAddress).c}
              else {Errors.push('「'+Field+'」の列が存在しません:シート名['+SheetName+']');};
              
              Field = 'シート名';
              cellAddress = xlsxUtil.searchRowForText(sheet,row,Field);
              if (cellAddress){syori1.col_sheetname = xlsx.utils.decode_cell(cellAddress).c}
              else {Errors.push('「'+Field+'」の列が存在しません:シート名['+SheetName+']');};

              Field = '実施FLG';
              cellAddress = xlsxUtil.searchRowForText(sheet,row,Field);
              if (cellAddress){syori1.col_is_do = xlsx.utils.decode_cell(cellAddress).c}
              else {Errors.push('「'+Field+'」の列が存在しません:シート名['+SheetName+']');};

              Field = 'NGで停止';
              cellAddress = xlsxUtil.searchRowForText(sheet,row,Field);
              if (cellAddress){syori1.col_ng_stop = xlsx.utils.decode_cell(cellAddress).c}
              else {Errors.push('「'+Field+'」の列が存在しません:シート名['+SheetName+']');};

              Field = '正異';
              cellAddress = xlsxUtil.searchRowForText(sheet,row,Field);
              if (cellAddress){syori1.col_is_normal = xlsx.utils.decode_cell(cellAddress).c}
              else {Errors.push('「'+Field+'」の列が存在しません:シート名['+SheetName+']');};

              Field = '開始';
              cellAddress = xlsxUtil.searchRowForText(sheet,row,Field);
              if (cellAddress){syori1.col_r_start_time = xlsx.utils.decode_cell(cellAddress).c}
              else {Errors.push('「'+Field+'」の列が存在しません:シート名['+SheetName+']');};

              Field = '終了';
              cellAddress = xlsxUtil.searchRowForText(sheet,row,Field);
              if (cellAddress){syori1.col_r_end_time = xlsx.utils.decode_cell(cellAddress).c}
              else {Errors.push('「'+Field+'」の列が存在しません:シート名['+SheetName+']');};

              Field = '結果';
              cellAddress = xlsxUtil.searchRowForText(sheet,row,Field);
              if (cellAddress){syori1.col_result = xlsx.utils.decode_cell(cellAddress).c}
              else {Errors.push('「'+Field+'」の列が存在しません:シート名['+SheetName+']');};

              Field = 'シナリオ';
              cellAddress = xlsxUtil.searchRowForText(sheet,row,Field);
              if (cellAddress){syori1.col_scenario = xlsx.utils.decode_cell(cellAddress).c}
              else {Errors.push('「'+Field+'」の列が存在しません:シート名['+SheetName+']');};

              Field = '処理概要';
              cellAddress = xlsxUtil.searchRowForText(sheet,row,Field);
              if (cellAddress){syori1.col_s_outline = xlsx.utils.decode_cell(cellAddress).c}
              else {Errors.push('「'+Field+'」の列が存在しません:シート名['+SheetName+']');};
            }

            //ヘッダー箇所の読込
            if (row1!=-1){
              syori1.s1_name = xlsxUtil.cellvalue(sheet,row1,syori1.col_s1_name);
              syori1.api_url = xlsxUtil.cellvalue(sheet,row1,syori1.col_run_parameter);

              //処理No相違チェック
              const s1_id = xlsxUtil.cellvalue(sheet,row1,syori1.col_s1_id);
              if (syori1.s1_id === 0){
                syori1.s1_id = s1_id;
              }else{
                if (!isCreate　&& s1_id !== syori1.s1_id){
                  Errors.push('画面上の処理No['+syori1.s1_id+']と、エクセルの処理No['+s1_id+']が不一致です。:シート名['+SheetName+']');
                }
              }
            }

            //#R4# 明細箇所の取込
            cellAddress = xlsxUtil.searchSheetForText(sheet,'#R4#');
            if (!cellAddress) Errors.push('制御文字「#R4#」がエクセルに発見できませんでした:シート名['+SheetName+']');
            if (cellAddress){
              let row4 = xlsx.utils.decode_cell(cellAddress).r;
              const lastRow = xlsxUtil.getLastRowForCol(sheet,syori1.col_sheetname);
              let s2_id = 1;
              syori1.syori2s = {};//クリア
              for (let r = row4; r <= lastRow; r++) {
                const syori2:ISyori2 = new Syori2();
                const SheetName = xlsxUtil.cellvalue(sheet,r,syori1.col_sheetname);
                syori2.run_order = xlsxUtil.cellvalue(sheet,r,syori1.col_run_order);
                syori1.syori2s[s2_id] = syori2;
                syori2.sheetname = SheetName;
                const cellValue = (xlsxUtil.cellvalue(sheet, r, syori1.col_is_do) || '').toString().toLowerCase();//文字列、BOOL型、どちらでも対応できるようにする
                syori2.is_do = cellValue == 'true';
                syori2.ng_stop = xlsxUtil.cellvalue(sheet,r,syori1.col_ng_stop) != '' && xlsxUtil.cellvalue(sheet,r,syori1.col_ng_stop) != '強制実行';
                syori2.forced_run = xlsxUtil.cellvalue(sheet,r,syori1.col_ng_stop) == '強制実行';
                syori2.s2_id = s2_id;
                syori2.s1_id = syori1.s1_id;
                syori2.modify_count = syori1.modify_count;
              s2_id++;
              }
            }

            //他シートの取込
            for (let i = 0; i <= book.SheetNames.length-1; i++) {
              const SheetName = book.SheetNames[i];
              const sheet = book.Sheets[SheetName];

              //実行順シートに書いてないシートは無視する
              let syori2 = null;
              const keys = Object.keys(syori1.syori2s);
              for (let i2 = 0; i2 <= keys.length-1;i2++ ){
                const key = keys[i2];
                const sr2 = syori1.syori2s[Number(key)];
                if (sr2.sheetname != SheetName) continue; 
                syori2 = sr2;
                break;
              }
              if (syori2 == null) continue;

              cellAddress = xlsxUtil.searchSheetForText(sheet,'#R4#');
              if (!cellAddress) Errors.push('制御文字「#R4#」が発見できませんでした:シート名['+SheetName+']');
              if (cellAddress){
                syori2.row_log = xlsx.utils.decode_cell(cellAddress).r+1;
              }

              cellAddress = xlsxUtil.searchSheetForText(sheet,'#C1#');
              if (!cellAddress) Errors.push('制御文字「#C1#」が発見できませんでした:シート名['+SheetName+']');
              if (cellAddress){
                const col = xlsx.utils.decode_cell(cellAddress).c;

                cellAddress = xlsxUtil.searchSheetForText(sheet,'#R5#');
                if (!cellAddress) Errors.push('制御文字「#R5#」が発見できませんでした:シート名['+SheetName+']');
                if (cellAddress){
                  const row = xlsx.utils.decode_cell(cellAddress).r;
                  syori2.is_normal = xlsxUtil.cellvalue(sheet,row,col) === '正常系';
                }

                cellAddress = xlsxUtil.searchSheetForText(sheet,'#R6#');
                if (!cellAddress) Errors.push('制御文字「#R6#」が発見できませんでした:シート名['+SheetName+']');
                if (cellAddress){
                  const row = xlsx.utils.decode_cell(cellAddress).r;
                  syori2.scenario = xlsxUtil.cellvalue(sheet,row,col);
                }

                cellAddress = xlsxUtil.searchSheetForText(sheet,'#R7#');
                if (!cellAddress) Errors.push('制御文字「#R7#」が発見できませんでした:シート名['+SheetName+']');
                if (cellAddress){
                  const row = xlsx.utils.decode_cell(cellAddress).r;
                  syori2.s_outline = xlsxUtil.cellvalue(sheet,row,col);
                }
              }
              
              //列の要素をチェックする(#R3#)
              cellAddress = xlsxUtil.searchSheetForText(sheet,'#R3#');
              if (!cellAddress) Errors.push('制御文字「#R3#」が発見できませんでした:シート名['+SheetName+']');
              if (cellAddress){
                const row = xlsx.utils.decode_cell(cellAddress).r;
                row3 = row;

                let FindStr = 'Step';
                cellAddress = xlsxUtil.searchRowForText(sheet,row,FindStr);
                if (!cellAddress) Errors.push('「'+FindStr+'」の列が存在しません:シート名['+SheetName+']');
                if (cellAddress) syori2.col_step = xlsx.utils.decode_cell(cellAddress).c;
                  
                FindStr = '処理内容';
                cellAddress = xlsxUtil.searchRowForText(sheet,row,FindStr);
                if (!cellAddress) Errors.push('「'+FindStr+'」の列が存在しません:シート名['+SheetName+']');
                if (cellAddress) syori2.col_proc_cont = xlsx.utils.decode_cell(cellAddress).c;
                  
                //コメント、テスト観点、確認観点、何れかの名前をコメント列とする
                FindStr = 'コメント';
                cellAddress = xlsxUtil.searchRowForText(sheet,row,FindStr);
                if (cellAddress) syori2.col_comment = xlsx.utils.decode_cell(cellAddress).c;
                FindStr = 'テスト観点';
                cellAddress = xlsxUtil.searchRowForText(sheet,row,FindStr);
                if (cellAddress) syori2.col_comment = xlsx.utils.decode_cell(cellAddress).c;
                FindStr = '確認観点';
                cellAddress = xlsxUtil.searchRowForText(sheet,row,FindStr);
                if (cellAddress) syori2.col_comment = xlsx.utils.decode_cell(cellAddress).c;
                if (syori2.col_comment===0) Errors.push('「コメント」の列が存在しません:シート名['+SheetName+']');

                FindStr = '集計数';
                cellAddress = xlsxUtil.searchRowForText(sheet,row,FindStr);
                //集計数は省略可として扱う(実際の処理には不要なテスト数のカウントなので)
                //if (!cellAddress) Errors.push('「'+FindStr+'」の列が存在しません:シート名['+SheetName+']');
                if (cellAddress) syori2.col_sum = xlsx.utils.decode_cell(cellAddress).c;
                  
                FindStr = 'キーワード';
                cellAddress = xlsxUtil.searchRowForText(sheet,row,FindStr);
                if (!cellAddress) Errors.push('「'+FindStr+'」の列が存在しません:シート名['+SheetName+']');
                if (cellAddress) syori2.col_keyword = xlsx.utils.decode_cell(cellAddress).c;
                  
                FindStr = '値1';
                cellAddress = xlsxUtil.searchRowForText(sheet,row,FindStr);
                if (!cellAddress) Errors.push('「'+FindStr+'」の列が存在しません:シート名['+SheetName+']');
                if (cellAddress) syori2.col_value1 = xlsx.utils.decode_cell(cellAddress).c;
                  
                FindStr = '値2';
                cellAddress = xlsxUtil.searchRowForText(sheet,row,FindStr);
                if (!cellAddress) Errors.push('「'+FindStr+'」の列が存在しません:シート名['+SheetName+']');
                if (cellAddress) syori2.col_value2 = xlsx.utils.decode_cell(cellAddress).c;
                  
                FindStr = '値3';
                cellAddress = xlsxUtil.searchRowForText(sheet,row,FindStr);
                if (!cellAddress) Errors.push('「'+FindStr+'」の列が存在しません:シート名['+SheetName+']');
                if (cellAddress) syori2.col_value3 = xlsx.utils.decode_cell(cellAddress).c;
                  
                FindStr = '変数';
                cellAddress = xlsxUtil.searchRowForText(sheet,row,FindStr);
                if (!cellAddress) Errors.push('「'+FindStr+'」の列が存在しません:シート名['+SheetName+']');
                if (cellAddress) syori2.col_variable1 = xlsx.utils.decode_cell(cellAddress).c;
                  
                FindStr = '想定結果';
                cellAddress = xlsxUtil.searchRowForText(sheet,row,FindStr);
                if (!cellAddress) Errors.push('「'+FindStr+'」の列が存在しません:シート名['+SheetName+']');
                if (cellAddress) syori2.col_ass_result = xlsx.utils.decode_cell(cellAddress).c;
                  
                FindStr = '実施結果';
                cellAddress = xlsxUtil.searchRowForText(sheet,row,FindStr);
                if (!cellAddress) Errors.push('「'+FindStr+'」の列が存在しません:シート名['+SheetName+']');
                if (cellAddress) syori2.col_run_result = xlsx.utils.decode_cell(cellAddress).c;
                  
                FindStr = '想定相違';
                cellAddress = xlsxUtil.searchRowForText(sheet,row,FindStr);
                if (!cellAddress) Errors.push('「'+FindStr+'」の列が存在しません:シート名['+SheetName+']');
                if (cellAddress) syori2.col_ass_diff = xlsx.utils.decode_cell(cellAddress).c;
                  
                FindStr = '想定相違で停止';
                cellAddress = xlsxUtil.searchRowForText(sheet,row,FindStr);
                if (!cellAddress) Errors.push('「'+FindStr+'」の列が存在しません:シート名['+SheetName+']');
                if (cellAddress) syori2.col_ng_stop = xlsx.utils.decode_cell(cellAddress).c;
                  
                FindStr = '開始';
                cellAddress = xlsxUtil.searchRowForText(sheet,row,FindStr);
                if (!cellAddress) Errors.push('「'+FindStr+'」の列が存在しません:シート名['+SheetName+']');
                if (cellAddress) syori2.col_start_time = xlsx.utils.decode_cell(cellAddress).c;
                  
                FindStr = '終了';
                cellAddress = xlsxUtil.searchRowForText(sheet,row,FindStr);
                if (!cellAddress) Errors.push('「'+FindStr+'」の列が存在しません:シート名['+SheetName+']');
                if (cellAddress) syori2.col_end_time = xlsx.utils.decode_cell(cellAddress).c;
                  
                FindStr = '所要時間';
                cellAddress = xlsxUtil.searchRowForText(sheet,row,FindStr);
                if (!cellAddress) Errors.push('「'+FindStr+'」の列が存在しません:シート名['+SheetName+']');
                if (cellAddress) syori2.col_sum_time = xlsx.utils.decode_cell(cellAddress).c;
                  
                FindStr = 'ログ';
                cellAddress = xlsxUtil.searchRowForText(sheet,row,FindStr);
                if (!cellAddress) Errors.push('「'+FindStr+'」の列が存在しません:シート名['+SheetName+']');
                if (cellAddress) syori2.col_log = xlsx.utils.decode_cell(cellAddress).c;
                  
                //処理ケースを構造体に格納する
                let r = row3+1;
                let blankCount = 0;
                let s3_id = 1;
                while (blankCount < 20) {//20行以上の空白行が続いた場合、抜ける

                  //キーワードが空欄の行は無視
                  if (xlsxUtil.cellvalue(sheet,r,syori2.col_keyword) === '') {
                    blankCount++;
                    r++;
                    continue;
                  }
                  blankCount = 0;//中身が有るのでリセット

                  const syori3 = new Syori3();
                  syori3.step = comUtil.toNumberDef(xlsxUtil.cellvalue(sheet,r,syori2.col_step),0);
                  if (typeof syori2.syori3s[syori3.step] !== 'undefined') {
                    Errors.push('Stepの番号「'+syori3.step+'」が重複しています。:シート名['+SheetName+']');
                    r++;
                    continue;
                  }
                  syori2.syori3s[syori3.step] = syori3;
                  syori3.row = r;
                  syori3.proc_cont = xlsxUtil.cellvalue(sheet,r,syori2.col_proc_cont);
                  syori3.comment = xlsxUtil.cellvalue(sheet,r,syori2.col_comment);
                  if (syori2.col_sum !== 0){
                    syori3.sum = comUtil.toNumberDef(xlsxUtil.cellvalue(sheet,r,syori2.col_sum),0);
                  }
                  syori3.keyword = xlsxUtil.cellvalue(sheet,r,syori2.col_keyword);

                  // キーワードマスタ存在確認
                  const keywordExists  =  keywordCache.hasOwnProperty(syori3.keyword);
                  if (!keywordExists) {
                      Errors.push('キーワードマスタが存在しません。キーワード＝「' + syori3.keyword + '」。:シート名[' + SheetName + ']、Stepの番号「' + syori3.step + '」');
                  }

                  syori3.value1 = xlsxUtil.cellvalue(sheet,r,syori2.col_value1);
                  syori3.value2 = xlsxUtil.cellvalue(sheet,r,syori2.col_value2);
                  syori3.value3 = xlsxUtil.cellvalue(sheet,r,syori2.col_value3);
                  syori3.variable1 = xlsxUtil.cellvalue(sheet,r,syori2.col_variable1);
                  syori3.ass_result = xlsxUtil.cellvalue(sheet,r,syori2.col_ass_result);
                  syori3.ng_stop = (xlsxUtil.cellvalue(sheet,r,syori2.col_ng_stop).trim() !== '' &&  xlsxUtil.cellvalue(sheet,r,syori2.col_ng_stop).trim() !== '強制実行');
                  syori3.forced_run = xlsxUtil.cellvalue(sheet,r,syori2.col_ng_stop) === '強制実行';
                  syori3.run_result = xlsxUtil.cellvalue(sheet,r,syori2.col_run_result);
                  //syori3.log = xlsxUtil.cellvalue(sheet,r,syori2.col_log);//排出専用

                  syori3.s1_id = syori2.s1_id;
                  syori3.s2_id = syori2.s2_id;
                  syori3.modify_count = syori2.modify_count;
                  syori3.s3_id = s3_id;
                  r++;
                  s3_id++;
                }
                syori2.step_count = Object.keys(syori2.syori3s).length;
              }
            }

            //エラーを一括でテキスト化しダウンロードさせる
            if (Errors.length != 0 ){
              if (setIsLoading) setIsLoading(false);
              ErrorMSG('取込に失敗しました。「エラー.txt」を確認して下さい');
              const element = document.createElement('a');
              const file = new Blob([Errors.join('\n')], { type: 'text/plain' });
              element.href = URL.createObjectURL(file);
              element.download = 'エラー.txt';
              document.body.appendChild(element);
              element.click();
              document.body.removeChild(element);
              return false;
            }

            syori1.s_excel = s_excel;

          // formStateに反映
          setSyori1(prevState => ({ ...prevState, ...syori1 }));

          if (setFormState){
              setFormState(prevState => ({
                  ...prevState,
                  s1_id: { ...prevState.s1_id, value: syori1.s1_id },
                  s1_name: { ...prevState.s1_name, value: syori1.s1_name },
                  s_excel_filename: { ...prevState.s_excel_filename, value: syori1.s_excel_filename },
                  delflg: { ...prevState.delflg, value: syori1.delflg },
                }));
              }
          }

          resolve(true);
          
      } catch (error: any) {
        if (setIsLoading) setIsLoading(false);
        Swal.fire({
          title: 'Error!',
          text: error.stack,
          icon: 'error',
          confirmButtonText: 'OK'
        });
        resolve(true);
      }
    } 
    reader.onerror = () => {
      reject(false); 
    };

    reader.readAsArrayBuffer(s_excel);
  });
}

export default Load_s_excel;