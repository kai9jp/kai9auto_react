import { IApp_envState,IActionBase } from "../models/root.interface";
import { SET_App_env, 
    SET_App_env_MODIFICATION_STATE,SET_App_env_ALL_COUNT,
    ADD_App_env_HISTORY,CLEAR_App_env_HISTORY} from "../actions/app_env.action";
import { IApp_env, App_envModificationStatus } from "../models/app_env.interface";

const initialState: IApp_envState = {
    App_env: null,
    modificationState: App_envModificationStatus.None,
    IsFirst: false,
    all_count: 0,
    App_envHistorys: [],
};

function App_envReducer(state: IApp_envState = initialState, action: IActionBase): IApp_envState {
    switch (action.type) {
        case SET_App_env_MODIFICATION_STATE: {
            return { ...state, modificationState: action.value };
        }
        case SET_App_env: {
            return { ...state, App_env: action.App_env};
        }
        case SET_App_env_ALL_COUNT: 
        {
            return { ...state, all_count: action.count };
        }

        case ADD_App_env_HISTORY: {
            // let maxId: number = Math.max.apply(Math, state.App_envHistorys.map(function(o) { return o.App_env_id; }));
            // action.App_env.id = maxId + 1;
            return { ...state, App_envHistorys: [...state.App_envHistorys, action.App_env]};
        }
        case CLEAR_App_env_HISTORY: {
            let App_envHistorys: IApp_env[] = state.App_envHistorys;
            App_envHistorys = [];
            return { ...state, App_envHistorys: App_envHistorys };
        }


        default:
            return state;
    }
}

export default App_envReducer;
