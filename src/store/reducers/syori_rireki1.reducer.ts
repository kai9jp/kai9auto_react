import { ISyori_rireki1State,IActionBase, IStateType } from "../models/root.interface";
import { ADD_SYORI_RIREKI1, CHANGE_SYORI_RIREKI1_PENDING_EDIT, EDIT_SYORI_RIREKI1, REMOVE_SYORI_RIREKI1,
    CLEAR_SYORI_RIREKI1_PENDING_EDIT, SET_SYORI_RIREKI1_MODIFICATION_STATE,SET_SYORI_RIREKI1_ALL_COUNT,
    CLEAR_SYORI_RIREKI1,REMOVE_DIFF_S1_ID_S_COUNTS,
    ADD_SYORI_RIREKI1_HISTORY,CLEAR_SYORI_RIREKI1_HISTORY, UPDATE_SYORI_RIREKI1S, SETISSCROLLEDTOBOTTOM, CHANGE_SYORI_RIREKI2_PENDING_EDIT, CLEAR_SYORI_RIREKI2_PENDING_EDIT, CHANGE_SYORI_RIREKI3_PENDING_EDIT, CLEAR_SYORI_RIREKI3_PENDING_EDIT, SET_SYORI_RIREKI1_MODIFICATION_STATE2, SET_SYORI_RIREKI1_MODIFICATION_STATE3} from "../actions/syori_rireki1.action";
import { ISyori_rireki1, Syori_rireki1ModificationStatus, Syori_rireki1_diff } from "../models/syori_rireki1.interface";
import { ISyori_rireki2 } from "store/models/syori_rireki2.interface";

const initialState: ISyori_rireki1State = {
    Syori_rireki1s: [],
    selectedSyori_rireki1: null,
    selectedSyori_rireki2: null,
    selectedSyori_rireki3: null,
    modificationState: Syori_rireki1ModificationStatus.None,
    modificationState2: Syori_rireki1ModificationStatus.detail,
    modificationState3: Syori_rireki1ModificationStatus.detail,
    IsFirst: false,
    all_count: 0,
    Syori_rireki1Historys: [],
    sr1_diff:[],
    isScrolledToBottom: false,
};

function syori_rireki1Reducer(state: ISyori_rireki1State = initialState, action: IActionBase): ISyori_rireki1State {
    
    switch (action.type) {
        case SET_SYORI_RIREKI1_MODIFICATION_STATE: {
            return { ...state, modificationState: action.value };
        }
        case SET_SYORI_RIREKI1_MODIFICATION_STATE2: {
            return { ...state, modificationState2: action.value };
        }
        case SET_SYORI_RIREKI1_MODIFICATION_STATE3: {
            return { ...state, modificationState3: action.value };
        }
        case CLEAR_SYORI_RIREKI1: {
            let syori_rireki1s: ISyori_rireki1[] = state.Syori_rireki1s;
            syori_rireki1s = [];
            return { ...state, Syori_rireki1s: syori_rireki1s };
        }

        case UPDATE_SYORI_RIREKI1S: {
            // 新しい差分を保存するための配列
            // let updatedDiff_sr1 = [...state.sr1_diff];
            let updatedSelectedSyoriRireki1 = state.selectedSyori_rireki1;
            let updatedSelectedSyoriRireki2 = state.selectedSyori_rireki2;

            //3秒以上経過した差異情報を除いた上、コピー(点滅済のゴミが残るのを予防)
            const now = new Date();
            let updatedDiff_sr1 = state.sr1_diff.filter((item) => { //filter関数は、trueを返す要素だけが新しい配列に含まれる
              const diffInSeconds = (now.getTime() - item.find_time.getTime()) / 1000;
              return diffInSeconds < 3;
            });
            
            //1ページ目を表示している場合、差異行を強調表示(3秒点滅)する
            if (action.CurrentPage == 1){
                // 差異件数をカウント
                let diffCount = 0;
                action.Syori_rireki1s.forEach((newItem: ISyori_rireki1) => {
                    const isPresent = state.Syori_rireki1s.some(
                        (existingItem) =>
                        existingItem.s1_id === newItem.s1_id &&
                        existingItem.s_count === newItem.s_count
                    );
                    if (!isPresent) {
                        diffCount++;
                    }
                });
            
                // 差異が条件を満たす場合、処理を実行
                //・初回検索時ではない事(state.Syori_rireki1s.lengthが0でない事)
                //・ページ送りした直後の検索時ではない事(全件差異でない事)
                if (diffCount　!=0 && diffCount != action.Syori_rireki1s.length && state.Syori_rireki1s.length != 0) {
                    updatedDiff_sr1 = [];//差異をリセット
                    action.Syori_rireki1s.forEach((newItem: ISyori_rireki1) => {
                        const isPresent = state.Syori_rireki1s.some(
                            (existingItem) =>
                            existingItem.s1_id === newItem.s1_id &&
                            existingItem.s_count === newItem.s_count
                        );
                        if (!isPresent) {
                            // 差異対象としてリストアップ
                            const diff_sr1 = new Syori_rireki1_diff();
                            diff_sr1.s1_id = newItem.s1_id;
                            diff_sr1.s_count = newItem.s_count;
                            updatedDiff_sr1.push(diff_sr1);
                            if (newItem.s1_id === updatedSelectedSyoriRireki1?.s1_id) {
                                // 同じ処理IDの場合、最新回数を選択し直す(SR1)
                                updatedSelectedSyoriRireki1 = newItem;
                            }
                        }
                    });
                }
            }

            //選択状態の処理履歴に最新データを反映
            // action.Syori_rireki1s内にupdatedSelectedSyoriRireki1と一致する要素があれば、その要素に更新を反映
            const index = action.Syori_rireki1s.findIndex(
                (Syori_rireki1: { s1_id: number; s_count: number; }) =>
                Syori_rireki1.s1_id === updatedSelectedSyoriRireki1?.s1_id &&
                Syori_rireki1.s_count === updatedSelectedSyoriRireki1?.s_count
            );
            if (index !== -1) {
                //処理履歴1へ反映
                updatedSelectedSyoriRireki1 = action.Syori_rireki1s[index];
            }

            //親の処理回数に、子も合わせる
            if (updatedSelectedSyoriRireki1){
                for (const s2_id in updatedSelectedSyoriRireki1.syori_rireki2s) {
                    const sr2 = updatedSelectedSyoriRireki1.syori_rireki2s[s2_id];
                    if (sr2.s1_id === updatedSelectedSyoriRireki2?.s1_id &&
                        sr2.s2_id === updatedSelectedSyoriRireki2?.s2_id){
                        //処理履歴2へ反映
                        updatedSelectedSyoriRireki2 = sr2;
                    }
                }
            }

            //処理結果を反映
            return {
                ...state,
                Syori_rireki1s: action.Syori_rireki1s,
                sr1_diff: updatedDiff_sr1,
                selectedSyori_rireki1: updatedSelectedSyoriRireki1,
                selectedSyori_rireki2: updatedSelectedSyoriRireki2,
            };
        }
        case REMOVE_DIFF_S1_ID_S_COUNTS: {
            //対象を差異から取り除く
            let updatedDiffCounts = [...state.sr1_diff];
            updatedDiffCounts = updatedDiffCounts.filter(item => !(item.s1_id === action.s1_id && item.s_count === action.s_count));
            return {...state,sr1_diff: updatedDiffCounts};
        }
                  
        case ADD_SYORI_RIREKI1: {
            // let maxId: number = Math.max.apply(Math, state.Syori_rireki1s.map(function(o) { return o.syori_rireki1_id; }));
            // action.syori_rireki1.id = maxId + 1;
            return { ...state, Syori_rireki1s: [...state.Syori_rireki1s, action.syori_rireki1]};
        }
        case EDIT_SYORI_RIREKI1: {
            const foundIndex: number = state.Syori_rireki1s.findIndex(pr => pr.s1_id === action.syori_rireki1.s1_id && pr.s_count === action.syori_rireki1.s_count);
            let syori_rireki1s: ISyori_rireki1[] = state.Syori_rireki1s;
            syori_rireki1s[foundIndex] = action.syori_rireki1;
            return { ...state, Syori_rireki1s: syori_rireki1s };
        }
        case REMOVE_SYORI_RIREKI1: {
            return { ...state, Syori_rireki1s: state.Syori_rireki1s.filter(pr => pr.s1_id !== action.s1_id && pr.s_count !== action.s_count) };
        }
        case CHANGE_SYORI_RIREKI1_PENDING_EDIT: {
            return { ...state, selectedSyori_rireki1: action.syori_rireki1 };
        }
        case CLEAR_SYORI_RIREKI1_PENDING_EDIT: {
            return { ...state, selectedSyori_rireki1: null };
        }
        case CHANGE_SYORI_RIREKI2_PENDING_EDIT: {
            return { ...state, selectedSyori_rireki2: action.syori_rireki2 };
        }
        case CLEAR_SYORI_RIREKI2_PENDING_EDIT: {
            return { ...state, selectedSyori_rireki2: null };
        }
        case CHANGE_SYORI_RIREKI3_PENDING_EDIT: {
            return { ...state, selectedSyori_rireki3: action.syori_rireki3 };
        }
        case CLEAR_SYORI_RIREKI3_PENDING_EDIT: {
            return { ...state, selectedSyori_rireki3: null };
        }
        case SET_SYORI_RIREKI1_ALL_COUNT: 
        {
            return { ...state, all_count: action.count };
        }

        case ADD_SYORI_RIREKI1_HISTORY: {
            // let maxId: number = Math.max.apply(Math, state.Syori_rireki1Historys.map(function(o) { return o.syori_rireki1_id; }));
            // action.syori_rireki1.id = maxId + 1;
            return { ...state, Syori_rireki1Historys: [...state.Syori_rireki1Historys, action.syori_rireki1]};
        }
        case CLEAR_SYORI_RIREKI1_HISTORY: {
            let Syori_rireki1Historys: ISyori_rireki1[] = state.Syori_rireki1Historys;
            Syori_rireki1Historys = [];
            return { ...state, Syori_rireki1Historys: Syori_rireki1Historys };
        }

        case SETISSCROLLEDTOBOTTOM: 
        {
            return { ...state, isScrolledToBottom: action.value };
        }

        default:
            return state;
    }
}

export default syori_rireki1Reducer;
