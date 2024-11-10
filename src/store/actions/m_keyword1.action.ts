import { IM_keyword1, M_keyword1ModificationStatus} from "../models/m_keyword1.interface";
import { IM_keyword2 } from "../models/m_keyword2.interface";

export const SET_M_KEYWORD1_MODIFICATION_STATE: string = "SET_M_KEYWORD1_MODIFICATION_STATE";
export const ADD_M_KEYWORD1: string = "ADD_M_KEYWORD1";
export const EDIT_M_KEYWORD1: string = "EDIT_M_KEYWORD1";
export const CHANGE_M_KEYWORD1_PENDING_EDIT: string = "CHANGE_M_KEYWORD1_PENDING_EDIT";
export const CLEAR_M_KEYWORD1_PENDING_EDIT: string = "CLEAR_M_KEYWORD1_PENDING_EDIT";
export const SET_M_KEYWORD1_ALL_COUNT: string = "SET_M_KEYWORD1_ALL_COUNT";
export const CLEAR_M_KEYWORD1: string = "CLEAR_M_KEYWORD1";
export const ADD_M_KEYWORD1_HISTORY: string = "ADD_M_KEYWORD1_HISTORY";
export const CLEAR_M_KEYWORD1_HISTORY: string = "CLEAR_M_KEYWORD1_HISTORY";
export const UPDATE_M_KEYWORD2S: string = "UPDATE_M_KEYWORD2S";
export const CHANGE_SELECTED_M_KEYWORD2: string = "CHANGE_SELECTED_M_KEYWORD2";

export function ClearM_keyword1(): IClearM_keyword1ActionType {
    return { type: CLEAR_M_KEYWORD1 };
}

export function addM_keyword1(m_keyword1: IM_keyword1): IAddM_keyword1ActionType {
    return { type: ADD_M_KEYWORD1, m_keyword1: m_keyword1 };
}

export function editM_keyword1(m_keyword1: IM_keyword1): IEditM_keyword1ActionType {
    return { type: EDIT_M_KEYWORD1, m_keyword1: m_keyword1 };
}

export function changeSelectedM_keyword1(m_keyword1: IM_keyword1): IChangeSelectedM_keyword1ActionType {
    return { type: CHANGE_M_KEYWORD1_PENDING_EDIT, m_keyword1: m_keyword1 };
}

export function clearSelectedM_keyword1(): IClearSelectedM_keyword1ActionType {
    return { type: CLEAR_M_KEYWORD1_PENDING_EDIT };
}

export function setModificationState(value: M_keyword1ModificationStatus): ISetModificationStateActionType {
    return { type: SET_M_KEYWORD1_MODIFICATION_STATE, value: value };
}

export function setAllCount(count: number): ISetAllCountActionType {
    return { type: SET_M_KEYWORD1_ALL_COUNT, count: count };
}


export function ClearM_keyword1history(): IClearM_keyword1HistoryActionType {
    return { type: CLEAR_M_KEYWORD1_HISTORY };
}

export function addM_keyword1History(m_keyword1: IM_keyword1): IAddM_keyword1HistoryActionType {
    return { type: ADD_M_KEYWORD1_HISTORY, m_keyword1: m_keyword1 };
}

export function updateM_keyword2s(M_keyword2s: { [keyword: string]: IM_keyword2 }): IUpdateM_keyword2sActionType {
    return { type: UPDATE_M_KEYWORD2S, M_keyword2s: M_keyword2s };
}

export function changeSelectedM_keyword2(M_keyword2: IM_keyword2): IChangeSelectedM_keyword2ActionType {
    return { type: CHANGE_SELECTED_M_KEYWORD2, M_keyword2: M_keyword2 };
}


interface ISetModificationStateActionType { type: string, value:  M_keyword1ModificationStatus};

interface IClearM_keyword1ActionType { type: string };
interface IAddM_keyword1ActionType { type: string, m_keyword1: IM_keyword1 };
interface IEditM_keyword1ActionType { type: string, m_keyword1: IM_keyword1 };
interface IChangeSelectedM_keyword1ActionType { type: string, m_keyword1: IM_keyword1 };
interface IClearSelectedM_keyword1ActionType { type: string };
interface ISetModificationStateActionType { type: string, value:  M_keyword1ModificationStatus};
interface ISetAllCountActionType { type: string, count: number };
interface IClearM_keyword1HistoryActionType { type: string };
interface IAddM_keyword1HistoryActionType { type: string, m_keyword1: IM_keyword1 };
interface IUpdateM_keyword2sActionType { type: string ; M_keyword2s :{[keyword: string]: IM_keyword2} };
interface IChangeSelectedM_keyword2ActionType { type: string, M_keyword2: IM_keyword2 };
