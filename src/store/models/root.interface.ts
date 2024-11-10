import { IProduct, ProductModificationStatus } from "./product.interface";
import { INotification } from "./notification.interface";
import { IOrder } from "./order.interface";
import { IAccount } from "./account.interface";
import { IAutoLogOff } from "./autologoff.interface";
import { ISyori1,Syori1ModificationStatus } from "./syori1.interface";
import { IM_keyword1,M_keyword1ModificationStatus } from "./m_keyword1.interface";
import { IM_keyword2 } from "./m_keyword2.interface";
import { ISyori_rireki1,ISyori_rireki1_diff,Syori_rireki1ModificationStatus } from "./syori_rireki1.interface";
import { ISyori_rireki2 } from "./syori_rireki2.interface";
import { ISyori_rireki3 } from "./syori_rireki3.interface";
import { IApp_env,App_envModificationStatus } from "./app_env.interface";

export interface IStateType {
    root: IRootStateType;
    products: IProductState;
    notifications: INotificationState;
    orders: IOrdersState;
    account: IAccount;
    autologoff: IAutoLogOff;
    syori1s: ISyori1State;
    m_keyword1s: IM_keyword1State;
    syori_rireki1s: ISyori_rireki1State;
    App_envs: IApp_envState;
}

export interface ISyori1State {
    Syori1s: ISyori1[];
    selectedSyori1: ISyori1 | null;
    modificationState: Syori1ModificationStatus;
    IsFirst: boolean;
    all_count: number;
    Syori1Historys: ISyori1[];
    selectedSyori1_s1_id: number | null;
}

export interface ISyori1PagenationState {
    CurrentPage: number;
    numberOfDisplaysPerpage: number;
}
export interface IM_keyword1State {
    M_keyword1s: IM_keyword1[];
    M_keyword2s: { [keyword: string]: IM_keyword2 };
    selectedM_keyword2 : IM_keyword2 | null;
    modificationState: M_keyword1ModificationStatus;
    IsFirst: boolean;
    all_count: number;
    M_keyword1Historys: IM_keyword1[];
}

export interface IM_keyword1PagenationState {
    CurrentPage: number;
    numberOfDisplaysPerpage: number;
}

export interface ISyori_rireki1State {
    Syori_rireki1s: ISyori_rireki1[];
    selectedSyori_rireki1: ISyori_rireki1 | null;
    selectedSyori_rireki2: ISyori_rireki2 | null;
    selectedSyori_rireki3: ISyori_rireki3 | null;
    modificationState: Syori_rireki1ModificationStatus;
    modificationState2: Syori_rireki1ModificationStatus;
    modificationState3: Syori_rireki1ModificationStatus;
    IsFirst: boolean;
    all_count: number;
    Syori_rireki1Historys: ISyori_rireki1[];
    sr1_diff: ISyori_rireki1_diff[];
    isScrolledToBottom: boolean;
}

export interface ISyori_rireki1PagenationState {
    CurrentPage: number;
    numberOfDisplaysPerpage: number;
}

export interface IRootPageStateType {
    area: string;
    subArea: string;
}

export interface IRootStateType {
    page: IRootPageStateType;
}

export interface IProductState {
    products: IProduct[];
    selectedProduct: IProduct | null;
    modificationState: ProductModificationStatus;
}


export interface InumberOfDisplaysPerpageState {
    value: number;
}

export interface IUserPagenationState {
    CurrentPage: number;
    numberOfDisplaysPerpage: number;
}

export interface IGroupPagenationState {
    CurrentPage: number;
    numberOfDisplaysPerpage: number;
}

export interface IServerPagenationState {
    CurrentPage: number;
    numberOfDisplaysPerpage: number;
}

export interface IJobinfoPagenationState {
    CurrentPage: number;
    numberOfDisplaysPerpage: number;
}

export interface IActionBase {
    type: string;
    [prop: string]: any;
}

export interface IOrdersState {
    orders: IOrder[];
}

export interface INotificationState {
    notifications: INotification[];
}

export interface IApp_envState {
    App_env: IApp_env| null;
    modificationState: App_envModificationStatus;
    IsFirst: boolean;
    all_count: number;
    App_envHistorys: IApp_env[];
}

export interface IApp_envPagenationState {
    CurrentPage: number;
    numberOfDisplaysPerpage: number;
}


