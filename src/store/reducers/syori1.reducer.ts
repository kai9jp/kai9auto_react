import { ISyori1State,IActionBase } from "../models/root.interface";
import { ADD_SYORI1, CHANGE_SYORI1_PENDING_EDIT, EDIT_SYORI1, REMOVE_SYORI1,
    CLEAR_SYORI1_PENDING_EDIT, SET_SYORI1_MODIFICATION_STATE,SET_SYORI1_ALL_COUNT,
    CLEAR_SYORI1,
    ADD_SYORI1_HISTORY,CLEAR_SYORI1_HISTORY, CHANGESELECTEDSYORI1_S1_ID} from "../actions/syori1.action";
import { ISyori1, Syori1ModificationStatus,Syori1 } from "../models/syori1.interface";

const initialState: ISyori1State = {
    Syori1s: [],
    selectedSyori1: null,
    modificationState: Syori1ModificationStatus.None,
    IsFirst: false,
    all_count: 0,
    Syori1Historys: [],
    selectedSyori1_s1_id: null,
};

function syori1Reducer(state: ISyori1State = initialState, action: IActionBase): ISyori1State {
    switch (action.type) {
        case SET_SYORI1_MODIFICATION_STATE: {
            return { ...state, modificationState: action.value };
        }
        case CLEAR_SYORI1: {
            let syori1s: ISyori1[] = state.Syori1s;
            syori1s = [];
            return { ...state, Syori1s: syori1s };
        }
        case ADD_SYORI1: {
            // let maxId: number = Math.max.apply(Math, state.Syori1s.map(function(o) { return o.syori1_id; }));
            // action.syori1.id = maxId + 1;
            return { ...state, Syori1s: [...state.Syori1s, action.syori1]};
        }
        case EDIT_SYORI1: {
            const foundIndex: number = state.Syori1s.findIndex(pr => pr.s1_id === action.syori1.s1_id);
            let syori1s: ISyori1[] = state.Syori1s;
            syori1s[foundIndex] = action.syori1;
            return { ...state, Syori1s: syori1s };
        }
        case REMOVE_SYORI1: {
            return { ...state, Syori1s: state.Syori1s.filter(pr => pr.s1_id !== action.s1_id) };
        }
        case CHANGE_SYORI1_PENDING_EDIT: {
            return { ...state, selectedSyori1: action.syori1 };
        }
        case CHANGESELECTEDSYORI1_S1_ID: {
            return { ...state, selectedSyori1_s1_id: action.s1_id };
        }
        case CLEAR_SYORI1_PENDING_EDIT: {
            return { ...state, selectedSyori1: null };
        }
        case SET_SYORI1_ALL_COUNT: 
        {
            return { ...state, all_count: action.count };
        }

        case ADD_SYORI1_HISTORY: {
            // let maxId: number = Math.max.apply(Math, state.Syori1Historys.map(function(o) { return o.syori1_id; }));
            // action.syori1.id = maxId + 1;
            return { ...state, Syori1Historys: [...state.Syori1Historys, action.syori1]};
        }
        case CLEAR_SYORI1_HISTORY: {
            let Syori1Historys: ISyori1[] = state.Syori1Historys;
            Syori1Historys = [];
            return { ...state, Syori1Historys: Syori1Historys };
        }


        default:
            return state;
    }
}

export default syori1Reducer;
