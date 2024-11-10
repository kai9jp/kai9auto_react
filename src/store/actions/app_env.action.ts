import { IApp_env, App_envModificationStatus} from "../models/app_env.interface";

export const SET_App_env_MODIFICATION_STATE: string = "SET_App_env_MODIFICATION_STATE";
export const SET_App_env: string = "SET_App_env";
export const REMOVE_App_env: string = "REMOVE_App_env";
export const CHANGE_App_env_PENDING_EDIT: string = "CHANGE_App_env_PENDING_EDIT";
export const CLEAR_App_env_PENDING_EDIT: string = "CLEAR_App_env_PENDING_EDIT";
export const SET_App_env_ALL_COUNT: string = "SET_App_env_ALL_COUNT";
export const ADD_App_env_HISTORY: string = "ADD_App_env_HISTORY";
export const CLEAR_App_env_HISTORY: string = "CLEAR_App_env_HISTORY";

export function setApp_env(App_env: IApp_env): ISetApp_envActionType {
    return { type: SET_App_env, App_env: App_env };
}

export function removeApp_env(dumy_id: number): IRemoveApp_envActionType {
    return { type: REMOVE_App_env, dumy_id: dumy_id };
}

export function changeSelectedApp_env(App_env: IApp_env): IChangeSelectedApp_envActionType {
    return { type: CHANGE_App_env_PENDING_EDIT, App_env: App_env };
}

export function clearSelectedApp_env(): IClearSelectedApp_envActionType {
    return { type: CLEAR_App_env_PENDING_EDIT };
}

export function setModificationState(value: App_envModificationStatus): ISetModificationStateActionType {
    return { type: SET_App_env_MODIFICATION_STATE, value: value };
}

export function setAllCount(count: number): ISetAllCountActionType {
    return { type: SET_App_env_ALL_COUNT, count: count };
}


export function ClearApp_envhistory(): IClearApp_envHistoryActionType {
    return { type: CLEAR_App_env_HISTORY };
}

export function addApp_envHistory(App_env: IApp_env): IAddApp_envHistoryActionType {
    return { type: ADD_App_env_HISTORY, App_env: App_env };
}


interface ISetModificationStateActionType { type: string, value:  App_envModificationStatus};

interface ISetApp_envActionType { type: string, App_env: IApp_env };
interface IRemoveApp_envActionType { type: string, dumy_id: number };
interface IChangeSelectedApp_envActionType { type: string, App_env: IApp_env };
interface IClearSelectedApp_envActionType { type: string };
interface ISetModificationStateActionType { type: string, value:  App_envModificationStatus};
interface ISetAllCountActionType { type: string, count: number };
interface IClearApp_envHistoryActionType { type: string };
interface IAddApp_envHistoryActionType { type: string, App_env: IApp_env };
