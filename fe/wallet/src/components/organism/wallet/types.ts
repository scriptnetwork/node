import { EWALLETS } from "utils/types/wallet";

export interface ITabs {
    title: EWALLETS;
    active: boolean;
    link: string;
}