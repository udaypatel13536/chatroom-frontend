import { atom } from "recoil";

export interface Roomatom{

}
export const activeRoom  = atom({
    key : 'activeRoom',
    default : ''//roomId
})

