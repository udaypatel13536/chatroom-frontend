import axios from "axios";
import { atom, selector } from "recoil";
import { Backend_URL } from "../../config";
import type { RoomList } from "../componet/sidebar";


export const myRoomList = atom<RoomList[]>({
    key : 'myRoomList',
    default : selector({
       key :'myRoomList/selector',
       get : async()=>{
        const token = localStorage.getItem('token')
        const res = await axios.get(`${Backend_URL}/api/room/my`,{
            headers :{
                'Authorization':token
            }
        })
        return res.data.data
       } 
    })
})

export const myroomList_id = selector({
    key :'myMessagesList',
    get :({get})=>{
        const myallRoom= get(myRoomList)
       return myallRoom.map((room)=>(
          room.room_id  
        ))

    }
        
})