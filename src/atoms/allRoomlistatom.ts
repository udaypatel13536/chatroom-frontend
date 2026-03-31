import axios from "axios";
import { atom, selector } from "recoil";
import { Backend_URL } from "../../config";
import type { RoomList } from "../componet/sidebar";

export const roomList =    atom<RoomList[]>({
    key: "roomListatom",
    default: selector({
        key : 'roomList/Defult',
        get:async ()=>{
           const res =  await axios.get(`${Backend_URL}/api/room/`)
           return res.data.data
        }
    })
})      