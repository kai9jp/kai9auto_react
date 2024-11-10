import { ISyori_rireki2 } from "store/models/syori_rireki2.interface";
import { ISyori_rireki1, Syori_rireki1ModificationStatus} from "../models/syori_rireki1.interface";
import { ISyori_rireki3 } from "store/models/syori_rireki3.interface";

export const SET_SYORI_RIREKI1_MODIFICATION_STATE: string = "SET_SYORI_RIREKI1_MODIFICATION_STATE";
export const SET_SYORI_RIREKI1_MODIFICATION_STATE2: string = "SET_SYORI_RIREKI1_MODIFICATION_STATE2";
export const SET_SYORI_RIREKI1_MODIFICATION_STATE3: string = "SET_SYORI_RIREKI1_MODIFICATION_STATE3";
export const ADD_SYORI_RIREKI1: string = "ADD_SYORI_RIREKI1";
export const EDIT_SYORI_RIREKI1: string = "EDIT_SYORI_RIREKI1";
export const REMOVE_SYORI_RIREKI1: string = "REMOVE_SYORI_RIREKI1";
export const CHANGE_SYORI_RIREKI1_PENDING_EDIT: string = "CHANGE_SYORI_RIREKI1_PENDING_EDIT";
export const CLEAR_SYORI_RIREKI1_PENDING_EDIT: string = "CLEAR_SYORI_RIREKI1_PENDING_EDIT";
export const CHANGE_SYORI_RIREKI2_PENDING_EDIT: string = "CHANGE_SYORI_RIREKI2_PENDING_EDIT";
export const CLEAR_SYORI_RIREKI2_PENDING_EDIT: string = "CLEAR_SYORI_RIREKI2_PENDING_EDIT";
export const CHANGE_SYORI_RIREKI3_PENDING_EDIT: string = "CHANGE_SYORI_RIREKI3_PENDING_EDIT";
export const CLEAR_SYORI_RIREKI3_PENDING_EDIT: string = "CLEAR_SYORI_RIREKI3_PENDING_EDIT";
export const SET_SYORI_RIREKI1_ALL_COUNT: string = "SET_SYORI_RIREKI1_ALL_COUNT";
export const CLEAR_SYORI_RIREKI1: string = "CLEAR_SYORI_RIREKI1";
export const ADD_SYORI_RIREKI1_HISTORY: string = "ADD_SYORI_RIREKI1_HISTORY";
export const CLEAR_SYORI_RIREKI1_HISTORY: string = "CLEAR_SYORI_RIREKI1_HISTORY";
export const UPDATE_SYORI_RIREKI1S: string = "UPDATE_SYORI_RIREKI1S";
export const REMOVE_DIFF_S1_ID_S_COUNTS: string = "REMOVE_DIFF_S1_ID_S_COUNTS";
export const SETISSCROLLEDTOBOTTOM: string = "SETISSCROLLEDTOBOTTOM";


export function ClearSyori_rireki1(): IClearSyori_rireki1ActionType {
    return { type: CLEAR_SYORI_RIREKI1 };
}

export function addSyori_rireki1(syori_rireki1: ISyori_rireki1): IAddSyori_rireki1ActionType {
    return { type: ADD_SYORI_RIREKI1, syori_rireki1: syori_rireki1 };
}

export function updateSyori_rireki1s(Syori_rireki1s: ISyori_rireki1[],CurrentPage:number ): IUpdateSyori_rireki1sActionType {
    return { type: UPDATE_SYORI_RIREKI1S, Syori_rireki1s: Syori_rireki1s,CurrentPage:CurrentPage };
}

export function editSyori_rireki1(syori_rireki1: ISyori_rireki1): IEditSyori_rireki1ActionType {
    return { type: EDIT_SYORI_RIREKI1, syori_rireki1: syori_rireki1 };
}

export function changeSelectedSyori_rireki1(syori_rireki1: ISyori_rireki1): IChangeSelectedSyori_rireki1ActionType {
    return { type: CHANGE_SYORI_RIREKI1_PENDING_EDIT, syori_rireki1: syori_rireki1 };
}

export function clearSelectedSyori_rireki1(): IClearSelectedSyori_rireki1ActionType {
    return { type: CLEAR_SYORI_RIREKI1_PENDING_EDIT };
}

export function changeSelectedSyori_rireki2(syori_rireki2: ISyori_rireki2): IChangeSelectedSyori_rireki2ActionType {
    return { type: CHANGE_SYORI_RIREKI2_PENDING_EDIT, syori_rireki2: syori_rireki2 };
}

export function clearSelectedSyori_rireki2(): IClearSelectedSyori_rireki2ActionType {
    return { type: CLEAR_SYORI_RIREKI2_PENDING_EDIT };
}

export function changeSelectedSyori_rireki3(syori_rireki3: ISyori_rireki3): IChangeSelectedSyori_rireki3ActionType {
    return { type: CHANGE_SYORI_RIREKI3_PENDING_EDIT, syori_rireki3: syori_rireki3 };
}

export function clearSelectedSyori_rireki3(): IClearSelectedSyori_rireki3ActionType {
    return { type: CLEAR_SYORI_RIREKI3_PENDING_EDIT };
}

export function setModificationState(value: Syori_rireki1ModificationStatus): ISetModificationStateActionType {
    return { type: SET_SYORI_RIREKI1_MODIFICATION_STATE, value: value };
}

export function setModificationState2(value: Syori_rireki1ModificationStatus): ISetModificationStateActionType {
    return { type: SET_SYORI_RIREKI1_MODIFICATION_STATE2, value: value };
}

export function setModificationState3(value: Syori_rireki1ModificationStatus): ISetModificationStateActionType {
    return { type: SET_SYORI_RIREKI1_MODIFICATION_STATE3, value: value };
}

export function setAllCount(count: number): ISetAllCountActionType {
    return { type: SET_SYORI_RIREKI1_ALL_COUNT, count: count };
}


export function ClearSyori_rireki1history(): IClearSyori_rireki1HistoryActionType {
    return { type: CLEAR_SYORI_RIREKI1_HISTORY };
}

export function addSyori_rireki1History(syori_rireki1: ISyori_rireki1): IAddSyori_rireki1HistoryActionType {
    return { type: ADD_SYORI_RIREKI1_HISTORY, syori_rireki1: syori_rireki1 };
}

export function remove_diff_s1_id_s_counts(s1_id: number,s_count: number): ISetremovediffs1idscountsActionType {
    return { type: REMOVE_DIFF_S1_ID_S_COUNTS, s1_id: s1_id,s_count:s_count };
}

export function SetisScrolledToBottom(value: boolean): ISetisScrolledToBottomActionType {
    return { type: SETISSCROLLEDTOBOTTOM, value: value };
}


interface ISetModificationStateActionType { type: string, value:  Syori_rireki1ModificationStatus};
interface IClearSyori_rireki1ActionType { type: string };
interface IAddSyori_rireki1ActionType { type: string, syori_rireki1: ISyori_rireki1 };
interface IEditSyori_rireki1ActionType { type: string, syori_rireki1: ISyori_rireki1 };
interface IChangeSelectedSyori_rireki1ActionType { type: string, syori_rireki1: ISyori_rireki1 };
interface IChangeSelectedSyori_rireki2ActionType { type: string, syori_rireki2: ISyori_rireki2 };
interface IChangeSelectedSyori_rireki3ActionType { type: string, syori_rireki3: ISyori_rireki3 };
interface IClearSelectedSyori_rireki1ActionType { type: string };
interface IClearSelectedSyori_rireki2ActionType { type: string };
interface IClearSelectedSyori_rireki3ActionType { type: string };
interface ISetModificationStateActionType { type: string, value:  Syori_rireki1ModificationStatus};
interface ISetAllCountActionType { type: string, count: number };
interface IClearSyori_rireki1HistoryActionType { type: string };
interface IAddSyori_rireki1HistoryActionType { type: string, syori_rireki1: ISyori_rireki1 };
interface IUpdateSyori_rireki1sActionType { type: string ; Syori_rireki1s: ISyori_rireki1[],CurrentPage:number };
interface ISetremovediffs1idscountsActionType { type: string, s1_id: number, s_count: number };
interface ISetisScrolledToBottomActionType { type: string, value: boolean };

