import { ISyori1, Syori1ModificationStatus} from "../models/syori1.interface";

export const SET_SYORI1_MODIFICATION_STATE: string = "SET_SYORI1_MODIFICATION_STATE";
export const ADD_SYORI1: string = "ADD_SYORI1";
export const EDIT_SYORI1: string = "EDIT_SYORI1";
export const REMOVE_SYORI1: string = "REMOVE_SYORI1";
export const CHANGE_SYORI1_PENDING_EDIT: string = "CHANGE_SYORI1_PENDING_EDIT";
export const CLEAR_SYORI1_PENDING_EDIT: string = "CLEAR_SYORI1_PENDING_EDIT";
export const SET_SYORI1_ALL_COUNT: string = "SET_SYORI1_ALL_COUNT";
export const CLEAR_SYORI1: string = "CLEAR_SYORI1";
export const ADD_SYORI1_HISTORY: string = "ADD_SYORI1_HISTORY";
export const CLEAR_SYORI1_HISTORY: string = "CLEAR_SYORI1_HISTORY";
export const CHANGESELECTEDSYORI1_S1_ID: string = "CHANGESELECTEDSYORI1_S1_ID";

export function ClearSyori1(): IClearSyori1ActionType {
    return { type: CLEAR_SYORI1 };
}

export function addSyori1(syori1: ISyori1): IAddSyori1ActionType {
    return { type: ADD_SYORI1, syori1: syori1 };
}

export function editSyori1(syori1: ISyori1): IEditSyori1ActionType {
    return { type: EDIT_SYORI1, syori1: syori1 };
}

export function removeSyori1(s1_id: number): IRemoveSyori1ActionType {
    return { type: REMOVE_SYORI1, s1_id: s1_id };
}

export function changeSelectedSyori1(syori1: ISyori1): IChangeSelectedSyori1ActionType {
    return { type: CHANGE_SYORI1_PENDING_EDIT, syori1: syori1 };
}

export function changeSelectedSyori1_s1_id(s1_id: number): IChangeSelectedSyori1S1idActionType {
    return { type: CHANGESELECTEDSYORI1_S1_ID, s1_id: s1_id };
}


export function clearSelectedSyori1(): IClearSelectedSyori1ActionType {
    return { type: CLEAR_SYORI1_PENDING_EDIT };
}

export function setModificationState(value: Syori1ModificationStatus): ISetModificationStateActionType {
    return { type: SET_SYORI1_MODIFICATION_STATE, value: value };
}

export function setAllCount(count: number): ISetAllCountActionType {
    return { type: SET_SYORI1_ALL_COUNT, count: count };
}


export function ClearSyori1history(): IClearSyori1HistoryActionType {
    return { type: CLEAR_SYORI1_HISTORY };
}

export function addSyori1History(syori1: ISyori1): IAddSyori1HistoryActionType {
    return { type: ADD_SYORI1_HISTORY, syori1: syori1 };
}


interface ISetModificationStateActionType { type: string, value:  Syori1ModificationStatus};

interface IClearSyori1ActionType { type: string };
interface IAddSyori1ActionType { type: string, syori1: ISyori1 };
interface IEditSyori1ActionType { type: string, syori1: ISyori1 };
interface IRemoveSyori1ActionType { type: string, s1_id: number };
interface IChangeSelectedSyori1ActionType { type: string, syori1: ISyori1 };
interface IClearSelectedSyori1ActionType { type: string };
interface ISetModificationStateActionType { type: string, value:  Syori1ModificationStatus};
interface ISetAllCountActionType { type: string, count: number };
interface IClearSyori1HistoryActionType { type: string };
interface IAddSyori1HistoryActionType { type: string, syori1: ISyori1 };
interface IChangeSelectedSyori1S1idActionType { type: string, s1_id: number };
