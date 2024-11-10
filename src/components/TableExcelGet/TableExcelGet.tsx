import { faCloudArrowDown, faKey } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { API_URL } from '../../common/constants';
import styles from './TableExcelGet.module.css';

const EncryptScreen: React.FC = () => {
  const [inputTableName, setInputTableName] = useState('');
  const [inputDBIP, setInputDBIP] = useState('');
  const [inputDBPort, setInputDBPort] = useState('');
  const [inputDBName, setInputDBName] = useState('');
  const [inputDBID, setInputDBID] = useState('');
  const [inputDBPassword, setInputDBPassword] = useState('');
  const [inputschema, setinputschema] = useState('');
  const [includeData, setIncludeData] = useState(false);

  const handleEncrypt = async (event: { preventDefault: () => void; }) => {
    event.preventDefault(); // フォームのデフォルトの送信動作をキャンセル

    //API発行
    const data = {
      tableName: inputTableName,
      dbIP: inputDBIP,
      dbPort: inputDBPort,
      dbName: inputDBName,
      dbID: inputDBID,
      dbPassword: inputDBPassword,
      IsNeedData: includeData,
      schema:inputschema,
    };

    const url = API_URL+'/api/TableExcelGet';
    //「application/x-www-form-urlencoded」はURLエンコードした平文での送信
    await axios.post(url, JSON.stringify(data), { withCredentials: true, responseType: 'blob', headers: { 'content-type': 'application/json' } })

    .then(function (response) {

      //エラー発生時は抜ける
      if (response.data.return_code && response.data.return_code!=0){
        Swal.fire({
          title: 'Error!',
          text: response.data.msg,
          icon: 'error',
          confirmButtonText: 'OK'
        })
        return;
      }
      
      const blob = new Blob([response.data], { type: "application/octet-stream" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = inputTableName+'.xlsx' as string;
      a.click();
      a.remove();
      URL.revokeObjectURL(url); 
    })
    .catch(function (error) {
      // 送信失敗時
      Swal.fire({
        title: 'Error!',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'OK'
      })
    });


  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleEncrypt} className={styles.form}>
        <div className={styles.card}>
          <h1 className={styles.title}>テスト用エクセル生成</h1>

          <div className={styles.inputContainer}>
            <div className={styles.labelContainer}>
              <label htmlFor="inputTableName" className={styles.label}>
                テーブル名(半角)
              </label>
            </div>
            <div className={styles.inputRow}>
              <input
                id="inputTableName"
                className={styles.inputText}
                value={inputTableName}
                onChange={(e) => setInputTableName(e.target.value)}
                required={true} //
                />
                <div className={styles.buttonContainer}>
                  <button className={styles.encryptButton} type="submit">
                    <FontAwesomeIcon icon={faCloudArrowDown} className={styles.icon} />
                    <span>生成</span>
                  </button>
                </div>
              </div>


              <div className={styles.inputContainer}>
                <div className={styles.inputWithCheckbox}>
                    <label htmlFor="includeData" className={styles.label}>
                    データを含める
                    </label>
                    <input
                    type="checkbox"
                    id="includeData"
                    name="includeData"
                    checked={includeData}
                    onChange={(e) => setIncludeData(e.target.checked)}
                    className={styles.checkbox}
                    />
                </div>
                </div>



              <hr className={styles.separator} />
              <label className={styles.label}>
                ※以下は省略可
              </label>
            </div>
      
            <div className={styles.inputContainer}>
              <label htmlFor="inputDBIP" className={styles.label}>
                データベースIP(又はホスト名)  
              </label>
              <input
                id="inputDBIP"
                className={styles.inputText}
                value={inputDBIP}
                onChange={(e) => setInputDBIP(e.target.value)}
              />
            </div>
      
            <div className={styles.inputContainer}>
              <label htmlFor="inputDBPort" className={styles.label}>
                DBポート
              </label>
              <input
                id="inputDBPort"
                className={styles.inputText}
                value={inputDBPort}
                onChange={(e) => setInputDBPort(e.target.value)}
              />
            </div>
      
            <div className={styles.inputContainer}>
              <label htmlFor="inputDBName" className={styles.label}>
                DB名
              </label>
              <input
                id="inputDBName"
                className={styles.inputText}
                value={inputDBName}
                onChange={(e) => setInputDBName(e.target.value)}
              />
            </div>
      
            <div className={styles.inputContainer}>
              <label htmlFor="inputschema" className={styles.label}>
                スキーマ名
              </label>
              <input
                id="inputschema"
                className={styles.inputText}
                value={inputschema}
                onChange={(e) => setinputschema(e.target.value)}
              />
            </div>
      
            <div className={styles.inputContainer}>
              <label htmlFor="inputDBID" className={styles.label}>
                DBユーザID
              </label>
              <input
                id="inputDBID"
                className={styles.inputText}
                value={inputDBID}
                onChange={(e) => setInputDBID(e.target.value)}
              />
            </div>
      
            <div className={styles.inputContainer}>
              <label htmlFor="inputDBPassword" className={styles.label}>
                データベースパスワード(暗号化されたもの)
              </label>
              <input
                id="inputDBPassword"
                type="password"
                className={styles.inputText}
                value={inputDBPassword}
                onChange={(e) => setInputDBPassword(e.target.value)}
              />
            </div>
      
          </div>
        </form>
      </div>
      );
    };
    
    export default EncryptScreen;