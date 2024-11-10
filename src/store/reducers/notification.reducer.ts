import { IActionBase, INotificationState } from "../models/root.interface";
import { ADD_NOTIFICATION, REMOVE_NOTIFICATION, REMOVE_NOTIFICATION_PRE } from "../actions/notifications.action";

// 初期状態の定義
const initialState: INotificationState = {
    notifications: []
};

// 通知の状態を管理するリデューサー関数
function notificationReducer(state: INotificationState = initialState, action: IActionBase): INotificationState {
    switch (action.type) {
        // 通知を追加するアクション
        case ADD_NOTIFICATION: {
            // 現在の通知リストから最大のIDを取得
            let maxId: number = Math.max.apply(Math, state.notifications.map(o => o.id));
            if (maxId === -Infinity) { maxId = 0; } // 通知が存在しない場合はIDを0に設定
            // 新しい通知アイテムを作成
            let newItem = {
                id: maxId + 1, // 新しいIDは最大IDの次の番号
                date: new Date(), // 現在の日付
                title: action.title, // アクションからのタイトル
                text: action.text // アクションからのテキスト
            };
            // 新しい通知を追加して新しい状態を返す
            return { ...state, notifications: [...state.notifications, newItem] };
        }
        // 通知を削除するアクション
        case REMOVE_NOTIFICATION: {
            // 指定されたIDの通知をリストから削除
            return { ...state, notifications: state.notifications
                .filter(Notification => Notification.id !== action.id) };
        }
        // 最新の通知を削除するアクション
        case REMOVE_NOTIFICATION_PRE: {
            // 現在の通知リストから最大のIDを取得
            let maxId: number = Math.max.apply(Math, state.notifications.map(o => o.id));
            // 最大IDを持つ通知をリストから削除
            return { ...state, notifications: state.notifications
                .filter(Notification => Notification.id !== maxId) };
        }
        // デフォルトの状態を返す
        default:
            return state;
    }
}

export default notificationReducer;
