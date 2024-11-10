import React, { useState, useEffect, Fragment } from 'react';
import styles from './SchedulerList.module.css';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import Scheduler from './Scheduler';
import Modal from 'react-modal';

// Modalのルート要素を指定
Modal.setAppElement('#root');

interface Scheduler {
  schedule_label: string;
}

interface SchedulerListProps {
  schedulers: string;
  onChange: (value: string) => void; 
}

const SchedulerList: React.FC<SchedulerListProps> = ({ schedulers,onChange }) => {
  const [parsedSchedulers, setParsedSchedulers] = useState<Scheduler[]>([]);
  const [isSchedulerModalOpen, setIsSchedulerModalOpen] = useState(false);
  const [currentSchedulerIndex, setCurrentSchedulerIndex] = useState<number | null>(null);
  const [scheduleLabel, setScheduleLabel] = useState<string>('');

  useEffect(() => {
    if (!schedulers.trim()) return; // 空文字の場合、何もせずに終了
  
    const parsedList = schedulers
      .split('\n')
      .map((label) => ({ schedule_label: label.trim() }));
    setParsedSchedulers(parsedList);
  }, [schedulers]);

  // スケジュールの追加・編集の保存処理
  const saveScheduler = (newLabel: string) => {
    const updatedSchedulers = currentSchedulerIndex !== null
    ? parsedSchedulers.map((scheduler, index) =>
        index === currentSchedulerIndex ? { schedule_label: newLabel } : scheduler
      )
    : [...parsedSchedulers, { schedule_label: newLabel }];

    setParsedSchedulers(updatedSchedulers);

    // 全ての schedule_label を改行コードで結合して onChange を呼び出す
    const concatenatedLabels = updatedSchedulers.map(s => s.schedule_label).join('\n');
    onChange(concatenatedLabels);    
  };

  // 削除時の確認ポップアップ
  const handleDeleteScheduler = (index: number) => {
    Swal.fire({
      title: '本当に削除しますか？',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'はい',
      cancelButtonText: 'いいえ',
    }).then((result) => {
      if (result.isConfirmed) {
        setParsedSchedulers((prev) => {
          const updatedSchedulers = prev.filter((_, i) => i !== index);
          
          // 全ての schedule_label を改行コードで結合して onChange を呼び出す
          const concatenatedLabels = updatedSchedulers.map(s => s.schedule_label).join('\n');
          onChange(concatenatedLabels);
          
          return updatedSchedulers;
        });
      }
    });
  };

  // 追加・変更モーダルを開く
  const openSchedulerModal = (index: number | null = null) => {
    if (index !== null) {
      setScheduleLabel(parsedSchedulers[index].schedule_label);
      setCurrentSchedulerIndex(index);
    } else {
      setScheduleLabel('');
      setCurrentSchedulerIndex(null);
    }
    setIsSchedulerModalOpen(true);
  };

  // モーダルを閉じる
  const closeSchedulerModal = () => {
    setIsSchedulerModalOpen(false);
  };

  return (
    <Fragment>
      <div className={styles.container}>
        <div className={styles.title}>
          スケジュール設定
          <FaPlus className={styles.addIcon} onClick={() => openSchedulerModal()} title="追加" />
        </div>
        <table className={styles.table}>
          <tbody>
            {parsedSchedulers.map((scheduler, index) => (
              <tr key={index} className={styles.row}>
                <td>{scheduler.schedule_label}</td>
                <td className={styles.iconContainer}>
                  <FaEdit
                    className={styles.icon}
                    onClick={() => openSchedulerModal(index)}
                    title="編集"
                  />
                  <FaTrash
                    className={styles.icon}
                    onClick={() => handleDeleteScheduler(index)}
                    title="削除"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Schedulerモーダル */}
      {(isSchedulerModalOpen? 
        <Scheduler scheduleLabel={scheduleLabel}  onClose = {closeSchedulerModal} setScheduleLabel={saveScheduler} ></Scheduler>
        : null
      )}

    </Fragment>
  );
};

export default SchedulerList;
