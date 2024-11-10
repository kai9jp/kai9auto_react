import React, { useState, useEffect } from 'react';
import styles from './ToolBox.module.css';
import NumberInput from 'common/components/NumberInput';
import { OnChangeModel } from 'non_common/types/Form.types';
import Checkbox from 'common/components/Checkbox';

export type ToolBoxProps = {
    FindInterval:number;
    setFindInterval:any;
    setisUploadModalOpen:any;
    exec_Button:any;
    setS2_id:any;
    s2_id:any;
    isAutoBlink:any;
    handleAutoBlinkCheckboxChange:any;
}

const ToolBox = (props:ToolBoxProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 700, y: 70 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const startDragging = (e: React.MouseEvent<HTMLDivElement>) => {
    // ドラッグ開始位置のオフセットを記憶
    const handlerOffsetX = e.nativeEvent.offsetX + (e.currentTarget.getBoundingClientRect().left - position.x);
    setOffset({
      x: handlerOffsetX,  
      y: e.nativeEvent.offsetY
    });

    // ドラッグ中は、テキストの選択を無効にする
    document.body.style.userSelect = 'none';

    //ドラッグ中フラグをONにセット
    setIsDragging(true);
  };

  const stopDragging = () => {
    // ドラッグ終了時に、テキストの選択を有効に戻す
    document.body.style.userSelect = '';
    //ドラッグ中フラグをOFFに戻す
    setIsDragging(false);
  };

  const handleDragging = (e: MouseEvent) => {
    if (isDragging) {
      // ドラッグ中は、新しい位置を計算
      const x = e.clientX - offset.x;
      const y = e.clientY - offset.y;
      setPosition({ x, y });
    }
  };

  // 取込
  const impoort_Button = async ()  => {
    props.setisUploadModalOpen(true);    
  }

 // 取込ボタン
 const inputButton2 = (
    <button className={`btn btn-sm btn-success ${styles.Toolbtn}`}  onClick={() => impoort_Button()}>
      <span style={{ fontSize: '14px'}}>UP&実行</span>
      <i className="fas fa fa-upload" title="UP&実行"></i>
    </button>
  );
  // 実行ボタン
  const playButton2 = (
    <button className={`btn btn-sm btn-success ${styles.Toolbtn}`}  onClick={() => props.exec_Button()}>
      <span style={{ fontSize: '14px'}}>実行</span>
      <i className="fas fa fa-circle-play" title="実行"></i>
    </button>
  );

  useEffect(() => {
    // ドキュメント全体にmousemoveとmouseupのリスナーを追加
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleDragging(e);
      }
    };
    const handleMouseUp = () => {
      if (isDragging) {
        stopDragging();
        // ドラッグ停止時に位置をローカルストレージに保存
        localStorage.setItem('ToolBoxPosition', JSON.stringify(position));
      }
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    // クリーンアップ関数
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, offset,position]);

  useEffect(() => {
    // 初期位置をローカルストレージから読み込む
    const savedPosition = JSON.parse(localStorage.getItem('ToolBoxPosition') || '{"x": 700, "y": 70}');
    setPosition(savedPosition);
}, []);

  return (
    <div
      className={styles.toolbox}
      style={{ left: `${position.x}px`, top: `${position.y}px` }} 
    >
      <div className={styles.dragHandle} onMouseDown={startDragging}>
        {/* ドラッグハンドルの表示部分 */}
        Tool
        <br />
        Box
      </div>
      <div className={styles.content}>
        {/* ツールボックスのコンテンツ */}
        <div className={styles['text-left']} style={{ display: 'flex', alignItems: 'center',justifyContent: 'flex-start' }}>
              {/* 監視秒数の設定ボックス */}
              <label htmlFor="FindInterval" className={styles.numberInput_label}>監視:秒</label>
              <input
                  type="number"
                  id="FindInterval"
                  value={props.FindInterval}
                  className={styles.numberInput}
                  max={60}
                  min={1}
                  onChange={(event) => props.setFindInterval(Number(event.target.value))}
                      // rendドラッグ機能で移動されてしまう事象を回避
                      onMouseDown={(event) => {
                      event.stopPropagation();
                  }}
              />

              {/* セパレータ */}
              <div className={styles.separator}></div>              

              {/* 実行ボタン */}
              {playButton2}
              {/* 処理NO2指定ボックス */}
              <label htmlFor="inputDBID" className={styles.label}>
                処理No2
              </label>
              <input
                id="s2_id"
                className={styles.inputText}
                value={props.s2_id}
                onChange={(e) => props.setS2_id(e.target.value)}
                // rendドラッグ機能で移動されてしまう事象を回避
                onMouseDown={(event: { stopPropagation: () => void; }) => {
                  event.stopPropagation();
                }}                            
              />

              {/* セパレータ */}
              <div className={styles.separator}></div>              

              {/* UP&実行ボタン */}
              {inputButton2}

              {/* セパレータ */}
              <div className={styles.separator2}></div>              

              {/* 同一処理自動更新 */}
              <div className={styles.checkbox_container}>
                <input
                  type="checkbox"
                  id="autoBlinkCheckbox"
                  checked={props.isAutoBlink}
                  onChange={props.handleAutoBlinkCheckboxChange}
                  className="form-check-input"
                />
                <label htmlFor="autoBlinkCheckbox" className={styles.checkbox_label}>
                  同一処理自動更新
                </label>
              </div>

        </div>
      </div>
    </div>
  );

};

export default ToolBox;
