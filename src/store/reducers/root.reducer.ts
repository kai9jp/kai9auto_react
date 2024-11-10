import { combineReducers, Reducer } from "redux";
import { UPDATE_CURRENT_PATH } from "../actions/root.actions";
import { IRootStateType, IActionBase, IStateType } from "../models/root.interface";
import productsReducer from "./products.reducer";
import notificationReducer from "./notification.reducer";
import orderReducer from "./order.reducer";
import accountReducer from "./account.reducer";
import autologoffReducer from "./autologoff.reducer";
import syori1Reducer from "./syori1.reducer";
import m_keyword1Reducer from "./m_keyword1.reducer";
import syori_rireki1Reducer from "./syori_rireki1.reducer";
import App_envReducer from "./app_env.reducer";


const initialState: IRootStateType = {
    page: {area: "home", subArea: ""}
};

function rootReducer(state: IRootStateType = initialState, action: IActionBase): IRootStateType {
    switch (action.type) {
        case UPDATE_CURRENT_PATH:
            return { ...state, page: {area: action.area, subArea: action.subArea}};
        default:
            return state;
    }
}

const rootReducers: Reducer<IStateType> = combineReducers({
    root: rootReducer,
    products: productsReducer,
    notifications: notificationReducer,
    orders: orderReducer,
    account: accountReducer,
    autologoff:autologoffReducer, 
    syori1s: syori1Reducer,
    m_keyword1s: m_keyword1Reducer,
    syori_rireki1s: syori_rireki1Reducer,
    App_envs: App_envReducer,
});

export default rootReducers;