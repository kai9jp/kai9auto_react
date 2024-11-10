import React, { useEffect, useState } from 'react';
import styles from "./Scheduler.module.css";
import { defaultScheduler, IScheduler, schedulePatternOptions, weekdaysOptions, weeksNumberOptions } from "../../store/models/scheduler.interface";
import Modal from 'react-modal';
import Swal from 'sweetalert2';

interface SchedulerProps {
  scheduleLabel?: string; // ラベルのみを受け取るように変更
  setScheduleLabel: (scheduleLabel: string) => void;
  onClose: () => void;
}

const Scheduler: React.FC<SchedulerProps> = ({
  scheduleLabel,
  setScheduleLabel,
  onClose
}) => {

  const [localScheduler, setLocalScheduler] = useState<IScheduler>(defaultScheduler);
  const [isRecurringEnabled, setIsRecurringEnabled] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false); // 初期化完了フラグ

  // スケジュールラベルを生成する関数
  const generateScheduleLabel = () => {
    let label = '';

    // 時間のフォーマット
    const [hours, minutes] = localScheduler.execution_time.split(':');
    const formattedTime = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;

    const [recurringHours, recurringMinutes] = localScheduler.recurring_end_time.split(':');
    const recurrinFormattedTime = `${recurringHours.padStart(2, '0')}:${recurringMinutes.padStart(2, '0')}`;

    // 繰り返し
    let labelRecurring = '';
    if (isRecurringEnabled){
      if (localScheduler.recurring_interval >= 1){
        if (recurrinFormattedTime !== "00:00"){
          labelRecurring = " " + recurrinFormattedTime + "まで";
        }
        labelRecurring = "[" + localScheduler.recurring_interval + "分間隔" + labelRecurring + "]";
      }
    }

    // スケジュールパターンに応じたラベル生成
    switch (localScheduler.schedule_pattern) {
      case '毎日':
        label = `毎日 ${formattedTime}`;
        break;
      case '毎週':
        label = `毎週 ${localScheduler.weekdays} ${formattedTime}`;
        break;
      case '毎月':
        label = `毎月 ${localScheduler.execution_day}日 ${formattedTime}`;
        break;
      case '毎月(月末)':
        label = `毎月(月末)から ${localScheduler.month_end_n_days_ago}日前 ${formattedTime}`;
        break;
      case '第N曜日':
        label = `${localScheduler.weeks_number} ${localScheduler.weekdays} ${formattedTime}`;
        break;
      default:
        label = `${formattedTime}`;
        break;
    }

    // 繰り返しの情報を追加
    label = label + labelRecurring;

    setLocalScheduler({ ...localScheduler, schedule_label: label });
  };

  // スケジュールラベルを解析して`localScheduler`に反映する関数
  const parseScheduleLabel = (label: string): IScheduler => {
    const scheduler = { ...defaultScheduler };

    try {
      scheduler.schedule_label = label;

      // 繰り返し制御の解析
      const recurringMatch = label.match(/\[(\d+)分間隔\s?(\d{2}:\d{2})?(まで)?\]/);      
      if (recurringMatch) {
        scheduler.recurring_interval = parseInt(recurringMatch[1], 10);
        scheduler.recurring_end_time = recurringMatch[2] || "00:00";
        label = label.replace(recurringMatch[0], "").trim(); // 繰り返し制御部分をラベルから除去
        setIsRecurringEnabled(true);
      }else{
        setIsRecurringEnabled(false);
      }

      // スケジュールパターンごとのラベル解析
      if (label.startsWith("毎日")) {
        scheduler.schedule_pattern = "毎日";
        scheduler.execution_time = label.match(/\d{2}:\d{2}/)?.[0] || "00:00";
      } else if (label.startsWith("毎週")) {
        scheduler.schedule_pattern = "毎週";
        const [weekdays, time] = label.replace("毎週 ", "").split(" ");
        scheduler.weekdays = weekdays;
        scheduler.execution_time = time;
      } else if (label.startsWith("毎月 ") && label.includes("日")) {
        scheduler.schedule_pattern = "毎月";
        scheduler.execution_day = parseInt(label.match(/\d+/)?.[0] || "1");
        scheduler.execution_time = label.match(/\d{2}:\d{2}/)?.[0] || "00:00";
      } else if (label.startsWith("毎月(月末)")) {
        scheduler.schedule_pattern = "毎月(月末)";
        scheduler.month_end_n_days_ago = parseInt(label.match(/\d+/)?.[0] || "0");
        scheduler.execution_time = label.match(/\d{2}:\d{2}/)?.[0] || "00:00";
      } else if (label.startsWith("第")) {
        scheduler.schedule_pattern = "第N曜日";
        // 週番号をコンマ区切り文字列に変換
        const weeksWithDay = label.split(" ")[0];
        scheduler.weeks_number = weeksWithDay
          .split(",")
          .map(item => item.match(/^第\d+/)?.[0] ?? "")
          .join(",");  // 配列を文字列に変換
        // 曜日部分をコンマ区切り文字列に変換
        const weekdaysPart = label.split(" ")[1];
        scheduler.weekdays = weekdaysPart
          ? weekdaysPart.split(",").map(day => day.replace("曜日", "")).join(",")
          : "";
        // 時間を設定
        scheduler.execution_time = label.split(" ")[2] ?? "";
      } else {
        throw new Error("不正なラベル形式");
      }

      // ラベル解析が成功した場合、解析されたスケジュールを返す
      return scheduler;

    } catch (error) {
      // ラベルが不正だった場合、エラーメッセージを表示し、デフォルト値に戻す
      Swal.fire({
        title: 'エラー',
        text: 'スケジュールラベルに不正な形式が含まれています。デフォルトのスケジュールにリセットします。',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return defaultScheduler;
    }
  };

  // 曜日を更新する関数
  const handleWeekdayChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    const selectedWeekdays = localScheduler.weekdays ? localScheduler.weekdays.split(',') : [];

    // 曜日を追加または削除
    const updatedWeekdays = checked
      ? [...selectedWeekdays, value]
      : selectedWeekdays.filter((day: string) => day !== value);

    // インターフェースの定義から曜日の順序を取得
    const weekdayOrder = weekdaysOptions.map((option) => option.value);

    // 曜日をソートする
    const sortedWeekdays = updatedWeekdays.sort((a, b) => {
      return weekdayOrder.indexOf(a) - weekdayOrder.indexOf(b);
    });

    // ローカルの状態に反映
    setLocalScheduler({ ...localScheduler, weekdays: sortedWeekdays.join(',') });
  };

  // 週番号を更新する関数
  const handleWeeksNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    const selectedWeeksNumbers = localScheduler.weeks_number ? localScheduler.weeks_number.split(',') : [];

    // 週番号を追加または削除
    const updatedWeeksNumber = checked
      ? [...selectedWeeksNumbers, value]
      : selectedWeeksNumbers.filter((week: string) => week !== value);

    // インターフェースの定義から週番号の順序を取得
    const weeksNumberOrder = weeksNumberOptions.map((option) => option.value);

    // 週番号をソートする
    const sortedWeeksNumbers = updatedWeeksNumber.sort((a, b) => {
      return weeksNumberOrder.indexOf(a) - weeksNumberOrder.indexOf(b);
    });

    // ローカルの状態に反映
    setLocalScheduler({ ...localScheduler, weeks_number: sortedWeeksNumbers.join(',') });
  };

  // 繰り返し間隔を変更するハンドラー
  const handleRecurring_intervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (localScheduler){
      const value = e.target.value;
      // 正の整数かどうかをチェックし、範囲を0〜2880(60分×48時間)に制限
      if (/^\d+$/.test(value) && Number(value) >= 0 && Number(value) <= 2880) {
        setLocalScheduler({ ...localScheduler, recurring_interval: Number(value) });
      } else {
        // 無効な値の場合、既存の値をそのまま保持する
        e.preventDefault();
      }
    }
  };

  // 繰り返し終了時間の時間部分を変更するハンドラー
  const handleRecurringEndTimeHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (localScheduler){
      const value = e.target.value;
      // 正の整数かどうかをチェックし、範囲を0〜48に制限
      if (/^\d+$/.test(value) && Number(value) >= 0 && Number(value) <= 48) {
        setLocalScheduler({ ...localScheduler, recurring_end_time: `${value}:${localScheduler.recurring_end_time.split(':')[1]}` });
      } else {
        // 無効な値の場合、既存の値をそのまま保持する
        e.preventDefault();
      }
    }
  };

  // 繰り返し終了時間の分部分を変更するハンドラー
  const handleRecurringEndTimeMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (localScheduler){
      const value = e.target.value;
      // 正の整数かどうかをチェックし、範囲を0〜59に制限
      if (/^\d+$/.test(value) && Number(value) >= 0 && Number(value) <= 59) {
        setLocalScheduler({ ...localScheduler, recurring_end_time: `${localScheduler.recurring_end_time.split(':')[0]}:${value}` });
      } else {
        // 無効な値の場合、既存の値をそのまま保持する
        e.preventDefault();
      }
    }
  };

  // 実行時刻の時間部分を変更するハンドラー
  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (localScheduler){
      const value = e.target.value;
      // 正の整数かどうかをチェックし、範囲を0〜48に制限
      if (/^\d+$/.test(value) && Number(value) >= 0 && Number(value) <= 48) {
        setLocalScheduler({ ...localScheduler, execution_time: `${value}:${localScheduler.execution_time.split(':')[1]}` });
      } else {
        // 無効な値の場合、既存の値をそのまま保持する
        e.preventDefault();
      }
    }
  };

  // 実行時刻の分部分を変更するハンドラー
  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (localScheduler){
      const value = e.target.value;
      // 正の整数かどうかをチェックし、範囲を0〜59に制限
      if (/^\d+$/.test(value) && Number(value) >= 0 && Number(value) <= 59) {
        setLocalScheduler({ ...localScheduler, execution_time: `${localScheduler.execution_time.split(':')[0]}:${value}` });
      } else {
        // 無効な値の場合、既存の値をそのまま保持する
        e.preventDefault();
      }
    }
  };

  // 実行日の変更ハンドラー
  const handleExecutionDayChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // 正の整数かどうかをチェックし、範囲を1〜31に制限
    if (/^\d+$/.test(value) && Number(value) >= 1 && Number(value) <= 31) {
      setLocalScheduler({ ...localScheduler, execution_day: Number(value) });
    } else {
      // 無効な値の場合、既存の値をそのまま保持する
      event.preventDefault();
    }
  };

  // 月末N日前の変更ハンドラー
  const handleMonth_end_n_days_agoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // 正の整数かどうかをチェックし、範囲を1〜31に制限
    if (/^\d+$/.test(value) && Number(value) >= 1 && Number(value) <= 31) {
      setLocalScheduler({ ...localScheduler, month_end_n_days_ago: Number(value) });
    } else {
      // 無効な値の場合、既存の値をそのまま保持する
      event.preventDefault();
    }
  };

  // OKボタン押下時の処理
  const handleSubmit = (): boolean => {
    let updatedScheduler = { ...localScheduler };

    // 入力チェック
    let errorMsg = '';
    if (updatedScheduler.schedule_pattern === '毎週') {
      if (!updatedScheduler.weekdays || updatedScheduler.weekdays.trim() === '') {
        errorMsg = '曜日が選択されていません。';
      }
    } else if (updatedScheduler.schedule_pattern === '毎月') {
      if (!updatedScheduler.execution_day || updatedScheduler.execution_day === 0) {
        errorMsg = '日付が未入力です。';
      }
    } else if (updatedScheduler.schedule_pattern === '第N曜日') {
      if (!updatedScheduler.weeks_number || updatedScheduler.weeks_number.trim() === '') {
        errorMsg = '週番号が選択されていません。';
      } else if (!updatedScheduler.weekdays || updatedScheduler.weekdays.trim() === '') {
        errorMsg = '曜日が選択されていません。';
      }
    }
    // エラーメッセージがある場合、登録を中断
    if (errorMsg) {
      Swal.fire({
        title: 'Error!',
        html: errorMsg.replace(/\n/g, '<br><br>'), 
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return false;  
    }

    // 時間のフォーマットを2桁に統一
    const [hours, minutes] = updatedScheduler.execution_time.split(':');
    const formattedHours = hours.padStart(2, '0'); // 1桁なら先頭に0を追加
    const formattedMinutes = minutes.padStart(2, '0'); // 1桁なら先頭に0を追加
    updatedScheduler.execution_time = `${formattedHours}:${formattedMinutes}`;

    const [recurringHours, recurringMinutes] = localScheduler.recurring_end_time.split(':');
    const formattedRecurringHours = recurringHours.padStart(2, '0'); // 1桁なら先頭に0を追加
    const formattedRecurringMinutes = recurringMinutes.padStart(2, '0'); // 1桁なら先頭に0を追加
    updatedScheduler.recurring_end_time = `${formattedRecurringHours}:${formattedRecurringMinutes}`;

    // 繰り返しが未チェックの場合は値をクリア
    if (!isRecurringEnabled){
      updatedScheduler.recurring_end_time = "00:00";
      updatedScheduler.recurring_interval = 0;
    }

    // スケジュールパターンに応じて不要なフィールドをクリア
    switch (updatedScheduler.schedule_pattern) {
      case '毎日':
        updatedScheduler.weekdays = ''; // 毎日の場合、曜日情報をクリア
        updatedScheduler.weeks_number = ''; // 週番号も不要
        updatedScheduler.execution_day = 0; // 日付
        updatedScheduler.month_end_n_days_ago = 0; // 月末
        break;
      case '毎週':
        updatedScheduler.weeks_number = ''; // 毎週の場合、週番号は不要
        updatedScheduler.execution_day = 0; // 日付
        updatedScheduler.month_end_n_days_ago = 0; // 月末
        break;
      case '毎月':
        updatedScheduler.weekdays = ''; // 毎月の場合、曜日情報をクリア
        updatedScheduler.weeks_number = ''; // 週番号もクリア
        updatedScheduler.month_end_n_days_ago = 0; // 月末
        break;
      case '毎月(月末)':
        updatedScheduler.weekdays = ''; // 毎月(月末)の場合、曜日情報をクリア
        updatedScheduler.weeks_number = ''; // 週番号もクリア
        updatedScheduler.execution_day = 0; // 日付
        break;
      case '第N曜日':
        // 第N曜日の場合は、全ての情報を保持
        updatedScheduler.execution_day = 0; // 日付
        updatedScheduler.month_end_n_days_ago = 0; // 月末
        break;
      default:
        break;
    }

    setLocalScheduler(updatedScheduler);

    // 更新されたスケジュール情報を親コンポーネントに渡す
    setScheduleLabel(localScheduler.schedule_label || ""); 

    // モーダルを閉じる
    onClose();

    return true;
  };

  // 初回ロード時にスケジュールラベルを解析して`localScheduler`にセット
  useEffect(() => {
    if (!isInitialized) { // 初回のみ実行
      if (scheduleLabel){
        const parsedScheduler = parseScheduleLabel(scheduleLabel);
        setLocalScheduler(parsedScheduler);
      }
      setIsInitialized(true); 
    }
  }, [scheduleLabel, isInitialized]);

  // スケジュールの変更時にラベルを生成
  useEffect(() => {
    if (isInitialized) { // 初期化後のみ実行
      generateScheduleLabel();
    }
  }, [localScheduler, isInitialized]);

  // OKボタン押下時にスケジュールを保存
  const handleSave = () => {
    handleSubmit();
  };  

  return (
    <Modal isOpen={true} className={`${styles.ReactModal__Content} center-modal`} overlayClassName={styles.ReactModal__Overlay}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.titles}>
            <div className={styles.title}>スケジュール設定</div>

            {/* スケジュールラベルの表示 */}
            <div className={styles.scheduleLabelBox}>
              -- {localScheduler.schedule_label} --
            </div>
          </div>
          <div className={styles.buttons}>
            <button onClick={handleSave} className="btn btn-primary">OK</button>
            <button onClick={onClose} className="btn btn-secondary">キャンセル</button>
          </div>
        </div>
        <div className={styles.body}>

          {/* 時間の指定（全てのパターンで必須） */}
          <div className={styles.formGroup}>
            <label htmlFor="customTime" className={styles.label}>実行時刻 (48時間形式):</label>
            <div className={styles.timeInputGroup}>
              <input
                type="number"
                id="customHours"
                className={styles.input}
                value={localScheduler.execution_time.split(':')[0]}
                onChange={handleHoursChange}
              />
              　:　
              <input
                type="number"
                id="customMinutes"
                className={styles.input}
                value={localScheduler.execution_time.split(':')[1]}
                onChange={handleMinutesChange}
                maxLength={2}
              />
            </div>
          </div>

          <div className={styles.checkBoxContainer} 
            // チェックボックスとの間に余白を追加(チェックONの時とOFFで値を変える)
            style={{ marginBottom: isRecurringEnabled ? '-15px' : '5px' }}
          >
            <label className={styles.label}>
              <input
                type="checkbox"
                id="recurringControlCheckBox"
                checked={isRecurringEnabled}
                onChange={(e) => setIsRecurringEnabled(e.target.checked)}
                className={styles.checkbox}
              />
              繰り返し制御をする
            </label>
          </div>

          {/* 繰り返し制御をする場合だけ表示 */}
          {isRecurringEnabled && (
            <div className={styles.recurringTimeContainer}>
              {/* 繰り返し間隔 (分) コンテナ */}
              <div className={styles.RecurringIntervalContainer}>
                <label htmlFor="recurring_interval" className={styles.label}>繰り返し間隔 (分):</label>
                <input
                  type="number"
                  id="recurring_interval"
                  className={styles.inputRecurringInterval}
                  value={localScheduler.recurring_interval}
                  max={2880}
                  onChange={handleRecurring_intervalChange}
                  disabled={!isRecurringEnabled}
                />
              </div>

              {/* 繰り返し終了時間 (48時間形式) コンテナ */}
              <div className={styles.RecurringEndTimeContainer}>
                <label htmlFor="customRecurringEndTimeHours" className={styles.label}>繰り返し終了時間 (48時間形式):</label>
                <div className={styles.timeInputGroup}>
                  <input
                    type="number"
                    id="customRecurringEndTimeHours"
                    className={styles.input}
                    value={localScheduler.recurring_end_time.split(':')[0]}
                    onChange={handleRecurringEndTimeHoursChange}
                    disabled={!isRecurringEnabled}
                  />
                  　:　
                  <input
                    type="number"
                    id="customRecurringEndTimeMinutes"
                    className={styles.input}
                    value={localScheduler.recurring_end_time.split(':')[1]}
                    onChange={handleRecurringEndTimeMinutesChange}
                    maxLength={2}
                    disabled={!isRecurringEnabled}
                  />
                </div>
              </div>
            </div>
          )}

          <div className={styles.formGroup}>
            <label className={styles.label}>パターン:</label>
            <div className={styles.radioGroup}>
              {schedulePatternOptions.map((option: { label: string; value: string }) => (
                <label key={option.value} className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="schedulePattern"
                    value={option.value}
                    checked={localScheduler.schedule_pattern === option.value}
                    onChange={(e) => setLocalScheduler({ ...localScheduler, schedule_pattern: e.target.value })}
                    className={styles.radioInput}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>

          {/* 毎週スケジュールの設定 */}
          {localScheduler.schedule_pattern === "毎週" && (
            <div className={styles.formGroup}>
              <label className={styles.label}>曜日:</label>
              <div className={styles.checkboxContainerHorizontal}>
                {weekdaysOptions.map((day: { label: string; value: string }) => (
                  <div key={day.value} className={styles.weekdayCheckbox}>
                    <label>
                      <input
                        type="checkbox"
                        value={day.value}
                        checked={localScheduler.weekdays.split(',').includes(day.value)}
                        onChange={handleWeekdayChange}
                        className={styles.checkbox}
                      />
                      {day.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 毎月スケジュールの設定 */}
          {localScheduler.schedule_pattern === "毎月" && (
            <div className={styles.formGroup}>
              <label htmlFor="executionDay" className={styles.label}>実行日（1～31）:</label>
              <input
                type="number"
                id="executionDay"
                className={styles.input}
                min="1"
                max="31"
                value={localScheduler.execution_day}
                onChange={handleExecutionDayChange}
              />
            </div>
          )}

          {/* 毎月(月末)スケジュールの設定 */}
          {localScheduler.schedule_pattern === "毎月(月末)" && (
            <div className={styles.formGroup}>
              <label htmlFor="executionDay" className={styles.label}>月末からN日前（0～31）:</label>
              <input
                type="number"
                id="month_end_n_days_ago"
                className={styles.input}
                min="1"
                max="31"
                value={localScheduler.month_end_n_days_ago}
                onChange={handleMonth_end_n_days_agoChange}
              />
            </div>
          )}

          {/* 特定の週の曜日設定 */}
          {localScheduler.schedule_pattern === "第N曜日" && (
            <div className={styles.formGroup}>
              <label className={styles.label}>週番号:</label>
              <div className={styles.checkboxContainerHorizontal}>
                {weeksNumberOptions.map((week: { label: string; value: string }) => (
                  <label key={week.value} className={styles.radioLabel}>
                    <input
                      type="checkbox"
                      name="weeksNumber"
                      value={week.value}
                      checked={localScheduler.weeks_number.split(',').includes(week.value)}
                      onChange={handleWeeksNumberChange}
                      className={styles.checkbox}
                    />
                    {week.label}
                  </label>
                ))}
              </div>
              <label className={styles.label}>曜日:</label>
              <div className={styles.checkboxContainerHorizontal}>
                {weekdaysOptions.map((day: { label: string; value: string }) => (
                  <div key={day.value} className={styles.weekdayCheckbox}>
                    <label>
                      <input
                        type="checkbox"
                        value={day.value}
                        checked={localScheduler.weekdays.split(',').includes(day.value)}
                        onChange={handleWeekdayChange}
                        className={styles.checkbox}
                      />
                      {day.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default Scheduler;
