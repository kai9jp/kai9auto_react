import { faKey } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { callApi } from '../../common/comUtil';
import styles from './EncryptScreen.module.css';

const EncryptScreen: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [encryptedText, setEncryptedText] = useState('');

  const handleEncrypt = async () => {
    //API発行
    const data = {inputText: inputText};
    const response = await callApi('encrypt', JSON.stringify(data),'application/json');
    if (response){
        setEncryptedText(response.data.outputText);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>暗号化ツール</h1>
        <div className={styles.inputContainer}>
          <label htmlFor="inputText" className={styles.label}>
            テキストを入力してください
          </label>
          <textarea
            id="inputText"
            className={styles.inputText}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
        </div>
        <button className={styles.encryptButton} onClick={handleEncrypt}>
            <FontAwesomeIcon icon={faKey} className={styles.icon} />
            <span>暗号化</span>
        </button>
      </div>
      <div className={styles.card}>
        <label htmlFor="outputText" className={styles.label}>
          暗号化されたテキスト
        </label>
        <textarea
          id="outputText"
          className={styles.outputText}
          value={encryptedText}
          readOnly
        />
      </div>
    </div>
  );
};

export default EncryptScreen;