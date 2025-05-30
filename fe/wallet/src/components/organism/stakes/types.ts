export interface IStakesHistory {
    type: string[];
    holder: string[];
    scpt: string[];
    withdrawn: string[];
    time: string[];
}

export interface IStakesHistoryBack {
    _id: string;
    type: string;
    holder: string;
    source: string;
    amount: string;
    withdrawn: boolean;
    return_height: string;
}
