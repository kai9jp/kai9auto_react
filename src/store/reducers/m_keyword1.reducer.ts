import { IM_keyword1State,IActionBase } from "../models/root.interface";
import { ADD_M_KEYWORD1, EDIT_M_KEYWORD1, 
    SET_M_KEYWORD1_MODIFICATION_STATE,SET_M_KEYWORD1_ALL_COUNT,
    CLEAR_M_KEYWORD1,
    ADD_M_KEYWORD1_HISTORY,CLEAR_M_KEYWORD1_HISTORY, UPDATE_M_KEYWORD2S, CHANGE_SELECTED_M_KEYWORD2} from "../actions/m_keyword1.action";
import { IM_keyword1, M_keyword1ModificationStatus } from "../models/m_keyword1.interface";

const initialState: IM_keyword1State = {
    M_keyword1s: [],
    M_keyword2s: {},
    selectedM_keyword2 : null,
    modificationState: M_keyword1ModificationStatus.None,
    IsFirst: false,
    all_count: 0,
    M_keyword1Historys: [],
};

function m_keyword1Reducer(state: IM_keyword1State = initialState, action: IActionBase): IM_keyword1State {
    switch (action.type) {
        case SET_M_KEYWORD1_MODIFICATION_STATE: {
            return { ...state, modificationState: action.value };
        }
        case CLEAR_M_KEYWORD1: {
            let m_keyword1s: IM_keyword1[] = state.M_keyword1s;
            m_keyword1s = [];
            return { ...state, M_keyword1s: m_keyword1s };
        }
        case ADD_M_KEYWORD1: {
            // let maxId: number = Math.max.apply(Math, state.M_keyword1s.map(function(o) { return o.m_keyword1_id; }));
            // action.m_keyword1.id = maxId + 1;
            return { ...state, M_keyword1s: [...state.M_keyword1s, action.m_keyword1]};
        }
        case EDIT_M_KEYWORD1: {
            const foundIndex: number = state.M_keyword1s.findIndex(pr => pr.modify_count === action.m_keyword1.modify_count);
            let m_keyword1s: IM_keyword1[] = state.M_keyword1s;
            m_keyword1s[foundIndex] = action.m_keyword1;
            return { ...state, M_keyword1s: m_keyword1s };
        }
        case SET_M_KEYWORD1_ALL_COUNT: 
        {
            return { ...state, all_count: action.count };
        }

        case ADD_M_KEYWORD1_HISTORY: {
            // let maxId: number = Math.max.apply(Math, state.M_keyword1Historys.map(function(o) { return o.m_keyword1_id; }));
            // action.m_keyword1.id = maxId + 1;
            return { ...state, M_keyword1Historys: [...state.M_keyword1Historys, action.m_keyword1]};
        }
        case CLEAR_M_KEYWORD1_HISTORY: {
            let M_keyword1Historys: IM_keyword1[] = state.M_keyword1Historys;
            M_keyword1Historys = [];
            return { ...state, M_keyword1Historys: M_keyword1Historys };
        }

        case UPDATE_M_KEYWORD2S: 
        {
            return { ...state, M_keyword2s: action.M_keyword2s };
        }

        case CHANGE_SELECTED_M_KEYWORD2: {
            return { ...state, selectedM_keyword2: action.M_keyword2 };
        }


        default:
            return state;
    }
}

export default m_keyword1Reducer;
